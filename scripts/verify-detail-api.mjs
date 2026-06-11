/**
 * FE-INT-02: Verify case detail endpoints against the real backend.
 *
 * Usage:
 *   npm run verify:detail-api
 *   CASE_ID=<uuid> npm run verify:detail-api
 *
 * Env:
 *   API_BASE_URL  default http://localhost:8080/api
 *   CASE_ID       optional; uses first list item when omitted
 *   SKIP_MUTATIONS  set to 1 to only run read-only checks (detail, validation, audit, PDF)
 */

const API_BASE_URL = (process.env.API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')
const CASE_ID = process.env.CASE_ID?.trim()
const SKIP_MUTATIONS = process.env.SKIP_MUTATIONS === '1'

const results = []

function record(name, ok, detail) {
  results.push({ name, ok, detail })
  const mark = ok ? 'PASS' : 'FAIL'
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function request(method, path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, {
    method,
    headers: options.headers,
    body: options.body,
  })

  const contentType = response.headers.get('content-type') ?? ''
  let body = null

  if (contentType.includes('application/json')) {
    body = await response.json()
  } else if (contentType.includes('application/pdf')) {
    body = await response.arrayBuffer()
  } else if (response.status !== 204) {
    const text = await response.text()
    body = text.length > 0 ? text : null
  }

  return { response, body }
}

async function resolveCaseId() {
  if (CASE_ID) {
    return CASE_ID
  }

  const { response, body } = await request('GET', '/cases?page=0&size=1')
  if (!response.ok) {
    throw new Error(`GET /cases failed (${response.status})`)
  }

  const first = body?.content?.[0]
  if (!first?.caseId) {
    throw new Error('No cases found. Upload a case or seed the test dataset first.')
  }

  return first.caseId
}

async function verifyDetail(caseId) {
  const { response, body } = await request('GET', `/cases/${caseId}`)
  const ok =
    response.ok &&
    body?.caseId === caseId &&
    Array.isArray(body?.documents) &&
    typeof body?.status === 'string'
  record('GET /cases/{id}', ok, ok ? `status=${body.status}` : `status ${response.status}`)
  return body
}

async function verifyValidation(caseId) {
  const { response, body } = await request('GET', `/cases/${caseId}/validation`)
  const ok =
    response.ok &&
    body?.completeness &&
    Array.isArray(body.completeness.issues) &&
    body?.rules &&
    Array.isArray(body.rules.issues)
  record(
    'GET /cases/{id}/validation',
    ok,
    ok
      ? `completeness=${body.completeness.passed}, rules=${body.rules.passed}`
      : `status ${response.status}`,
  )
}

async function verifyAudit(caseId) {
  const { response, body } = await request('GET', `/cases/${caseId}/audit`)
  const ok = response.ok && Array.isArray(body)
  record('GET /cases/{id}/audit', ok, ok ? `${body.length} entries` : `status ${response.status}`)
}

async function verifyPdf(caseId, documents) {
  const doc = documents?.[0]
  if (!doc?.id) {
    record('GET /cases/{id}/documents/{docId}', false, 'case has no documents')
    return
  }

  const { response, body } = await request('GET', `/cases/${caseId}/documents/${doc.id}`)
  const ok = response.ok && body instanceof ArrayBuffer && body.byteLength > 0
  record(
    'GET /cases/{id}/documents/{docId}',
    ok,
    ok ? `${body.byteLength} bytes (${doc.fileName})` : `status ${response.status}`,
  )
}

async function verifyExtract(caseId) {
  const { response, body } = await request('POST', `/cases/${caseId}/extract`)
  const ok = response.ok && body?.caseId === caseId
  record(
    'POST /cases/{id}/extract',
    ok,
    ok ? `status=${body.status}` : extractErrorDetail(response.status, body),
  )
  return body
}

async function verifyRecommendation(caseId) {
  const { response, body } = await request('POST', `/cases/${caseId}/recommendation`)
  const ok = response.ok && body?.caseId === caseId
  record(
    'POST /cases/{id}/recommendation',
    ok,
    ok ? `recommendation=${body.recommendation ?? 'null'}` : extractErrorDetail(response.status, body),
  )
  return body
}

async function verifyClarification(caseId) {
  const { response, body } = await request('POST', `/cases/${caseId}/clarification`)
  const ok =
    response.ok &&
    body?.caseId === caseId &&
    typeof body?.subject === 'string' &&
    typeof body?.body === 'string'
  record(
    'POST /cases/{id}/clarification',
    ok,
    ok ? `draft for ${body.studentName}` : extractErrorDetail(response.status, body),
  )
}

async function verifySupervisor(caseId) {
  const { response, body } = await request('POST', `/cases/${caseId}/supervisor-verification`)
  const ok =
    response.ok &&
    body?.caseId === caseId &&
    typeof body?.subject === 'string' &&
    typeof body?.body === 'string'
  record(
    'POST /cases/{id}/supervisor-verification',
    ok,
    ok ? `draft for ${body.supervisorEmail}` : extractErrorDetail(response.status, body),
  )
}

async function verifyDecision(caseId) {
  const payload = JSON.stringify({
    decision: 'CLARIFY',
    note: 'FE-INT-02 automated detail verification',
  })
  const { response, body } = await request('POST', `/cases/${caseId}/decision`, {
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  })
  const ok = response.ok && body?.caseId === caseId
  record(
    'POST /cases/{id}/decision',
    ok,
    ok ? `status=${body.status}` : extractErrorDetail(response.status, body),
  )
}

function extractErrorDetail(status, body) {
  if (body && typeof body === 'object' && typeof body.message === 'string') {
    return `status ${status}: ${body.message}`
  }
  return `status ${status}`
}

async function main() {
  console.log(`Verifying detail API at ${API_BASE_URL}`)
  if (SKIP_MUTATIONS) {
    console.log('SKIP_MUTATIONS=1 — read-only mode')
  }

  let caseId
  try {
    caseId = await resolveCaseId()
    console.log(`Using case ${caseId}\n`)
  } catch (error) {
    record('Resolve case', false, error instanceof Error ? error.message : String(error))
    printSummary()
    process.exit(1)
  }

  const detail = await verifyDetail(caseId)
  await verifyValidation(caseId)
  await verifyAudit(caseId)
  await verifyPdf(caseId, detail?.documents)

  if (!SKIP_MUTATIONS) {
    await verifyExtract(caseId)
    await verifyValidation(caseId)
    await verifyRecommendation(caseId)
    await verifyClarification(caseId)
    await verifySupervisor(caseId)
    await verifyDecision(caseId)
    await verifyAudit(caseId)
  }

  printSummary()
  process.exit(results.every((entry) => entry.ok) ? 0 : 1)
}

function printSummary() {
  const passed = results.filter((entry) => entry.ok).length
  console.log(`\n${passed}/${results.length} checks passed`)
}

await main()
