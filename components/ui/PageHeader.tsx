'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8', className)}>
      <div>
        <h1 className="text-h1 font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-body text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 mt-4 sm:mt-0">
          {action}
        </div>
      )}
    </div>
  )
}