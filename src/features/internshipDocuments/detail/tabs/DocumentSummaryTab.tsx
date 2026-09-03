import { useState } from 'react'
import { getMutationErrorMessage } from '../../../../api/hooks/caseQueryUtils'
import { useExtractCase } from '../../../../api/hooks/useExtractCase'
import type {
  Case,
  InternshipJournalPayload,
  JournalWeekEntry,
  LearningOutcomesReportPayload,
} from '../../../../api/types'
import { Button, useToast } from '../../../../components'
import styles from '../DocumentDetail.module.css'

interface DocumentSummaryTabProps {
  caseData: Case
}

function isReportPayload(payload: Case['extractedPayload']): payload is LearningOutcomesReportPayload {
  return payload !== null && 'learningOutcomes' in payload
}

function isJournalPayload(payload: Case['extractedPayload']): payload is InternshipJournalPayload {
  return payload !== null && 'weeklyEntries' in payload
}

function weekTotalHours(week: JournalWeekEntry): number {
  return week.days.reduce((sum, day) => sum + (day.workingHours ?? 0), 0)
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className={styles.fieldCard}>
      <p className={styles.fieldLabel}>{label}</p>
      <p className={styles.fieldValue}>{value?.trim() ? value : '—'}</p>
    </div>
  )
}

function ReportSummary({ payload }: { payload: LearningOutcomesReportPayload }) {
  return (
    <>
      <div className={styles.fieldGrid}>
        <Field label="Student" value={payload.studentName} />
        <Field label="Student ID" value={payload.studentId} />
        <Field label="Report date" value={payload.reportDate} />
        <Field label="Host company" value={payload.hostCompanyOrEmployer} />
        <Field label="Internship start" value={payload.internshipStartDate} />
        <Field label="Internship end" value={payload.internshipEndDate} />
      </div>

      <h3 className={styles.sectionTitle}>Learning outcomes</h3>
      <div className={styles.outcomesTableWrap}>
        <table className={styles.outcomesTable}>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Outcome</th>
              <th scope="col">Ways of achieving</th>
            </tr>
          </thead>
          <tbody>
            {payload.learningOutcomes.map((outcome) => {
              const isShort = !outcome.waysOfAchieving || outcome.waysOfAchieving.trim().length < 20
              return (
                <tr key={outcome.code}>
                  <td className={styles.outcomeCode}>{outcome.code}</td>
                  <td>{outcome.description}</td>
                  <td className={isShort ? styles.warningCell : undefined}>
                    {outcome.waysOfAchieving?.trim() || 'Missing or too short'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3 className={styles.sectionTitle}>Signatures & confirmation</h3>
      <div className={styles.signatureGrid}>
        <div
          className={`${styles.signatureCard} ${payload.studentSignaturePresent ? styles.signaturePresent : styles.signatureMissing}`}
        >
          <p className={styles.fieldLabel}>Student signature</p>
          <p className={styles.fieldValue}>
            {payload.studentSignaturePresent ? 'Present' : 'Missing'}
          </p>
        </div>
        <div
          className={`${styles.signatureCard} ${payload.supervisorSignaturePresent ? styles.signaturePresent : styles.signatureMissing}`}
        >
          <p className={styles.fieldLabel}>Supervisor signature</p>
          <p className={styles.fieldValue}>
            {payload.supervisorName ?? '—'}
            {payload.supervisorSignaturePresent ? ' · Signed' : ' · Not signed'}
          </p>
        </div>
        <div className={styles.signatureCard}>
          <p className={styles.fieldLabel}>Dean / faculty</p>
          <p className={styles.fieldValue}>{payload.deanSupervisorComments ?? '—'}</p>
        </div>
      </div>
    </>
  )
}

function JournalSummary({ payload, caseData }: { payload: InternshipJournalPayload; caseData: Case }) {
  const [openWeeks, setOpenWeeks] = useState<Record<number, boolean>>({ 0: true })

  return (
    <>
      <div className={styles.fieldGrid}>
        <Field label="Faculty" value={payload.faculty} />
        <Field label="Field of study" value={payload.fieldOfStudy ?? caseData.fieldOfStudy} />
        <Field label="Student" value={payload.studentName ?? caseData.studentName} />
        <Field label="Student ID" value={payload.studentId ?? caseData.studentId} />
        <Field label="Study form" value={payload.studyForm} />
        <Field label="Academic year" value={payload.academicYear} />
        <Field label="Company" value={payload.companyName ?? caseData.companyName} />
        <Field label="Company address" value={payload.companyAddress} />
        <Field label="Supervisor" value={payload.companySupervisorName ?? caseData.supervisorName} />
        <Field
          label="Internship period"
          value={`${payload.internshipStartDate ?? caseData.internshipStartDate ?? '?'} → ${payload.internshipEndDate ?? caseData.internshipEndDate ?? '?'}`}
        />
      </div>

      <h3 className={styles.sectionTitle}>Weekly timesheets</h3>
      <div className={styles.weekList}>
        {payload.weeklyEntries.map((week, index) => {
          const total = weekTotalHours(week)
          const isOpen = openWeeks[index] ?? false
          return (
            <article key={`${week.weekStart}-${index}`} className={styles.weekCard}>
              <button
                type="button"
                className={styles.weekHeader}
                aria-expanded={isOpen}
                onClick={() => setOpenWeeks((current) => ({ ...current, [index]: !isOpen }))}
              >
                <span>
                  Week {index + 1}: {week.weekStart ?? '—'} – {week.weekEnd ?? '—'}
                </span>
                <span
                  className={`${styles.weekBadge} ${total >= 30 ? styles.weekBadgeOk : styles.weekBadgeWarn}`}
                >
                  {total}h
                </span>
              </button>
              {isOpen ? (
                <div className={styles.weekBody}>
                  <table className={styles.dayTable}>
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Hours</th>
                        <th scope="col">Activities</th>
                      </tr>
                    </thead>
                    <tbody>
                      {week.days.map((day) => (
                        <tr key={day.date ?? day.activities ?? Math.random()}>
                          <td>{day.date ?? '—'}</td>
                          <td>{day.workingHours ?? '—'}</td>
                          <td>{day.activities ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </>
  )
}

export function DocumentSummaryTab({ caseData }: DocumentSummaryTabProps) {
  const { showToast } = useToast()
  const extractMutation = useExtractCase(caseData.caseId)
  const payload = caseData.extractedPayload

  function handleExtract() {
    extractMutation.mutate(undefined, {
      onSuccess: () => showToast('Extraction completed', 'success'),
      onError: (error) =>
        showToast(getMutationErrorMessage(error, 'Extraction failed'), 'error'),
    })
  }

  return (
    <div>
      <div className={styles.extractActions}>
        <Button
          variant="secondary"
          size="sm"
          loading={extractMutation.isPending}
          disabled={caseData.status === 'EXTRACTING'}
          onClick={handleExtract}
        >
          Re-extract fields
        </Button>
      </div>

      {!payload ? (
        <p className={styles.fieldValue}>
          No extracted data yet. Upload is complete — run extraction to populate fields from the
          document.
        </p>
      ) : null}

      {isReportPayload(payload) ? <ReportSummary payload={payload} /> : null}
      {isJournalPayload(payload) ? <JournalSummary payload={payload} caseData={caseData} /> : null}
    </div>
  )
}
