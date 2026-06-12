import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { campaignsApi } from '../api/campaigns'
import type { Campaign, CampaignInput, CampaignStatus } from '../types/campaign'
import { toast } from '../store/toastStore'

export const CAMPAIGNS_KEY = ['campaigns'] as const

export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGNS_KEY,
    queryFn: campaignsApi.list,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CampaignInput) =>
      campaignsApi.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY })
      toast.success('Campaign created')
    },
    onError: () => toast.error('Failed to create campaign'),
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CampaignInput }) =>
      campaignsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY })
      toast.success('Campaign updated')
    },
    onError: () => toast.error('Failed to update campaign'),
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => campaignsApi.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CAMPAIGNS_KEY })
      const previous = queryClient.getQueryData<Campaign[]>(CAMPAIGNS_KEY)
      queryClient.setQueryData<Campaign[]>(
        CAMPAIGNS_KEY,
        (old) => old?.filter((c) => c.id !== id) ?? []
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(CAMPAIGNS_KEY, context.previous)
      toast.error('Failed to delete campaign')
    },
    onSuccess: () => toast.success('Campaign deleted'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  })
}

export function useToggleStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CampaignStatus }) =>
      campaignsApi.patch(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: CAMPAIGNS_KEY })
      const previous = queryClient.getQueryData<Campaign[]>(CAMPAIGNS_KEY)
      queryClient.setQueryData<Campaign[]>(
        CAMPAIGNS_KEY,
        (old) => old?.map((c) => (c.id === id ? { ...c, status } : c)) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(CAMPAIGNS_KEY, context.previous)
      toast.error('Failed to update status')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  })
}
