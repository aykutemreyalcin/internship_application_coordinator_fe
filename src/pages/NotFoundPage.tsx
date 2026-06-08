import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button/Button'
import { EmptyState } from '../components/EmptyState/EmptyState'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <EmptyState
      variant="notFound"
      title="Page not found"
      description="The page you are looking for does not exist."
      action={
        <Button variant="secondary" onClick={() => navigate('/')}>
          Go to dashboard
        </Button>
      }
    />
  )
}
