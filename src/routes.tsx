import { Route, Routes } from 'react-router-dom'
import { CaseDetailPage } from './features/cases/detail/CaseDetailPage'
import { DocumentDetailPage } from './features/internshipDocuments/detail/DocumentDetailPage'
import { AppShell } from './layout/AppShell'
import { CaseListPage } from './pages/CaseListPage'
import { DocumentListPage } from './pages/DocumentListPage'
import { NewApplicationPage } from './pages/NewApplicationPage'
import { NewDocumentPage } from './pages/NewDocumentPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<CaseListPage />} />
        <Route path="new" element={<NewApplicationPage />} />
        <Route path="cases/:id" element={<CaseDetailPage />} />
        <Route path="documents" element={<DocumentListPage />} />
        <Route path="documents/new" element={<NewDocumentPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
