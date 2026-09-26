import Link from 'next/link'
import { StatusBadge, ApplicationStatusType } from '@/components/ui/StatusBadge'
import {
  Building2,
  Calendar,
  FileCode,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react'

export interface ApplicationItemProps {
  id: string
  status: ApplicationStatusType | string
  createdAt: string
  job: {
    id: string
    title: string
    location: string
    company: {
      name: string
      verified: boolean
    }
    studyCase: {
      title: string
      deadline: string
    } | null
  }
  submission: {
    id: string
    submittedAt: string
    repoUrl: string
  } | null
  review: {
    score: number
    decision: 'ACCEPTED' | 'REJECTED'
  } | null
}

interface ApplicationsListProps {
  applications: ApplicationItemProps[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-lg p-10 sm:p-14 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-base-100 text-base-500 mx-auto flex items-center justify-center">
          <Briefcase className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-foreground">
            Kamu Belum Melamar ke Lowongan PKL
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Eksplorasi posisi PKL aktif dari perusahaan mitra, pilih lowongan yang sesuai minatmu, dan kerjakan study case industri.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            Temukan Peluang PKL
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const appliedDate = new Date(app.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })

        const hasSubmitted = Boolean(app.submission)
        const hasStudyCase = Boolean(app.job.studyCase)

        return (
          <article
            key={app.id}
            className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs hover:border-brand-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2.5 flex-1 min-w-0">
              {/* Header: Company & Status */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {app.job.company.name}
                </span>
                {app.job.company.verified && (
                  <span className="text-tiny text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                    Terverifikasi
                  </span>
                )}
                <StatusBadge status={app.status} size="sm" />
              </div>

              {/* Job Title */}
              <h2 className="text-lg font-bold text-foreground">
                <Link
                  href={`/student/applications/${app.id}`}
                  className="hover:text-brand-600 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
                >
                  {app.job.title}
                </Link>
              </h2>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dilamar pada: {appliedDate}</span>
                </div>
                <span>•</span>
                <span>{app.job.location}</span>
              </div>

              {/* Study Case Context */}
              {hasStudyCase && (
                <div className="pt-1">
                  {hasSubmitted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                      Study case sudah dikumpulkan: &quot;{app.job.studyCase?.title}&quot;
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Perlu dikumpulkan: &quot;{app.job.studyCase?.title}&quot;
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div className="flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
              <Link
                href={`/student/applications/${app.id}`}
                className={`inline-flex items-center justify-center gap-1.5 w-full md:w-auto px-4 py-2 rounded-md text-xs font-semibold shadow-xs transition-colors ${
                  !hasSubmitted && hasStudyCase
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                {!hasSubmitted && hasStudyCase ? (
                  <>
                    <FileCode className="w-3.5 h-3.5" />
                    Kumpulkan Study Case
                  </>
                ) : (
                  <>
                    Lihat Workspace Lamaran
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
