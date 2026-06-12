import { Search, Loader2 } from 'lucide-react'
import { cx } from '../../../utils/cx'
import styles from './CampaignFilters.module.scss'

export type StatusFilter = 'all' | 'on' | 'off'

interface CampaignFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (value: StatusFilter) => void
  total: number
  shown: number
  searching?: boolean
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'on', label: 'Active' },
  { value: 'off', label: 'Paused' },
]

export function CampaignFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  total,
  shown,
  searching = false,
}: CampaignFiltersProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.searchWrap}>
        <Search size={18} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          id="campaign-search"
          name="search"
          className={styles.search}
          placeholder="Search by name or keyword…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search campaigns"
        />
        {searching && <Loader2 size={16} className={styles.spinner} aria-label="Searching" />}
      </div>

      <div className={styles.segment} role="group" aria-label="Filter by status">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={cx(styles.segmentBtn, statusFilter === filter.value && styles.active)}
            aria-pressed={statusFilter === filter.value}
            onClick={() => onStatusFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className={styles.count}>
        {shown} of {total} {total === 1 ? 'campaign' : 'campaigns'}
      </p>
    </div>
  )
}
