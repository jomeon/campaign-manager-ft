import { ReactNode } from 'react'
import { Header } from '../Header/Header'
import { Toaster } from '../../ui/Toast/Toaster'
import styles from './Layout.module.scss'

interface LayoutProps {
  children: ReactNode
  onNewCampaign: () => void
}

export function Layout({ children, onNewCampaign }: LayoutProps) {
  return (
    <div className={styles.app}>
      <Header onNewCampaign={onNewCampaign} />
      <main className={styles.main}>{children}</main>
      <Toaster />
    </div>
  )
}
