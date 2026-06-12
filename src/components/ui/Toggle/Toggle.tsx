import { useId } from 'react'
import { cx } from '../../../utils/cx'
import styles from './Toggle.module.scss'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export function Toggle({ checked, onChange, label, disabled = false, id }: ToggleProps) {
  const autoId = useId()
  const switchId = id ?? autoId

  return (
    <span className={styles.wrapper}>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={cx(styles.track, checked && styles.on)}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
      {label && (
        <label htmlFor={switchId} className={styles.label}>
          {label}
        </label>
      )}
    </span>
  )
}
