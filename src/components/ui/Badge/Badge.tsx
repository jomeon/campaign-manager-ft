import { ReactNode } from 'react'
import { cx } from '../../../utils/cx'
import styles from './Badge.module.scss'

type Tone = 'success' | 'muted' | 'primary'

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  dot?: boolean
}

export function Badge({ children, tone = 'muted', dot = false }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone])}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  )
}
