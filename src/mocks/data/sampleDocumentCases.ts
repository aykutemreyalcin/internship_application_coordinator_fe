import type {
  AuditLogEntry,
  Case,
  LearningOutcomeEntry,
  ValidationSummary,
} from '../../api/types'

const ts = (value: string) => value

const passedValidation: ValidationSummary = {
  completeness: { passed: true, issues: [] },
  rules: { passed: true, issues: [] },
}

const incompleteReportValidation: ValidationSummary = {
  completeness: {
    passed: false,
    issues: [
      {
        field: 'W3.waysOfAchieving',
        message: 'Ways of achieving must be at least 20 characters',
        severity: 'ERROR',
      },
      {
        field: 'U2.waysOfAchieving',
        message: 'Ways of achieving is empty',
        severity: 'ERROR',
      },
    ],
  },
  rules: { passed: true, issues: [] },
}

const underLoggedJournalValidation: ValidationSummary = {
  completeness: { passed: true, issues: [] },
  rules: {
    passed: false,
    issues: [
      {
        field: 'week2.totalHours',
        message: 'Week 2 logged only 22 hours (minimum 30 required)',
        severity: 'ERROR',
      },
    ],
  },
}

function outcome(
  code: string,
  description: string,
  waysOfAchieving: string,
): LearningOutcomeEntry {
  return { code, description, waysOfAchieving }
}

const completeOutcomes: LearningOutcomeEntry[] = [
  outcome(
    'W1',
    'The student became familiar with the activities carried out by the host company',
    'Participated in daily stand-ups and shadowed the backend team during sprint planning.',
  ),
  outcome(
    'W2',
    'The student became familiar with the organizational system of the company IT department',
    'Mapped team structure and documented workflow between product, QA, and engineering.',
  ),
  outcome(
    'W3',
    'The student became familiar with the company IT database, programs and systems used',
    'Configured PostgreSQL locally and wrote migration scripts using Flyway.',
  ),
  outcome(
    'U1',
    'The student is able to navigate the organizational system of a company',
    'Submitted weekly status reports and coordinated tasks with the team lead.',
  ),
]

const incompleteOutcomes: LearningOutcomeEntry[] = completeOutcomes.map((entry, index) =>
  index >= 2 ? { ...entry, waysOfAchieving: '' } : entry,
)

