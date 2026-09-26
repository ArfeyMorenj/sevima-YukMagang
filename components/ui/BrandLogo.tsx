'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  href?: string
  badge?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function BrandLogo({
  href,
  badge,
  size = 'md',
  className,
  onClick,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      mark: 'w-7 h-7 text-xs rounded-sm',
      text: 'text-base',
      badge: 'text-2xs px-1.5 py-0.5',
    },
    md: {
      mark: 'w-8 h-8 text-xs rounded-md',
      text: 'text-lg',
      badge: 'text-2xs px-1.5 py-0.5',
    },
    lg: {
      mark: 'w-10 h-10 text-sm rounded-lg',
      text: 'text-xl',
      badge: 'text-xs px-2 py-0.5',
    },
  }[size]

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      {/* Brand Icon Mark */}
      <span
        className={cn(
          'bg-brand-600 text-white flex items-center justify-center font-bold tracking-tight shadow-2xs transition-colors',
          sizeClasses.mark
        )}
        aria-hidden="true"
      >
        YM
      </span>

      {/* Brand Wordmark */}
      <span className={cn('font-bold tracking-tight text-foreground flex items-center gap-1.5', sizeClasses.text)}>
        YukMagang
      </span>

      {/* Optional Context Badge */}
      {badge && (
        <span
          className={cn(
            'uppercase rounded bg-base-200 text-base-700 font-semibold tracking-wider',
            sizeClasses.badge
          )}
        >
          {badge}
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        aria-label={`YukMagang ${badge ? badge : ''} - Beranda`}
      >
        {content}
      </Link>
    )
  }

  return content
}
