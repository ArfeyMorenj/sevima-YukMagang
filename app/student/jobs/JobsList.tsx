'use client'

import { useState, useMemo } from 'react'
import { JobCard, JobCardProps } from '@/components/job/JobCard'
import { Search, X, Briefcase, Filter } from 'lucide-react'

interface JobsListProps {
  jobs: JobCardProps[]
  studentSkillIds: string[]
}

export function JobsList({ jobs, studentSkillIds }: JobsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMatchedOnly, setFilterMatchedOnly] = useState(false)

  const studentSkillSet = useMemo(() => new Set(studentSkillIds), [studentSkillIds])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Text search across title, company name, location, and tech stack
      const query = searchQuery.toLowerCase().trim()
      const matchesText =
        query === '' ||
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.techStack.some((t) => t.toLowerCase().includes(query)) ||
        job.skills.some((s) => s.name.toLowerCase().includes(query))

      if (!matchesText) return false

      // 2. Filter: only jobs matching at least 1 student skill
      if (filterMatchedOnly && studentSkillIds.length > 0) {
        const hasSkillOverlap = job.skills.some((s) => studentSkillSet.has(s.id))
        if (!hasSkillOverlap) return false
      }

      return true
    })
  }, [jobs, searchQuery, filterMatchedOnly, studentSkillSet, studentSkillIds])

  return (
    <div className="space-y-6">
      {/* Search & Simple Filter Toolbar */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari posisi PKL, nama perusahaan, atau teknologi..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-input rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Cari lowongan PKL"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-xs"
                aria-label="Hapus kata kunci pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter: Sesuai Keahlian Saya */}
          {studentSkillIds.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterMatchedOnly(!filterMatchedOnly)}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                filterMatchedOnly
                  ? 'bg-brand-50 text-brand-800 border-brand-300 font-semibold'
                  : 'bg-background text-foreground border-border hover:bg-base-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              Cocok dengan Skill Saya
            </button>
          )}
        </div>

        {/* Counter & Active Filter Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span>
            Menampilkan <strong className="text-foreground">{filteredJobs.length}</strong> dari {jobs.length} lowongan aktif
          </span>
          {(searchQuery || filterMatchedOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setFilterMatchedOnly(false)
              }}
              className="text-xs text-brand-700 hover:text-brand-800 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid or Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-lg p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-base-100 text-base-500 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              Tidak Ada Lowongan yang Sesuai
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || filterMatchedOnly
                ? 'Tidak ditemukan lowongan dengan filter saat ini. Coba gunakan kata kunci lain atau reset filter.'
                : 'Saat ini belum ada lowongan PKL yang dipublikasikan oleh mitra industri.'}
            </p>
          </div>
          {(searchQuery || filterMatchedOnly) && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setFilterMatchedOnly(false)
                }}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors"
              >
                Hapus Semua Filter
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              studentSkillIds={studentSkillIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}
