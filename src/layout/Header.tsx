import { APP_DISPLAY_NAME, COORDINATOR_ROLE } from '../config/app'
import { getApiModeLabel } from '../config/env'
import styles from './Header.module.css'

type HeaderProps = {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className={styles.logo} aria-hidden="true">
          IAC
        </div>
        <h1 className={styles.title}>{APP_DISPLAY_NAME}</h1>
      </div>

      <div className={styles.meta}>
        <span className={styles.apiMode} title="API connection mode">
          {getApiModeLabel()}
        </span>
        <div className={styles.role} title="Signed-in role (placeholder)">
          <span className={styles.roleDot} aria-hidden="true" />
          <span className={styles.roleLabel}>{COORDINATOR_ROLE}</span>
        </div>
      </div>
    </header>
  )
}
