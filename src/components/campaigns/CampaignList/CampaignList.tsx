import { Campaign } from '../../../types/campaign'
import { CampaignCard } from '../CampaignCard/CampaignCard'
import { SkeletonCard } from '../../ui/Skeleton/Skeleton'
import styles from './CampaignList.module.scss'

interface CampaignListProps {
  campaigns: Campaign[]
  isLoading: boolean
  onEdit: (campaign: Campaign) => void
  onDelete: (campaign: Campaign) => void
  onToggleStatus: (campaign: Campaign) => void
}

const SKELETON_COUNT = 6

export function CampaignList({
  campaigns,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}: CampaignListProps) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}
