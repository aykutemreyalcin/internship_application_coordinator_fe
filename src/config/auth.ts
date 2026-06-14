export const USER_ROLES = ['COORDINATOR'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type SessionUser = {
  id: string
  displayName: string
  role: UserRole
}

const ROLE_LABELS: Record<UserRole, string> = {
  COORDINATOR: 'Coordinator',
}

/** Placeholder session until real auth is wired. Replace `getSessionUser` implementation later. */
const PLACEHOLDER_SESSION: SessionUser = {
  id: 'placeholder-coordinator',
  displayName: 'Coordinator',
  role: 'COORDINATOR',
}

export function getSessionUser(): SessionUser {
  return PLACEHOLDER_SESSION
}

export function getCurrentRole(): UserRole {
  return getSessionUser().role
}

export function getRoleLabel(role: UserRole = getCurrentRole()): string {
  return ROLE_LABELS[role]
}
