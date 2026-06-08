import { useState } from 'react'
import { CASE_STATUSES } from '../api'
import {
  Button,
  EmptyState,
  LoadingBlock,
  Modal,
  Spinner,
  StatusBadge,
  useToast,
} from '../components'
import styles from './ComponentsDemoPage.module.css'

export function ComponentsDemoPage() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)

  const triggerLoadingDemo = () => {
    setLoadingDemo(true)
    window.setTimeout(() => setLoadingDemo(false), 1200)
  }

  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Design system</p>
      <h2 className={styles.title}>Shared UI components</h2>
      <p className={styles.lead}>
        Reusable building blocks for case list, detail panels, and coordinator actions. Import from{' '}
        <code>src/components</code>.
      </p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>StatusBadge</h3>
        <div className={`${styles.panel} ${styles.badgeGrid}`}>
          {CASE_STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Button</h3>
        <div className={`${styles.panel} ${styles.row}`}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button loading>Loading</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Spinner / Loading</h3>
        <div className={`${styles.panel} ${styles.row}`}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Button variant="secondary" onClick={triggerLoadingDemo}>
            Simulate loading
          </Button>
        </div>
        {loadingDemo ? (
          <div className={styles.section}>
            <LoadingBlock label="Fetching cases…" />
          </div>
        ) : null}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>EmptyState</h3>
        <EmptyState
          title="No applications yet"
          description="Upload a PDF to create the first internship application case."
          action={
            <Button variant="primary" onClick={() => showToast('Navigate to New Application', 'info')}>
              New application
            </Button>
          }
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Toast / Notification</h3>
        <div className={`${styles.panel} ${styles.row}`}>
          <Button variant="secondary" onClick={() => showToast('Case saved successfully', 'success')}>
            Success toast
          </Button>
          <Button variant="secondary" onClick={() => showToast('Validation failed for one field', 'error')}>
            Error toast
          </Button>
          <Button variant="secondary" onClick={() => showToast('Recommendation generated', 'info')}>
            Info toast
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Modal</h3>
        <div className={styles.panel}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm coordinator decision"
        footer={
          <div className={styles.footerActions}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false)
                showToast('Decision recorded', 'success')
              }}
            >
              Confirm approve
            </Button>
          </div>
        }
      >
        Approve this internship application? The coordinator always makes the final decision.
      </Modal>
    </section>
  )
}
