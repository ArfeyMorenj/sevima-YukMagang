'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface SkillChipProps extends HTMLAttributes<HTMLSpanElement> {
  skill: {
    id: string
    name: string
    category?: string
  }
  onRemove?: (skillId: string) => void
  removable?: boolean
  selected?: boolean
}

export const SkillChip = forwardRef<HTMLSpanElement, SkillChipProps>(
  ({ className, skill, onRemove, removable = false, selected = true, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-colors',
          selected
            ? 'bg-brand-50 text-brand-800 border border-brand-200'
            : 'bg-muted text-muted-foreground border border-border',
          className
        )}
        {...props}
      >
        <span>{skill.name}</span>
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onRemove(skill.id)
            }}
            className="flex items-center justify-center w-4 h-4 ml-0.5 rounded-full text-brand-600 hover:text-brand-900 hover:bg-brand-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            aria-label={`Hapus keahlian ${skill.name}`}
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
          </button>
        )}
      </span>
    )
  }
)

SkillChip.displayName = 'SkillChip'