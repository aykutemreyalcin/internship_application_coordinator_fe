import { useState } from 'react'
import type { SupervisorVerificationDraftResponse } from '../../../../api/types'
import { Button, Modal } from '../../../../components'
import styles from './SupervisorVerificationModal.module.css'

interface SupervisorVerificationModalProps {
  open: boolean
  draft: SupervisorVerificationDraftResponse
  onClose: () => void
  onSend: (payload: { subject: string; body: string }) => void
  isSending: boolean
}

function draftKey(draft: SupervisorVerificationDraftResponse): string {
  return `${draft.caseId}|${draft.subject}|${draft.body}`
}

function SupervisorVerificationModalContent({
  open,
  draft,
  onClose,
  onSend,
  isSending,
}: SupervisorVerificationModalProps) {
  const [subject, setSubject] = useState(draft.subject)
  const [body, setBody] = useState(draft.body)
  const canSend = subject.trim().length > 0 && body.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={() => !isSending && onClose()}
      title="Supervisor verification email"
      dialogClassName={styles.dialog}
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" disabled={isSending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={isSending}
            disabled={isSending || !canSend}
            onClick={() => onSend({ subject: subject.trim(), body: body.trim() })}
          >
            Send email
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        <p className={styles.recipient}>
          To: <strong>{draft.supervisorName}</strong> ({draft.supervisorEmail})
        </p>

        <label className={styles.label} htmlFor="supervisor-subject">
          Subject
        </label>
        <input
          id="supervisor-subject"
          className={styles.input}
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          disabled={isSending}
        />

        <label className={styles.label} htmlFor="supervisor-body">
          Message
        </label>
        <textarea
          id="supervisor-body"
          className={styles.textarea}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          disabled={isSending}
        />
      </div>
    </Modal>
  )
}

export function SupervisorVerificationModal({
  open,
  draft,
  onClose,
  onSend,
  isSending,
}: SupervisorVerificationModalProps) {
  if (!open) {
    return null
  }

  return (
    <SupervisorVerificationModalContent
      key={draftKey(draft)}
      open={open}
      draft={draft}
      onClose={onClose}
      onSend={onSend}
      isSending={isSending}
    />
  )
}
