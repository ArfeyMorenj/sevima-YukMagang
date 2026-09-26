'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <section ref={ref} className={cn('space-y-6', className)} {...props}>
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-h3">{title}</h2>
            {description && (
              <p className="mt-1 text-caption">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </header>
        <div>{children}</div>
      </section>
    )
  }
)

FormSection.displayName = 'FormSection'