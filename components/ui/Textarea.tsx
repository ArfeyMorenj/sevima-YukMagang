'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, maxLength, id, value, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = `${textareaId}-error`
    const hintId = `${textareaId}-hint`

    const getValueLength = (val: string | number | readonly string[] | undefined): number => {
      if (val === undefined || val === null) return 0
      if (typeof val === 'string') return val.length
      if (Array.isArray(val)) return val.length
      return String(val).length
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium mb-1">
            {label}
            {props.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[100px] px-3 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground',
            'border rounded-sm resize-y transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between text-caption">
          <div>
            {hint && !error && <p id={hintId}>{hint}</p>}
          </div>
          {maxLength && (
            <p className="text-muted-foreground ml-auto" aria-live="polite">
              {getValueLength(value)}/{maxLength}
            </p>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'