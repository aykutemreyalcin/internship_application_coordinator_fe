import { Skeleton } from '../../../components/Skeleton/Skeleton'
import styles from './CaseListTableSkeleton.module.css'

const ROW_COUNT = 5

export function CaseListTableSkeleton() {
  return (
    <div className={styles.tableWrap} aria-busy="true" aria-label="Loading cases">
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Student</th>
            <th scope="col">Company</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROW_COUNT }, (_, index) => (
            <tr key={index}>
              <td>
                <Skeleton className={styles.cellWide} />
              </td>
              <td>
                <Skeleton className={styles.cellMedium} />
              </td>
              <td>
                <Skeleton className={styles.cellBadge} />
              </td>
              <td>
                <Skeleton className={styles.cellShort} />
              </td>
              <td>
                <Skeleton className={styles.cellBadge} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
