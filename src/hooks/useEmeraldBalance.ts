import { useEmeraldStore } from '../store/emeraldStore'
import { formatPLN } from '../utils/format'

export function useEmeraldBalance() {
  const balance = useEmeraldStore((s) => s.balance)
  const canAfford = useEmeraldStore((s) => s.canAfford)
  const spend = useEmeraldStore((s) => s.spend)
  const reset = useEmeraldStore((s) => s.reset)

  return {
    balance,
    formatted: formatPLN(balance),
    canAfford,
    spend,
    reset,
  }
}
