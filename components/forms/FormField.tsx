'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number'
  error?: string
  hint?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  as?: 'input' | 'textarea' | 'select'
  selectOptions?: { value: string; label: string }[]
  maxLength?: number
  disabled?: boolean
  className?: string
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, name, type = 'text', error, hint, required, value, onChange, placeholder, as = 'input', selectOptions, maxLength, disabled, ...props }, ref) => {
    const renderInput = () => {
      const commonProps = {
        id: name,
        name,
        value: value || '',
        error,
        hint,
        required,
        disabled,
      }

      switch (as) {
        case 'textarea':
          return (
            <Textarea
              {...commonProps}
              maxLength={maxLength}
              placeholder={placeholder}
              value={value || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
            />
          )
        case 'select':
          return (
            <Select
              {...commonProps}
              options={selectOptions || []}
              placeholder={placeholder}
              value={value || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
            />
          )
        default:
          return (
            <Input
              {...commonProps}
              type={type}
              placeholder={placeholder}
              value={value || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
            />
          )
      }
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <Label htmlFor={name} required={required}>
          {label}
        </Label>
        {renderInput()}
      </div>
    )
  }
)

FormField.displayName = 'FormField'