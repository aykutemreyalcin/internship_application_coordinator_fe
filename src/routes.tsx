import { Route, Routes } from 'react-router-dom'
import { CaseDetailPage } from './features/cases/detail/CaseDetailPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cases/:id" element={<CaseDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
