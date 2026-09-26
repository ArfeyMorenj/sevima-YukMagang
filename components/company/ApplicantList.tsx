import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  User,
  GraduationCap,
  Calendar,
  FileCode,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react'

export interface ApplicantItemProps {
  id: string
  status: string
  createdAt: string
  student: {
    id: string
    name: string
    major: string
    skills: Array<{
      id: string
      name: string
    }>
  }
  submission: {
    id: string
    submittedAt: string
    repoUrl: string
    deployedUrl?: string | null
    explanation: string
  } | null
  review: {
    score: number
    decision: 'ACCEPTED' | 'REJECTED'
    reviewedAt: string
  } | null
}

interface ApplicantListProps {
  
  jobTitle: string
  applicants: ApplicantItemProps[]
}

export function ApplicantList({ jobTitle, applicants }: ApplicantListProps) {
  if (applicants.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-lg p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-base-100 text-base-500 mx-auto flex items-center justify-center">
          <User className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            Belum Ada Pelamar
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Belum ada siswa yang mendaftar pada lowongan &quot;{jobTitle}&quot;. Begitu ada siswa yang mengajukan lamaran, daftar kandidat akan tampil di sini.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/company/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-base-100 text-foreground text-xs font-semibold transition-colors"
          >
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => {
        const appliedDate = new Date(applicant.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })

        const hasSubmission = Boolean(applicant.submission)
        const hasReview = Boolean(applicant.review)

        return (
          <article
            key={applicant.id}
            className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs hover:border-brand-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="space-y-3 flex-1 min-w-0">
              {/* Student Identity Header */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-base font-bold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-700" />
                  {applicant.student.name}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Jurusan: {applicant.student.major}
                </span>
                <StatusBadge status={applicant.status} size="sm" />
              </div>

              {/* Application Metadata */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Melamar pada: {appliedDate}</span>
                </div>
              </div>

              {/* Skills Overlap */}
              {applicant.student.skills.length > 0 && (
                <div className="space-y-1">
                  <span className="text-tiny font-medium text-muted-foreground">
                    Keahlian Terdaftar Siswa:
                  </span>
                  <div className="flex flex-wrap gap-1.5" role="list">
                    {applicant.student.skills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded-full text-tiny bg-base-100 text-base-700 border border-base-200"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission State Callout */}
              <div className="pt-1">
                {hasSubmission ? (
                  <div className="inline-flex items-center gap-2 text-xs text-brand-900 bg-brand-50/80 px-3 py-1.5 rounded-md border border-brand-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-brand-700 flex-shrink-0" />
                    <span>
                      Solusi Study Case telah dikumpulkan pada{' '}
                      {new Date(applicant.submission!.submittedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-xs text-amber-900 bg-amber-50/80 px-3 py-1.5 rounded-md border border-amber-200 font-medium">
                    <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Menunggu siswa mengerjakan dan mengumpulkan solusi study case</span>
                  </div>
                )}
              </div>

              {/* Review Result Callout (if already reviewed) */}
              {hasReview && (
                <div className="inline-flex items-center gap-2 text-xs text-foreground bg-base-100 px-3 py-1 rounded-md border border-border">
                  <Award className="w-3.5 h-3.5 text-brand-700" />
                  <span>
                    Skor: <strong>{applicant.review!.score}/100</strong> • Keputusan:{' '}
                    <strong
                      className={
                        applicant.review!.decision === 'ACCEPTED'
                          ? 'text-brand-700'
                          : 'text-destructive'
                      }
                    >
                      {applicant.review!.decision === 'ACCEPTED'
                        ? 'Diterima PKL'
                        : 'Belum Lolos'}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Action Column */}
            <div className="flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
              {hasSubmission ? (
                <Link
                  href={`/company/applications/${applicant.id}/review`}
                  className="inline-flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <FileCode className="w-4 h-4" />
                  {hasReview ? 'Lihat / Perbarui Penilaian' : 'Nilai Solusi Study Case'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center gap-1.5 w-full lg:w-auto px-3.5 py-2 rounded-md bg-base-100 text-muted-foreground text-xs font-medium border border-border cursor-not-allowed">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Belum Ada Solusi untuk Dinilai
                </span>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
