import { memo } from 'react'
import { Pencil, Trash2, MapPin, Target, Gavel, Wallet } from 'lucide-react'
import type { Campaign } from '../../../types/campaign'
import { Badge } from '../../ui/Badge/Badge'
import { Toggle } from '../../ui/Toggle/Toggle'
import { Button } from '../../ui/Button/Button'
import { formatPLN } from '../../../utils/format'
import styles from './CampaignCard.module.scss'

interface CampaignCardProps {
  campaign: Campaign
  onEdit: (campaign: Campaign) => void
  onDelete: (campaign: Campaign) => void
  onToggleStatus: (campaign: Campaign) => void
}

const MAX_VISIBLE_KEYWORDS = 5

function CampaignCardBase({ campaign, onEdit, onDelete, onToggleStatus }: CampaignCardProps) {
  const isOn = campaign.status === 'on'
  const visibleKeywords = campaign.keywords.slice(0, MAX_VISIBLE_KEYWORDS)
  const overflow = campaign.keywords.length - visibleKeywords.length

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.name} title={campaign.name}>
          {campaign.name}
        </h3>
        <Badge tone={isOn ? 'success' : 'muted'} dot>
          {isOn ? 'Active' : 'Paused'}
        </Badge>
      </header>

      <ul className={styles.keywords}>
        {visibleKeywords.map((keyword) => (
          <li key={keyword} className={styles.keyword}>
            {keyword}
          </li>
        ))}
        {overflow > 0 && <li className={styles.more}>+{overflow}</li>}
      </ul>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>
            <Gavel size={15} /> Bid
          </dt>
          <dd>{formatPLN(campaign.bidAmount)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>
            <Wallet size={15} /> Fund
          </dt>
          <dd>{formatPLN(campaign.campaignFund)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>
            <MapPin size={15} /> Town
          </dt>
          <dd>{campaign.town || '—'}</dd>
        </div>
        <div className={styles.stat}>
          <dt>
            <Target size={15} /> Radius
          </dt>
          <dd>{campaign.radius} km</dd>
        </div>
      </dl>

      <footer className={styles.footer}>
        <Toggle
          checked={isOn}
          onChange={() => onToggleStatus(campaign)}
          label={isOn ? 'On' : 'Off'}
        />
        <div className={styles.buttons}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Pencil size={15} />}
            onClick={() => onEdit(campaign)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={15} />}
            onClick={() => onDelete(campaign)}
            aria-label={`Delete ${campaign.name}`}
          >
            Delete
          </Button>
        </div>
      </footer>
    </article>
  )
}

export const CampaignCard = memo(CampaignCardBase)
