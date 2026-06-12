import { useCallback, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Layout } from '../../components/layout/Layout/Layout'
import {
  CampaignFilters,
  type StatusFilter,
} from '../../components/campaigns/CampaignFilters/CampaignFilters'
import { CampaignList } from '../../components/campaigns/CampaignList/CampaignList'
import { CampaignForm } from '../../components/campaigns/CampaignForm/CampaignForm'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import { Button } from '../../components/ui/Button/Button'
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useToggleStatus,
} from '../../hooks/useCampaigns'
import { useEmeraldBalance } from '../../hooks/useEmeraldBalance'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { formatPLN } from '../../utils/format'
import type { Campaign, CampaignInput } from '../../types/campaign'
import styles from './CampaignsPage.module.scss'

export function CampaignsPage() {
  const { data: campaigns = [], isLoading, isError, refetch } = useCampaigns()
  const createMutation = useCreateCampaign()
  const updateMutation = useUpdateCampaign()
  const deleteMutation = useDeleteCampaign()
  const toggleMutation = useToggleStatus()
  const { spend } = useEmeraldBalance()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)

  const debouncedSearch = useDebouncedValue(search, 250)

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return campaigns.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesSearch =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
      return matchesStatus && matchesSearch
    })
  }, [campaigns, debouncedSearch, statusFilter])

  const openCreate = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((campaign: Campaign) => {
    setEditing(campaign)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditing(null)
  }, [])

  const handleToggle = useCallback(
    (campaign: Campaign) => {
      toggleMutation.mutate({ id: campaign.id, status: campaign.status === 'on' ? 'off' : 'on' })
    },
    [toggleMutation]
  )

  const requestDelete = useCallback((campaign: Campaign) => setDeleteTarget(campaign), [])

  const handleSubmit = useCallback(
    async (data: CampaignInput) => {
      if (editing) {
        const delta = data.campaignFund - editing.campaignFund
        await updateMutation.mutateAsync({ id: editing.id, input: data })
        spend(delta)
      } else {
        await createMutation.mutateAsync(data)
        spend(data.campaignFund)
      }
      closeForm()
    },
    [editing, updateMutation, createMutation, spend, closeForm]
  )

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const fund = deleteTarget.campaignFund
    await deleteMutation.mutateAsync(deleteTarget.id)
    spend(-fund)
    setDeleteTarget(null)
  }, [deleteTarget, deleteMutation, spend])

  const submitting = createMutation.isPending || updateMutation.isPending
  const hasCampaigns = !isLoading && !isError && campaigns.length > 0

  return (
    <Layout onNewCampaign={openCreate}>
      <div className={styles.page}>
        <div className={styles.heading}>
          <h2 className={styles.pageTitle}>Your campaigns</h2>
        </div>

        {hasCampaigns && (
          <CampaignFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            total={campaigns.length}
            shown={filtered.length}
          />
        )}

        {isError ? (
          <EmptyState
            title="Couldn't load campaigns"
            description="The mock API may not be running. Start it with “npm run dev” and try again."
            action={<Button onClick={() => refetch()}>Retry</Button>}
          />
        ) : !isLoading && campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Create your first campaign to start advertising your products."
            action={
              <Button leftIcon={<Plus size={18} />} onClick={openCreate}>
                New campaign
              </Button>
            }
          />
        ) : !isLoading && filtered.length === 0 ? (
          <EmptyState
            title="No matches"
            description="No campaigns match your current search or filter."
          />
        ) : (
          <CampaignList
            campaigns={filtered}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={requestDelete}
            onToggleStatus={handleToggle}
          />
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? 'Edit campaign' : 'New campaign'}
        size="lg"
      >
        <CampaignForm
          key={editing?.id ?? 'create'}
          mode={editing ? 'edit' : 'create'}
          initialValues={editing ?? undefined}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete campaign"
        danger
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        message={
          <>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Its fund of{' '}
            {deleteTarget ? formatPLN(deleteTarget.campaignFund) : ''} will be refunded to your
            Emerald balance.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  )
}
