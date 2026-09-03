import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from './Sidebar.module.css'

type SidebarProps = {
  isOpen: boolean
  onNavigate?: () => void
}

const applicationItems = [
  {
    to: '/',
    label: 'Dashboard',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/new',
    label: 'New Application',
    end: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const

const documentItems = [
  {
    to: '/documents',
    label: 'Documents',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
  },
  {
    to: '/documents/new',
    label: 'Upload Document',
    end: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 16V4m0 0 4 4m-4-4-4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const

function NavSection({
  title,
  items,
  accent,
  onNavigate,
}: {
  title: string
  items: ReadonlyArray<{
    to: string
    label: string
    end: boolean
    icon: ReactNode
  }>
  accent?: boolean
  onNavigate?: () => void
}) {
  return (
    <div className={styles.section}>
      <p className={`${styles.navLabel} ${accent ? styles.navLabelAccent : ''}`}>{title}</p>
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${accent && isActive ? styles.navLinkAccentActive : ''}`
              }
              onClick={onNavigate}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close navigation menu"
          onClick={onNavigate}
        />
      ) : null}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`} aria-label="Main">
        <NavSection title="Applications" items={applicationItems} onNavigate={onNavigate} />
        <NavSection
          title="Internship Documents"
          items={documentItems}
          accent
          onNavigate={onNavigate}
        />
      </aside>
    </>
  )
}
