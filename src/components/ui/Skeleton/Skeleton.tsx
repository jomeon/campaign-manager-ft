import { CSSProperties } from 'react'
import { cx } from '../../../utils/cx'
import styles from './Skeleton.module.scss'

interface SkeletonProps {
  width?: string
  height?: string
  radius?: string
  className?: string
}

export function Skeleton({ width = '100%', height = '14px', radius, className }: SkeletonProps) {
  const style: CSSProperties = { width, height, borderRadius: radius }
  return <span className={cx(styles.skeleton, className)} style={style} aria-hidden="true" />
}

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.row}>
        <Skeleton width="55%" height="18px" />
        <Skeleton width="48px" height="22px" radius="9999px" />
      </div>
      <Skeleton width="80%" height="12px" />
      <div className={styles.chips}>
        <Skeleton width="60px" height="22px" radius="9999px" />
        <Skeleton width="72px" height="22px" radius="9999px" />
        <Skeleton width="54px" height="22px" radius="9999px" />
      </div>
      <Skeleton width="100%" height="1px" />
      <div className={styles.row}>
        <Skeleton width="40%" height="12px" />
        <Skeleton width="30%" height="12px" />
      </div>
    </div>
  )
}
