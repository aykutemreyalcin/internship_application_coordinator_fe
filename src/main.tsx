import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

async function bootstrap() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
    const { enableMocking } = await import('./mocks/enableMocking')
    await enableMocking()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

void bootstrap()
