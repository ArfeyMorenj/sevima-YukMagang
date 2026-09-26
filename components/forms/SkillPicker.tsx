'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Search, Plus } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
}

interface SkillPickerProps {
  availableSkills: Skill[]
  selectedSkills: Skill[]
  onAddSkill: (skillId: string) => void
  onRemoveSkill?: (skillId: string) => void
  disabled?: boolean
  label?: string
}

const CATEGORIES = [
  'TECHNICAL',
  'FRAMEWORK',
  'LANGUAGE',
  'DATABASE',
  'TOOL',
  'CLOUD',
  'SOFT',
  'OTHER',
]

const categoryLabels: Record<string, string> = {
  TECHNICAL: 'Teknis / Konsep',
  FRAMEWORK: 'Framework & Library',
  LANGUAGE: 'Bahasa Pemrograman',
  DATABASE: 'Database',
  TOOL: 'Tools & DevOps',
  CLOUD: 'Cloud & Hosting',
  SOFT: 'Soft Skills',
  OTHER: 'Lainnya',
}

export function SkillPicker({
  availableSkills,
  selectedSkills,
  onAddSkill,
  disabled = false,
  label = 'Cari dan Tambah Keahlian',
}: SkillPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLInputElement>(null)

  const selectedSkillIds = new Set(selectedSkills.map((s) => s.id))

  const filteredSkills = availableSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      !selectedSkillIds.has(skill.id)
  )

  const skillsByCategory = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const handleSelectSkill = (skillId: string) => {
    if (disabled) return
    onAddSkill(skillId)
    setSearchQuery('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    triggerRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredSkills.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSkills.length - 1
        )
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredSkills.length) {
        handleSelectSkill(filteredSkills[highlightedIndex].id)
      } else if (isOpen && filteredSkills.length > 0 && searchQuery) {
        handleSelectSkill(filteredSkills[0].id)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (availableSkills.length === 0) {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium mb-1.5">{label}</label>}
        <div className="relative">
          <input
            type="text"
            placeholder="Memuat daftar skill..."
            className="w-full h-10 px-3 py-2 border border-input rounded-sm bg-muted/40 text-muted-foreground text-sm"
            disabled
          />
        </div>
      </div>
    )
  }

  let flatIndex = 0

  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor="skill-search-input" className="block text-sm font-medium mb-1.5 text-foreground">
          {label}
        </label>
      )}

      {/* Search Input Container */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <input
            ref={triggerRef}
            id="skill-search-input"
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="skill-dropdown-listbox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsOpen(true)
              setHighlightedIndex(0)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik nama skill (misal: React, Python, Figma, PostgreSQL)..."
            className={cn(
              'w-full h-10 pl-9 pr-10 border rounded-sm bg-background text-foreground text-sm placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'transition-colors',
              disabled ? 'opacity-50 cursor-not-allowed' : 'border-input hover:border-base-300'
            )}
            disabled={disabled}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              if (!disabled) {
                setIsOpen(!isOpen)
                triggerRef.current?.focus()
              }
            }}
            className="absolute right-2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isOpen ? 'Tutup daftar skill' : 'Buka daftar skill'}
          >
            <ChevronDown
              className={cn('w-4 h-4 transition-transform duration-150', isOpen && 'rotate-180')}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            id="skill-dropdown-listbox"
            role="listbox"
            aria-label="Pilihan keahlian yang tersedia"
            className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto bg-card border border-border rounded-md shadow-md py-1"
          >
            {filteredSkills.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery ? (
                  <>Tidak ada skill yang cocok dengan &ldquo;{searchQuery}&rdquo;</>
                ) : (
                  <>Semua skill yang tersedia sudah ditambahkan ke profilmu</>
                )}
              </div>
            ) : (
              <>
                {CATEGORIES.map((category) => {
                  const skills = skillsByCategory[category]
                  if (!skills || skills.length === 0) return null

                  return (
                    <div key={category} className="py-1">
                      <div className="px-3 py-1 text-2xs font-semibold text-muted-foreground uppercase tracking-wider bg-base-100/60 sticky top-0 backdrop-blur-xs">
                        {categoryLabels[category] || category}
                      </div>
                      <ul role="group" aria-label={categoryLabels[category] || category}>
                        {skills.map((skill) => {
                          const currentIndex = flatIndex++
                          const isHighlighted = highlightedIndex === currentIndex

                          return (
                            <li
                              key={skill.id}
                              role="option"
                              aria-selected={isHighlighted}
                            >
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  // Prevent blur before selection executes
                                  e.preventDefault()
                                  handleSelectSkill(skill.id)
                                }}
                                className={cn(
                                  'w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors',
                                  isHighlighted
                                    ? 'bg-brand-50 text-brand-900 font-medium'
                                    : 'text-foreground hover:bg-base-100'
                                )}
                              >
                                <span className="font-medium">{skill.name}</span>
                                <span className="inline-flex items-center gap-1 text-xs text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-full font-medium">
                                  <Plus className="w-3 h-3" />
                                  Tambah
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}