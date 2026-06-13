import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../../utils/cx'
import styles from './Typeahead.module.scss'

interface TypeaheadProps {
  value: string[]
  onChange: (next: string[]) => void
  suggestions: readonly string[]
  max?: number
  placeholder?: string
  id?: string
  name?: string
  hasError?: boolean
}

const MAX_VISIBLE = 8

export function Typeahead({
  value,
  onChange,
  suggestions,
  max = 20,
  placeholder,
  id,
  name,
  hasError = false,
}: TypeaheadProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const baseId = id ?? autoId
  const listboxId = `${baseId}-listbox`

  const atMax = value.length >= max

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const selected = new Set(value.map((v) => v.toLowerCase()))
    return suggestions
      .filter((s) => !selected.has(s.toLowerCase()) && (q === '' || s.toLowerCase().includes(q)))
      .slice(0, MAX_VISIBLE)
  }, [query, suggestions, value])

  const addKeyword = (raw: string) => {
    const keyword = raw.trim()
    if (!keyword || atMax) return
    const exists = value.some((v) => v.toLowerCase() === keyword.toLowerCase())
    if (!exists) onChange([...value, keyword])
    setQuery('')
    setActiveIndex(-1)
  }

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((v) => v !== keyword))
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setOpen(true)
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (open && activeIndex >= 0 && activeIndex < filtered.length) {
          addKeyword(filtered[activeIndex])
        } else if (query.trim()) {
          addKeyword(query)
        }
        break
      case 'Escape':
        setOpen(false)
        setActiveIndex(-1)
        break
      case 'Backspace':
        if (query === '' && value.length > 0) removeKeyword(value[value.length - 1])
        break
    }
  }

  useEffect(() => {
    if (!open || activeIndex < 0) return
    document.getElementById(`${baseId}-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, baseId])

  return (
    <div className={styles.root}>
      <div className={cx(styles.control, hasError && styles.error, open && styles.focused)}>
        {value.map((keyword) => (
          <span key={keyword} className={styles.chip} data-testid="chip">
            {keyword}
            <button
              type="button"
              aria-label={`Remove ${keyword}`}
              className={styles.chipRemove}
              onClick={() => removeKeyword(keyword)}
            >
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          name={name}
          role="combobox"
          aria-expanded={open && filtered.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined}
          className={styles.input}
          value={query}
          placeholder={
            atMax ? `Maximum ${max} keywords reached` : value.length === 0 ? placeholder : ''
          }
          disabled={atMax}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.counter}>
          {value.length}/{max} keywords
        </span>
        <span className={styles.hint}>Type and press Enter, or pick a suggestion</span>
      </div>

      {open && filtered.length > 0 && (
        <ul className={styles.listbox} id={listboxId} role="listbox">
          {filtered.map((s, i) => (
            <li
              key={s}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cx(styles.option, i === activeIndex && styles.optionActive)}
              onMouseDown={(e) => {
                e.preventDefault()
                addKeyword(s)
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
