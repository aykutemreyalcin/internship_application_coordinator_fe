import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  variant?: 'default' | 'error' | 'notFound'
}

export function EmptyState({
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <div className={`${styles.container} ${styles[variant]}`} role="alert">
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
