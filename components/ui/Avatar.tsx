'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  fallback?: string
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, fallback, src, alt, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-muted overflow-hidden',
          'font-medium text-muted-foreground',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || fallback || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{fallback}</span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'