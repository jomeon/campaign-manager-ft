import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  campaignSchema,
  emptyCampaign,
  MIN_BID,
  MAX_RADIUS,
  MAX_KEYWORDS,
  type Campaign,
  type CampaignInput,
} from '../../../types/campaign'
import { TOWNS } from '../../../constants/towns'
import { KEYWORD_SUGGESTIONS } from '../../../constants/keywords'
import { Typeahead } from '../../ui/Typeahead/Typeahead'
import { Toggle } from '../../ui/Toggle/Toggle'
import { Button } from '../../ui/Button/Button'
import { useEmeraldBalance } from '../../../hooks/useEmeraldBalance'
import { formatPLN } from '../../../utils/format'
import { cx } from '../../../utils/cx'
import styles from './CampaignForm.module.scss'

interface CampaignFormProps {
  mode: 'create' | 'edit'
  initialValues?: Campaign
  submitting?: boolean
  onSubmit: (data: CampaignInput) => void
  onCancel: () => void
}

export function CampaignForm({
  mode,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: CampaignFormProps) {
  const { balance } = useEmeraldBalance()
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: (initialValues ?? emptyCampaign) as CampaignInput,
    mode: 'onBlur',
  })

  const oldFund = mode === 'edit' && initialValues ? initialValues.campaignFund : 0
  const watchedFund = watch('campaignFund')
  const fundNumber = Number.isFinite(watchedFund) ? Number(watchedFund) : 0
  const delta = fundNumber - oldFund
  const projectedBalance = balance - delta

  const submit = (data: CampaignInput) => {
    const requiredDelta = data.campaignFund - oldFund
    if (requiredDelta > balance) {
      setError('campaignFund', {
        type: 'manual',
        message: `Insufficient Emerald balance. Needs ${formatPLN(requiredDelta)}, available ${formatPLN(balance)}.`,
      })
      return
    }
    onSubmit(data)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Campaign name <span className={styles.req}>*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Summer Sneakers Promo"
          className={cx(styles.input, errors.name && styles.inputError)}
          {...register('name')}
        />
        {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
      </div>

      <div className={styles.field}>
        <span className={styles.label}>
          Keywords <span className={styles.req}>*</span>
        </span>
        <Controller
          control={control}
          name="keywords"
          render={({ field, fieldState }) => (
            <Typeahead
              value={field.value ?? []}
              onChange={field.onChange}
              suggestions={KEYWORD_SUGGESTIONS}
              max={MAX_KEYWORDS}
              placeholder="e.g. shoes, running, sale"
              hasError={!!fieldState.error}
            />
          )}
        />
        {errors.keywords && <p className={styles.errorText}>{errors.keywords.message}</p>}
      </div>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label htmlFor="bidAmount" className={styles.label}>
            Bid amount (PLN) <span className={styles.req}>*</span>
          </label>
          <input
            id="bidAmount"
            type="number"
            step="0.01"
            min={MIN_BID}
            inputMode="decimal"
            placeholder={`${MIN_BID}`}
            className={cx(styles.input, errors.bidAmount && styles.inputError)}
            {...register('bidAmount', { valueAsNumber: true })}
          />
          {errors.bidAmount ? (
            <p className={styles.errorText}>{errors.bidAmount.message}</p>
          ) : (
            <p className={styles.hint}>Minimum bid {MIN_BID} PLN per click</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="campaignFund" className={styles.label}>
            Campaign fund (PLN) <span className={styles.req}>*</span>
          </label>
          <input
            id="campaignFund"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="0.00"
            className={cx(styles.input, errors.campaignFund && styles.inputError)}
            {...register('campaignFund', { valueAsNumber: true })}
          />
          {errors.campaignFund ? (
            <p className={styles.errorText}>{errors.campaignFund.message}</p>
          ) : mode === 'edit' ? (
            <p className={styles.hint}>
              Current {formatPLN(oldFund)} · balance after change:{' '}
              <strong className={cx(projectedBalance < 0 && styles.negative)}>
                {formatPLN(projectedBalance)}
              </strong>
            </p>
          ) : (
            <p className={styles.hint}>Available Emerald balance: {formatPLN(balance)}</p>
          )}
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label htmlFor="town" className={styles.label}>
            Town
          </label>
          <select id="town" className={styles.input} {...register('town')}>
            <option value="">— select town —</option>
            {TOWNS.map((town) => (
              <option key={town} value={town}>
                {town}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="radius" className={styles.label}>
            Radius (km) <span className={styles.req}>*</span>
          </label>
          <input
            id="radius"
            type="number"
            step="1"
            min="1"
            inputMode="numeric"
            placeholder="e.g. 25"
            className={cx(styles.input, errors.radius && styles.inputError)}
            {...register('radius', { valueAsNumber: true })}
          />
          {errors.radius ? (
            <p className={styles.errorText}>{errors.radius.message}</p>
          ) : (
            <p className={styles.hint}>In kilometres (max {MAX_RADIUS})</p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Status</span>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className={styles.statusRow}>
              <Toggle
                checked={field.value === 'on'}
                onChange={(checked) => field.onChange(checked ? 'on' : 'off')}
                label={field.value === 'on' ? 'Active' : 'Paused'}
              />
            </div>
          )}
        />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'create' ? 'Create campaign' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
