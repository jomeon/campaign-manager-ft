import { Megaphone, Plus, Gem } from 'lucide-react'
import { Button } from '../../ui/Button/Button'
import { useEmeraldBalance } from '../../../hooks/useEmeraldBalance'
import styles from './Header.module.scss'

interface HeaderProps {
  onNewCampaign: () => void
}

export function Header({ onNewCampaign }: HeaderProps) {
  const { formatted } = useEmeraldBalance()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            <Megaphone size={20} />
          </span>
          <div className={styles.brandText}>
            <h1 className={styles.title}>Campaign Manager</h1>
            <p className={styles.subtitle}>Advertise your products</p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.balance} title="Emerald account balance">
            <Gem size={18} className={styles.gem} aria-hidden="true" />
            <div className={styles.balanceText}>
              <span className={styles.balanceLabel}>Emerald balance</span>
              <span key={formatted} className={`${styles.balanceValue} tabular-nums`}>
                {formatted}
              </span>
            </div>
          </div>
          <Button
            className={styles.newBtn}
            aria-label="New campaign"
            leftIcon={<Plus size={18} />}
            onClick={onNewCampaign}
          >
            <span className={styles.btnLabel}>New campaign</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
