import { Tabs, type TabItem } from '../../../components/Tabs/Tabs'
import type { Case } from '../../../api/types'
import { CaseSummaryPanel } from './CaseSummaryPanel'
import { FieldsTab } from './tabs/FieldsTab'
import { ValidationTab } from './tabs/ValidationTab'
import { RecommendationDecisionTab } from './tabs/RecommendationDecisionTab'
import { HistoryTab } from './tabs/HistoryTab'
import styles from './CaseDetailPage.module.css'

interface CaseDetailLayoutProps {
  caseData: Case
}

export function CaseDetailLayout({ caseData }: CaseDetailLayoutProps) {
  const tabs: TabItem[] = [
    { id: 'fields', label: 'Fields', content: <FieldsTab caseData={caseData} /> },
    {
      id: 'validation',
      label: 'Validation',
      content: <ValidationTab caseId={caseData.caseId} />,
    },
    {
      id: 'recommendation',
      label: 'Recommendation / Decision',
      content: <RecommendationDecisionTab caseData={caseData} />,
    },
    { id: 'history', label: 'History', content: <HistoryTab /> },
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <CaseSummaryPanel caseData={caseData} />
      </div>
      <div className={styles.right}>
        <Tabs tabs={tabs} defaultTabId="fields" />
      </div>
    </div>
  )
}
