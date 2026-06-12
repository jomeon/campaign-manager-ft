import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const INITIAL_BALANCE = 10000

interface EmeraldState {
  balance: number
  canAfford: (amount: number) => boolean
  spend: (amount: number) => void
  reset: () => void
}

const round2 = (n: number) => Math.round(n * 100) / 100

export const useEmeraldStore = create<EmeraldState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      canAfford: (amount) => amount <= get().balance,
      spend: (amount) => set((state) => ({ balance: round2(state.balance - amount) })),
      reset: () => set({ balance: INITIAL_BALANCE }),
    }),
    { name: 'emerald-balance' }
  )
)