export const MOCK_DOCUMENT_CASES: Case[] = [
  {
    caseId: 'd1111111-1111-4111-8111-111111111101',
    caseType: 'LEARNING_OUTCOMES_REPORT',
    extractedPayload: {
      studentName: 'Jan Kowalski',
      studentId: '100042',
      reportDate: '2026-08-15',
      hostCompanyOrEmployer: 'TechNova Solutions Sp. z o.o.',
      internshipStartDate: '2026-06-01',
      internshipEndDate: '2026-09-30',
      learningOutcomes: completeOutcomes,
      studentSignaturePresent: true,
      supervisorName: 'Anna Nowak',
      supervisorComments: 'Excellent progress throughout the internship.',
      supervisorSignaturePresent: true,
      supervisorConfirmationDate: '2026-09-28',
      ectsCredits: 15,
      recognizedInternshipMonths: 4,
      allOutcomesAchieved: 'YES',
      deanSupervisorComments: null,
    },
    status: 'READY_FOR_REVIEW',
    studentName: 'Jan Kowalski',
    studentId: '100042',
    companyName: 'TechNova Solutions Sp. z o.o.',
    supervisorName: 'Anna Nowak',
    supervisorEmail: null,
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-06-01',
    internshipEndDate: '2026-09-30',
    recommendation: 'APPROVE',
    recommendationReason: 'All learning outcomes documented with sufficient detail.',
    validation: passedValidation,
    documents: [
      {
        id: 'doc1111111-1111-4111-8111-111111111101',
        fileName: 'jan-kowalski-learning-outcomes.docx',
        contentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pageCount: null,
      },
    ],
    createdAt: ts('2026-09-01T09:00:00.000Z'),
    updatedAt: ts('2026-09-01T10:15:00.000Z'),
  },
  {
    caseId: 'd2222222-2222-4222-8222-222222222201',
    caseType: 'LEARNING_OUTCOMES_REPORT',
    extractedPayload: {
      studentName: 'Maria Wisniewska',
      studentId: '100088',
      reportDate: '2026-08-20',
      hostCompanyOrEmployer: 'Green Logistics SA',
      internshipStartDate: '2026-05-01',
      internshipEndDate: '2026-08-31',
      learningOutcomes: incompleteOutcomes,
      studentSignaturePresent: true,
      supervisorName: 'Piotr Zielinski',
      supervisorComments: null,
      supervisorSignaturePresent: false,
      supervisorConfirmationDate: null,
      ectsCredits: null,
      recognizedInternshipMonths: null,
      allOutcomesAchieved: null,
      deanSupervisorComments: null,
    },
    status: 'NEW',
    studentName: 'Maria Wisniewska',
    studentId: '100088',
    companyName: 'Green Logistics SA',
    supervisorName: 'Piotr Zielinski',
    supervisorEmail: null,
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-05-01',
    internshipEndDate: '2026-08-31',
    recommendation: null,
    recommendationReason: null,
    validation: incompleteReportValidation,
    documents: [
      {
        id: 'doc2222222-2222-4222-8222-222222222201',
        fileName: 'maria-wisniewska-report.pdf',
        contentType: 'application/pdf',
        pageCount: 6,
      },
    ],
    createdAt: ts('2026-09-02T11:30:00.000Z'),
    updatedAt: ts('2026-09-02T11:30:00.000Z'),
  },
  {
    caseId: 'd3333333-3333-4333-8333-333333333301',
    caseType: 'INTERNSHIP_JOURNAL',
    extractedPayload: {
      studentName: 'Tomasz Lewandowski',
      studentId: '200015',
      faculty: 'Faculty of Applied Sciences',
      fieldOfStudy: 'Computer Engineering',
      studyForm: 'Full-time',
      academicYear: '2025/2026',
      companyName: 'DataPulse Analytics',
      companyAddress: 'ul. Marszałkowska 10, Warsaw',
      internshipStartDate: '2026-06-02',
      internshipEndDate: '2026-09-26',
      companySupervisorName: 'Dr. Katarzyna Dabrowska',
      weeklyEntries: [
        {
          weekStart: '2026-06-02',
          weekEnd: '2026-06-06',
          supervisorSignaturePresent: true,
          days: [
            {
              date: '2026-06-02',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Onboarding, environment setup, codebase tour',
            },
            {
              date: '2026-06-03',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Implemented REST endpoint for case listing',
            },
            {
              date: '2026-06-04',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Pair programming on validation agents',
            },
            {
              date: '2026-06-05',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Wrote integration tests for upload flow',
            },
          ],
        },
        {
          weekStart: '2026-06-09',
          weekEnd: '2026-06-13',
          supervisorSignaturePresent: true,
          days: [
            {
              date: '2026-06-09',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Frontend document list page implementation',
            },
            {
              date: '2026-06-10',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Styled weekly journal accordion component',
            },
            {
              date: '2026-06-11',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Connected TanStack Query hooks to backend',
            },
            {
              date: '2026-06-12',
              hoursFrom: '09:00',
              hoursTo: '17:00',
              workingHours: 8,
              activities: 'Demo preparation and bug fixes',
            },
          ],
        },
      ],
    },
    status: 'READY_FOR_REVIEW',
    studentName: 'Tomasz Lewandowski',
    studentId: '200015',
    companyName: 'DataPulse Analytics',
    supervisorName: 'Dr. Katarzyna Dabrowska',
    supervisorEmail: null,
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-06-02',
    internshipEndDate: '2026-09-26',
    recommendation: 'APPROVE',
    recommendationReason: 'Journal complete with consistent weekly hours.',
    validation: passedValidation,
    documents: [
      {
        id: 'doc3333333-3333-4333-8333-333333333301',
        fileName: 'tomasz-lewandowski-journal.docx',
        contentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pageCount: null,
      },
    ],
    createdAt: ts('2026-09-02T14:00:00.000Z'),
    updatedAt: ts('2026-09-02T15:30:00.000Z'),
  },
  {
    caseId: 'd4444444-4444-4444-8444-444444444401',
    caseType: 'INTERNSHIP_JOURNAL',
    extractedPayload: {
      studentName: 'Agnieszka Wojcik',
      studentId: '200031',
      faculty: 'Faculty of Applied Sciences',
      fieldOfStudy: 'Computer Engineering',
      studyForm: 'Full-time',
      academicYear: '2025/2026',
      companyName: 'CloudBridge Systems',
      companyAddress: 'Kraków Technology Park',
      internshipStartDate: '2026-07-01',
      internshipEndDate: '2026-10-15',
      companySupervisorName: 'Marek Kowalczyk',
      weeklyEntries: [
        {
          weekStart: '2026-07-01',
          weekEnd: '2026-07-05',
          supervisorSignaturePresent: false,
          days: [
            {
              date: '2026-07-01',
              hoursFrom: '10:00',
              hoursTo: '16:00',
              workingHours: 6,
              activities: 'Orientation and security training',
            },
            {
              date: '2026-07-02',
              hoursFrom: '10:00',
              hoursTo: '15:00',
              workingHours: 5,
              activities: 'Documentation review',
            },
            {
              date: '2026-07-03',
              hoursFrom: '10:00',
              hoursTo: '14:00',
              workingHours: 4,
              activities: 'Shadowing DevOps team',
            },
          ],
        },
        {
          weekStart: '2026-07-07',
          weekEnd: '2026-07-11',
          supervisorSignaturePresent: false,
          days: [
            {
              date: '2026-07-07',
              hoursFrom: '09:00',
              hoursTo: '14:00',
              workingHours: 5,
              activities: 'Ticket triage',
            },
            {
              date: '2026-07-08',
              hoursFrom: '09:00',
              hoursTo: '15:00',
              workingHours: 6,
              activities: 'Monitoring dashboard updates',
            },
          ],
        },
      ],
    },
    status: 'NEW',
    studentName: 'Agnieszka Wojcik',
    studentId: '200031',
    companyName: 'CloudBridge Systems',
    supervisorName: 'Marek Kowalczyk',
    supervisorEmail: null,
    fieldOfStudy: 'Computer Engineering',
    internshipStartDate: '2026-07-01',
    internshipEndDate: '2026-10-15',
    recommendation: 'REJECT',
    recommendationReason: 'Insufficient weekly hours logged in multiple weeks.',
    validation: underLoggedJournalValidation,
    documents: [
      {
        id: 'doc4444444-4444-4444-8444-444444444401',
        fileName: 'agnieszka-wojcik-journal.pdf',
        contentType: 'application/pdf',
        pageCount: 12,
      },
    ],
    createdAt: ts('2026-09-03T08:00:00.000Z'),
    updatedAt: ts('2026-09-03T08:05:00.000Z'),
  },
]

