import { getAuditQueryErrorMessage, useAuditLog } from '../../../../api/hooks/useAuditLog'
import type { AuditLogEntry } from '../../../../api/types'
import { Button, EmptyState, LoadingBlock } from '../../../../components'
import {
  formatAuditAction,
  formatAuditTimestamp,
  getAuditActorType,
  sortAuditEntriesChronologically,
  type AuditActorType,
} from './auditUtils'
import styles from './tabs.module.css'

interface HistoryTabProps {
  caseId: string
}

const ACTOR_TYPE_LABELS: Record<AuditActorType, string> = {
  COORDINATOR: 'Coordinator',
  SYSTEM: 'System',
  AGENT: 'Agent',
}

function AuditTimelineItem({ entry }: { entry: AuditLogEntry }) {
  const actorType = getAuditActorType(entry.actor)
  const actorLabel =
    actorType === 'AGENT' ? entry.actor : ACTOR_TYPE_LABELS[actorType]

  return (
    <li className={styles.timelineItem}>
      <div className={`${styles.timelineMarker} ${styles[`timelineMarker${actorType}`]}`} />
      <article className={`${styles.timelineCard} ${styles[`timelineCard${actorType}`]}`}>
        <header className={styles.timelineCardHeader}>
          <span className={`${styles.actorBadge} ${styles[`actorBadge${actorType}`]}`}>
            {actorLabel}
          </span>
          <time className={styles.timelineTime} dateTime={entry.timestamp}>
            {formatAuditTimestamp(entry.timestamp)}
          </time>
        </header>
        <p className={styles.timelineAction}>{formatAuditAction(entry.action)}</p>
        <p className={styles.timelineDetail}>{entry.detail}</p>
      </article>
    </li>
  )
}

export function HistoryTab({ caseId }: HistoryTabProps) {
  const { data, isLoading, isError, error, refetch, isFetching } = useAuditLog(caseId)

  if (isLoading) {
    return (
      <div className={styles.tabContent}>
        <h3 className={styles.tabHeading}>Case History</h3>
        <LoadingBlock label="Loading case history…" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.tabContent}>
        <h3 className={styles.tabHeading}>Case History</h3>
        <EmptyState
          title="Failed to load case history"
          description={getAuditQueryErrorMessage(error)}
          action={
            <Button variant="primary" onClick={() => refetch()} loading={isFetching}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  const entries = sortAuditEntriesChronologically(data ?? [])

  return (
    <div className={styles.tabContent}>
      <div className={styles.timelineHeader}>
        <div>
          <h3 className={styles.tabHeading}>Case History</h3>
          <p className={styles.timelineIntro}>
            Chronological audit trail of system, agent, and coordinator actions.
          </p>
        </div>
        {entries.length > 0 ? (
          <span className={styles.timelineCount}>
            {entries.length} {entries.length === 1 ? 'event' : 'events'}
          </span>
        ) : null}
      </div>

      {entries.length > 0 ? (
        <ul className={styles.timelineLegend} aria-label="Actor legend">
          <li>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchCOORDINATOR}`} />
            Coordinator
          </li>
          <li>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchSYSTEM}`} />
            System
          </li>
          <li>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchAGENT}`} />
            Agent
          </li>
        </ul>
      ) : null}

      {entries.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Audit events will appear here after upload, extraction, validation, and coordinator actions."
        />
      ) : (
        <ol className={styles.timeline}>
          {entries.map((entry) => (
            <AuditTimelineItem key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </div>
  )
}
