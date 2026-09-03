import { Tabs, type TabItem } from '../../../components/Tabs/Tabs'
import type { Case } from '../../../api/types'
import { ValidationTab } from '../../cases/detail/tabs/ValidationTab'
import { HistoryTab } from '../../cases/detail/tabs/HistoryTab'
import { DocumentSummaryPanel } from './DocumentSummaryPanel'
import { DocumentSummaryTab } from './tabs/DocumentSummaryTab'
import { DocumentDecisionTab } from './tabs/DocumentDecisionTab'
import styles from './DocumentDetail.module.css'

interface DocumentDetailLayoutProps {
  caseData: Case
}

export function DocumentDetailLayout({ caseData }: DocumentDetailLayoutProps) {
  const tabs: TabItem[] = [
    {
      id: 'summary',
      label: 'Summary',
      content: <DocumentSummaryTab caseData={caseData} />,
    },
    {
      id: 'validation',
      label: 'Validation',
      content: <ValidationTab caseId={caseData.caseId} />,
    },
    {
      id: 'decision',
      label: 'Recommendation & Decision',
      content: <DocumentDecisionTab caseData={caseData} />,
    },
    {
      id: 'history',
      label: 'History',
      content: <HistoryTab caseId={caseData.caseId} />,
    },
  ]

  return (
    <div className={styles.detailLayout}>
      <div>
        <DocumentSummaryPanel caseData={caseData} />
      </div>
      <div>
        <Tabs tabs={tabs} defaultTabId="summary" />
      </div>
    </div>
  )
}
