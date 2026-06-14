import { getSessionUser, type SessionUser } from '../config/auth'

/** Read the current session (placeholder until auth provider is added). */
export function useSession(): SessionUser {
  return getSessionUser()
}
