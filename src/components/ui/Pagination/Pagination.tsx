import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../../../utils/cx'
import styles from './Pagination.module.scss'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

function getItems(page: number, pageCount: number): Array<number | 'dots'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const items: Array<number | 'dots'> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) items.push('dots')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < pageCount - 1) items.push('dots')

  items.push(pageCount)
  return items
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <ul className={styles.pages}>
        {getItems(page, pageCount).map((item, i) =>
          item === 'dots' ? (
            <li key={`dots-${i}`} className={styles.dots} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.page, item === page && styles.active)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className={styles.arrow}
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
