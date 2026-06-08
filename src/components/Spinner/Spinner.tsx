import styles from './Spinner.module.css'

type SpinnerSize = 'sm' | 'md' | 'lg'

type SpinnerProps = {
  size?: SpinnerSize
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
    />
  )
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.block}>
      <Spinner size="md" label={label} />
      <span className={styles.blockLabel}>{label}</span>
    </div>
  )
}
