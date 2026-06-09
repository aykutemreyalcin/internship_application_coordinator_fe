import { useState } from 'react'
import type { ClarificationDraftResponse } from '../../../../api/types'
import { Button, Modal } from '../../../../components'
import styles from './ClarificationEmailModal.module.css'

interface ClarificationEmailModalProps {
  open: boolean
  draft: ClarificationDraftResponse
  onClose: () => void
  onSend: (payload: { subject: string; body: string }) => void
  isSending: boolean
}

function draftKey(draft: ClarificationDraftResponse): string {
  return `${draft.caseId}|${draft.subject}|${draft.body}`
}

function ClarificationEmailModalContent({
  open,
  draft,
  onClose,
  onSend,
  isSending,
}: ClarificationEmailModalProps) {
  const [subject, setSubject] = useState(draft.subject)
  const [body, setBody] = useState(draft.body)
  const canSend = subject.trim().length > 0 && body.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={() => !isSending && onClose()}
      title="Clarification email to student"
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
          To: <strong>{draft.studentName}</strong>
        </p>

        <label className={styles.label} htmlFor="clarification-subject">
          Subject
        </label>
        <input
          id="clarification-subject"
          className={styles.input}
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          disabled={isSending}
        />

        <label className={styles.label} htmlFor="clarification-body">
          Message
        </label>
        <textarea
          id="clarification-body"
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

export function ClarificationEmailModal({
  open,
  draft,
  onClose,
  onSend,
  isSending,
}: ClarificationEmailModalProps) {
  if (!open) {
    return null
  }

  return (
    <ClarificationEmailModalContent
      key={draftKey(draft)}
      open={open}
      draft={draft}
      onClose={onClose}
      onSend={onSend}
      isSending={isSending}
    />
  )
}