export const MOCK_DOCUMENT_AUDIT_LOGS: Record<string, AuditLogEntry[]> = {
  'd1111111-1111-4111-8111-111111111101': [
    {
      id: 'da1111111-1111-4111-8111-111111111101',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Learning outcomes report uploaded',
      timestamp: ts('2026-09-01T09:00:00.000Z'),
    },
    {
      id: 'da1111111-1111-4111-8111-111111111102',
      actor: 'Learning Outcomes Extraction Agent',
      action: 'EXTRACTION_COMPLETED',
      detail: 'Report fields extracted from DOCX',
      timestamp: ts('2026-09-01T09:05:00.000Z'),
    },
    {
      id: 'da1111111-1111-4111-8111-111111111103',
      actor: 'Decision Recommendation Agent',
      action: 'RECOMMENDATION_GENERATED',
      detail: 'Recommendation: APPROVE',
      timestamp: ts('2026-09-01T10:15:00.000Z'),
    },
  ],
  'd2222222-2222-4222-8222-222222222201': [
    {
      id: 'da2222222-2222-4222-8222-222222222201',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Learning outcomes report uploaded',
      timestamp: ts('2026-09-02T11:30:00.000Z'),
    },
  ],
  'd3333333-3333-4333-8333-333333333301': [
    {
      id: 'da3333333-3333-4333-8333-333333333301',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Internship journal uploaded',
      timestamp: ts('2026-09-02T14:00:00.000Z'),
    },
    {
      id: 'da3333333-3333-4333-8333-333333333302',
      actor: 'Internship Journal Extraction Agent',
      action: 'EXTRACTION_COMPLETED',
      detail: 'Journal weekly entries extracted',
      timestamp: ts('2026-09-02T14:20:00.000Z'),
    },
  ],
  'd4444444-4444-4444-8444-444444444401': [
    {
      id: 'da4444444-4444-4444-8444-444444444401',
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: 'Internship journal uploaded',
      timestamp: ts('2026-09-03T08:00:00.000Z'),
    },
  ],
}
