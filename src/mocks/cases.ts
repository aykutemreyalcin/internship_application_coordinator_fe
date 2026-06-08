import { ApiClientError } from '../api/client'
import type { Case } from '../api/types'

export const MOCK_CASE_IDS = {
  ready: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  incomplete: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  error: 'simulate-error',
} as const

const mockCases: Record<string, Case> = {
  [MOCK_CASE_IDS.ready]: {
    caseId: MOCK_CASE_IDS.ready,
    status: 'READY_FOR_REVIEW',
    studentName: 'Jan Kowalski',
    studentId: '123456',
    companyName: 'Astana Kebab Sp. z o.o.',
    supervisorName: 'Anna Nowak',
    supervisorEmail: 'supervisor@example.com',
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-06-01',
    internshipEndDate: '2026-11-30',
    recommendation: 'APPROVE',
    recommendationReason:
      'All required fields are present; internship duration complies with university rules.',
    validation: {
      completeness: { passed: true, issues: [] },
      rules: { passed: true, issues: [] },
    },
    documents: [{ id: 'doc-1', fileName: 'application.pdf', pageCount: 4 }],
    createdAt: '2026-06-04T10:00:00Z',
    updatedAt: '2026-06-04T10:02:00Z',
  },
  [MOCK_CASE_IDS.incomplete]: {
    caseId: MOCK_CASE_IDS.incomplete,
    status: 'NEEDS_CLARIFICATION',
    studentName: 'Maria Wiśniewska',
    studentId: '654321',
    companyName: 'Tech Solutions Ltd.',
    supervisorName: null,
    supervisorEmail: null,
    fieldOfStudy: 'Information Technology',
    internshipStartDate: '2026-07-01',
    internshipEndDate: null,
    recommendation: 'CLARIFY',
    recommendationReason:
      'Supervisor contact details and internship end date are missing. Clarification email recommended.',
    validation: {
      completeness: {
        passed: false,
        issues: [
          {
            field: 'supervisorEmail',
            message: 'Supervisor email is required',
            severity: 'ERROR',
          },
          {
            field: 'internshipEndDate',
            message: 'Internship end date is required',
            severity: 'ERROR',
          },
        ],
      },
      rules: {
        passed: true,
        issues: [],
      },
    },
    documents: [{ id: 'doc-2', fileName: 'maria_application.pdf', pageCount: 3 }],
    createdAt: '2026-06-03T14:30:00Z',
    updatedAt: '2026-06-03T15:10:00Z',
  },
}

export function getMockCase(id: string): Case {
  if (id === MOCK_CASE_IDS.error) {
    throw new ApiClientError({
      timestamp: new Date().toISOString(),
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to load case details. Please try again later.',
      path: `/api/cases/${id}`,
    })
  }

  const caseData = mockCases[id]
  if (!caseData) {
    throw new ApiClientError({
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'Not Found',
      message: `Case with id "${id}" was not found.`,
      path: `/api/cases/${id}`,
    })
  }

  return caseData
}
