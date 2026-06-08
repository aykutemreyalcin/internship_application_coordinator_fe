import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './AppShell.module.css'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.shell}>
      <Header onMenuToggle={() => setSidebarOpen((open) => !open)} />
      <div className={styles.body}>
        <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebar} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
