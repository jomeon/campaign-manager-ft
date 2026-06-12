export const formatPLN = (value: number): string =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('pl-PL').format(Number.isFinite(value) ? value : 0)
