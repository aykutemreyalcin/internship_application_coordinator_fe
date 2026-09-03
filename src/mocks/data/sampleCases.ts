import type { AuditLogEntry, Case, ValidationSummary } from '../../api/types'

const ts = (value: string) => value

const passedValidation: ValidationSummary = {
  completeness: { passed: true, issues: [] },
  rules: { passed: true, issues: [] },
}

const incompleteValidation: ValidationSummary = {
  completeness: {
    passed: false,
    issues: [
      {
        field: 'studentId',
        message: 'Student ID is missing',
        severity: 'ERROR',
      },
      {
        field: 'companyName',
        message: 'Company name could not be fully verified from document',
        severity: 'INFO',
      },
    ],
  },
  rules: { passed: true, issues: [] },
}

const incompleteValidationSupervisor: ValidationSummary = {
  completeness: {
    passed: false,
    issues: [
      {
        field: 'supervisorEmail',
        message: 'Supervisor email is missing',
        severity: 'ERROR',
      },
    ],
  },
  rules: { passed: true, issues: [] },
}

const ruleViolationValidation: ValidationSummary = {
  completeness: { passed: true, issues: [] },
  rules: {
    passed: false,
    issues: [
      {
        field: 'internshipEndDate',
        message: 'Internship duration must be at least 84 days (actual: 30)',
        severity: 'ERROR',
      },
      {
        field: 'internshipStartDate',
        message: 'Start date is very close to semester end — verify with coordinator',
        severity: 'WARNING',
      },
    ],
  },
}

export const MOCK_CASES: Case[] = [
  {
    caseId: '11111111-1111-4111-8111-111111111101',
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'READY_FOR_REVIEW',
    studentName: 'Jan Kowalski',
    studentId: '100001',
    companyName: 'Astana Kebab Sp. z o.o.',
    supervisorName: 'Anna Nowak',
    supervisorEmail: 'anna.nowak@astanakebab.pl',
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-06-01',
    internshipEndDate: '2026-10-28',
    recommendation: 'APPROVE',
    recommendationReason: 'All required fields are present; duration complies with rules.',
    validation: passedValidation,
    documents: [{ id: 'd1111111-1111-4111-8111-111111111101', fileName: 'jan-kowalski.pdf', pageCount: 4 }],
    createdAt: ts('2026-06-01T09:00:00.000Z'),
    updatedAt: ts('2026-06-01T09:05:00.000Z'),
  },
  {
    caseId: '11111111-1111-4111-8111-111111111102',
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'APPROVED',
    studentName: 'Maria Wisniewska',
    studentId: '100002',
    companyName: 'Green Logistics SA',
    supervisorName: 'Piotr Zielinski',
    supervisorEmail: 'piotr.z@greenlogistics.pl',
    fieldOfStudy: 'Business Administration',
    internshipStartDate: '2026-03-15',
    internshipEndDate: '2026-08-15',
    recommendation: 'APPROVE',
    recommendationReason: 'Coordinator approved after review.',
    validation: passedValidation,
    documents: [{ id: 'd1111111-1111-4111-8111-111111111102', fileName: 'maria-wisniewska.pdf', pageCount: 3 }],
    createdAt: ts('2026-05-28T11:20:00.000Z'),
    updatedAt: ts('2026-05-29T14:10:00.000Z'),
  },
  {
    caseId: '22222222-2222-4222-8222-222222222201',
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'NEW',
    studentName: 'Tomasz Lewandowski',
    studentId: null,
    companyName: 'Example GmbH',
    supervisorName: 'Anna Nowak',
    supervisorEmail: 'supervisor@example.com',
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-06-01',
    internshipEndDate: '2026-10-28',
    recommendation: null,
    recommendationReason: null,
    validation: incompleteValidation,
    documents: [{ id: 'd2222222-2222-4222-8222-222222222201', fileName: 'tomasz-lewandowski.pdf', pageCount: 2 }],
    createdAt: ts('2026-06-02T08:15:00.000Z'),
    updatedAt: ts('2026-06-02T08:15:00.000Z'),
  },
  {
    caseId: '22222222-2222-4222-8222-222222222202',
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'NEW',
    studentName: 'Katarzyna Dabrowska',
    studentId: '200004',
    companyName: 'City Hospital',
    supervisorName: 'Dr. Jan Malinowski',
    supervisorEmail: null,
    fieldOfStudy: 'Nursing',
    internshipStartDate: '2026-07-01',
    internshipEndDate: '2026-11-15',
    recommendation: null,
    recommendationReason: null,
    validation: incompleteValidationSupervisor,
    documents: [{ id: 'd2222222-2222-4222-8222-222222222202', fileName: 'katarzyna-dabrowska.pdf', pageCount: 5 }],
    createdAt: ts('2026-06-02T10:30:00.000Z'),
    updatedAt: ts('2026-06-02T10:30:00.000Z'),
  },
  {
    caseId: '33333333-3333-4333-8333-333333333301',
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'NEW',
    studentName: 'Piotr Zajac',
    studentId: '300001',
    companyName: 'Example GmbH',
    supervisorName: 'Anna Nowak',
    supervisorEmail: 'supervisor@example.com',
    fieldOfStudy: 'Electrical Engineering',
    internshipStartDate: '2026-06-01',
    internshipEndDate: '2026-06-30',
    recommendation: 'REJECT',
    recommendationReason: 'University rules validation failed: internship duration below minimum.',
    validation: ruleViolationValidation,
    documents: [{ id: 'd3333333-3333-4333-8333-333333333301', fileName: 'piotr-zajac.pdf', pageCount: 4 }],
    createdAt: ts('2026-06-03T07:45:00.000Z'),
    updatedAt: ts('2026-06-03T07:50:00.000Z'),
  },
  {
    caseId: '44444444-4444-4444-8444-444444444401',
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'READY_FOR_REVIEW',
    studentName: 'Agnieszka Wojcik',
    studentId: '400001',
    companyName: 'Jan Kowalski IT Services',
    supervisorName: 'Anna Nowak',
    supervisorEmail: 'anna.nowak@jankowalski-it.pl',
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-06-01',
    internshipEndDate: '2026-10-28',
    recommendation: 'CLARIFY',
    recommendationReason: 'Company name matches student name; verify employer is external.',
    validation: passedValidation,
    documents: [{ id: 'd4444444-4444-4444-8444-444444444401', fileName: 'agnieszka-wojcik.pdf', pageCount: 3 }],
    createdAt: ts('2026-06-03T13:00:00.000Z'),
    updatedAt: ts('2026-06-03T13:08:00.000Z'),
  },
]

