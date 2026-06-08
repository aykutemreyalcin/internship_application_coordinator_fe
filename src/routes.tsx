import { Route, Routes } from 'react-router-dom'
import { CaseDetailPage } from './features/cases/detail/CaseDetailPage'
import { AppShell } from './layout/AppShell'
import { CaseListPage } from './pages/CaseListPage'
import { ComponentsDemoPage } from './pages/ComponentsDemoPage'
import { NewApplicationPage } from './pages/NewApplicationPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<CaseListPage />} />
        <Route path="new" element={<NewApplicationPage />} />
        <Route path="cases/:id" element={<CaseDetailPage />} />
        <Route path="dev/components" element={<ComponentsDemoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
