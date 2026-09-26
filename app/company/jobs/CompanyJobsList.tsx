'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import Link from 'next/link'
import { deleteJob } from '@/app/actions/company/job'
import { Badge } from '@/components/ui/Badge'
import { SkillChip } from '@/components/ui/SkillChip'
import {
  Briefcase,
  Plus,
  MapPin,
  Calendar,
  FileCode2,
  Users,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface SkillItem {
  skill: {
    id: string
    name: string
    category: string
  }
}

interface StudyCaseItem {
  id: string
  title: string
  problemDescription: string
  instructions: string
  deadline: Date | string
}

export interface CompanyJobItem {
  id: string
  title: string
  description: string
  location: string
  techStack: string[]
  applicationDeadline: Date | string
  createdAt: Date | string
  skills: SkillItem[]
  studyCase: StudyCaseItem | null
  _count: {
    applications: number
  }
}

interface CompanyJobsListProps {
  initialJobs: CompanyJobItem[]
  justCreated?: boolean
}

export function CompanyJobsList({ initialJobs, justCreated }: CompanyJobsListProps) {
  const [jobs, setJobs] = useState<CompanyJobItem[]>(initialJobs)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(
    justCreated ? 'Lowongan PKL dan tantangan study case berhasil dipublikasikan!' : null
  )
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus lowongan "${jobTitle}"? Semua data study case dan pelamar terkait akan ikut terhapus.`)) {
      return
    }

    setError(null)
    setSuccess(null)
    setDeletingId(jobId)

    startTransition(async () => {
      const result = await deleteJob(jobId)
      if (result.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        setSuccess(`Lowongan "${jobTitle}" berhasil dihapus.`)
      } else {
        setError(result.error || 'Gagal menghapus lowongan.')
      }
      setDeletingId(null)
    })
  }

  const formatDate = (dateVal: Date | string) => {
    try {
      const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d)
    } catch {
      return String(dateVal)
    }
  }

  const isExpired = (deadlineVal: Date | string) => {
    try {
      const d = typeof deadlineVal === 'string' ? new Date(deadlineVal) : deadlineVal
      return d < new Date()
    } catch {
      return false
    }
  }

  // Empty State
  if (jobs.length === 0) {
    return (
      <div className="space-y-6">
        {success && (
          <div
            role="status"
            className="p-4 rounded-md bg-brand-50 border border-brand-200 text-brand-900 text-sm flex items-center gap-3 animate-in fade-in"
          >
            <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 mx-auto flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Belum Ada Lowongan PKL</h2>
          <p className="text-sm text-base-600 mt-2 max-w-md mx-auto leading-relaxed">
            Anda belum mempublikasikan lowongan magang industri. Mulai buat lowongan dan tantangan study case nyata untuk menemukan siswa SMK yang tepat.
          </p>
          <div className="mt-6">
            <Link
              href="/company/jobs/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Buat Lowongan Pertama
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {success && (
        <div
          role="status"
          className="p-4 rounded-md bg-brand-50 border border-brand-200 text-brand-900 text-sm flex items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
            <span>{success}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="text-brand-700 hover:text-brand-900 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 rounded-md bg-destructive-light/60 border border-destructive/30 text-destructive text-sm flex items-center gap-3 animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const expired = isExpired(job.applicationDeadline)

          return (
            <article
              key={job.id}
              className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs hover:border-base-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground hover:text-brand-700 transition-colors">
                      {job.title}
                    </h2>
                    {expired ? (
                      <Badge variant="outline" className="text-2xs text-muted-foreground border-base-300">
                        Pendaftaran Ditutup
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-2xs font-semibold">
                        Pendaftaran Dibuka
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-base-500 shrink-0" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-base-500 shrink-0" />
                      Batas Pendaftaran: <span className="font-medium text-foreground">{formatDate(job.applicationDeadline)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-base-500 shrink-0" />
                      <span className="font-semibold text-foreground">{job._count.applications}</span> Pelamar Masuk
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-base-600 line-clamp-2 pt-1 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(job.id, job.title)}
                    disabled={isPending && deletingId === job.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive-light/30 rounded-md transition-colors text-xs flex items-center gap-1"
                    title="Hapus Lowongan"
                    aria-label={`Hapus lowongan ${job.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Hapus</span>
                  </button>
                </div>
              </div>

              {/* Study Case Callout Card */}
              {job.studyCase && (
                <div className="mt-4 p-3.5 rounded-md bg-base-50/70 border border-base-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center justify-center shrink-0 mt-0.5">
                      <FileCode2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Tantangan: {job.studyCase.title}</span>
                        <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/50">
                          Study Case
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 mt-0.5">
                        {job.studyCase.problemDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 pl-9 sm:pl-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Batas Case: {formatDate(job.studyCase.deadline)}</span>
                  </div>
                </div>
              )}

              {/* Skills & Tech Stack Footer */}
              <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                    Keahlian:
                  </span>
                  {job.skills.map(({ skill }) => (
                    <SkillChip
                      key={skill.id}
                      skill={skill}
                      className="text-2xs py-0.5 px-2"
                    />
                  ))}
                </div>

                {job.techStack.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-2xs text-muted-foreground">
                    <span className="font-semibold">Stack:</span>
                    <span>{job.techStack.join(' • ')}</span>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