export const MOCK_AUDIT_LOGS: Record<string, AuditLogEntry[]> = {
  '11111111-1111-4111-8111-111111111101': [
    {
      id: 'a1111111-1111-4111-8111-111111111101',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Application uploaded',
      timestamp: ts('2026-06-01T09:00:00.000Z'),
    },
    {
      id: 'a1111111-1111-4111-8111-111111111102',
      actor: 'Document Extraction Agent',
      action: 'EXTRACTION_COMPLETED',
      detail: 'Fields extracted from PDF',
      timestamp: ts('2026-06-01T09:02:00.000Z'),
    },
    {
      id: 'a1111111-1111-4111-8111-111111111103',
      actor: 'Decision Recommendation Agent',
      action: 'RECOMMENDATION_GENERATED',
      detail: 'Recommendation: APPROVE',
      timestamp: ts('2026-06-01T09:05:00.000Z'),
    },
  ],
  '11111111-1111-4111-8111-111111111102': [
    {
      id: 'a1111111-1111-4111-8111-111111111201',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Application uploaded',
      timestamp: ts('2026-05-28T11:20:00.000Z'),
    },
    {
      id: 'a1111111-1111-4111-8111-111111111202',
      actor: 'COORDINATOR',
      action: 'DECISION_APPLIED',
      detail: 'Decision: APPROVE',
      timestamp: ts('2026-05-29T14:10:00.000Z'),
    },
  ],
  '22222222-2222-4222-8222-222222222201': [
    {
      id: 'a2222222-2222-4222-8222-222222222201',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Application uploaded',
      timestamp: ts('2026-06-02T08:15:00.000Z'),
    },
  ],
  '22222222-2222-4222-8222-222222222202': [
    {
      id: 'a2222222-2222-4222-8222-222222222202',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Application uploaded',
      timestamp: ts('2026-06-02T10:30:00.000Z'),
    },
  ],
  '33333333-3333-4333-8333-333333333301': [
    {
      id: 'a3333333-3333-4333-8333-333333333301',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Application uploaded',
      timestamp: ts('2026-06-03T07:45:00.000Z'),
    },
    {
      id: 'a3333333-3333-4333-8333-333333333302',
      actor: 'University Rules Agent',
      action: 'VALIDATION_FAILED',
      detail: 'Rules validation failed',
      timestamp: ts('2026-06-03T07:50:00.000Z'),
    },
  ],
  '44444444-4444-4444-8444-444444444401': [
    {
      id: 'a4444444-4444-4444-8444-444444444401',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Application uploaded',
      timestamp: ts('2026-06-03T13:00:00.000Z'),
    },
    {
      id: 'a4444444-4444-4444-8444-444444444402',
      actor: 'Decision Recommendation Agent',
      action: 'RECOMMENDATION_GENERATED',
      detail: 'Recommendation: CLARIFY',
      timestamp: ts('2026-06-03T13:08:00.000Z'),
    },
  ],
}

/** Minimal valid PDF returned by document download handler. */
export const MOCK_PDF_BYTES = Uint8Array.from(
  atob(
    'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXS9QYXJlbnQgMiAwIFI+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjE3NQolJUVORA==',
  ),
  (char) => char.charCodeAt(0),
)
