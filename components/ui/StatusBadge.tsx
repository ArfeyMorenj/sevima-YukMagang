import { cn } from '@/lib/utils'

export type ApplicationStatusType = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'

interface StatusBadgeProps {
  status: ApplicationStatusType | string
  className?: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<
  ApplicationStatusType,
  { label: string; bg: string; text: string; border: string }
> = {
  PENDING: {
    label: 'Menunggu Penilaian',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  REVIEWED: {
    label: 'Sudah Dinilai',
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
  },
  ACCEPTED: {
    label: 'Diterima PKL',
    bg: 'bg-brand-50',
    text: 'text-brand-800',
    border: 'border-brand-200',
  },
  REJECTED: {
    label: 'Belum Lolos',
    bg: 'bg-destructive-light',
    text: 'text-destructive',
    border: 'border-red-200',
  },
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status as ApplicationStatusType] || {
    label: status,
    bg: 'bg-base-100',
    text: 'text-base-700',
    border: 'border-base-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.bg,
        config.text,
        config.border,
        size === 'sm' ? 'px-2 py-0.5 text-tiny' : 'px-2.5 py-1 text-caption',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', config.text.replace('text-', 'bg-'))} />
      {config.label}
    </span>
  )
}
