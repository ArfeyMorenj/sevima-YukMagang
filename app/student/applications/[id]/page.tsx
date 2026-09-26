import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStudentProfile } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ApplicationTimeline } from '@/components/application/ApplicationTimeline'
import { SubmissionForm } from '@/components/application/SubmissionForm'
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileCode,
  GitBranch,
  Globe,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ApplicationDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params
  const session = await getStudentProfile()
  const student = session.studentProfile

  // Fetch application with ownership & relations
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        include: {
          company: {
            select: {
              name: true,
              verified: true,
              location: true,
              website: true,
            },
          },
          studyCase: true,
        },
      },
      submission: true,
      review: true,
    },
  })

  // Security & ownership check: must belong to the logged-in student
  if (!application || application.studentId !== student.id) {
    notFound()
  }

  const appliedDate = new Date(application.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const studyCase = application.job.studyCase

  const formattedStudyCaseDeadline = studyCase
    ? new Date(studyCase.deadline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const submittedDate = application.submission
    ? new Date(application.submission.submittedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <StudentLayout
      user={{
        name: student.name,
        email: session.email,
        major: student.major,
      }}
    >
      <div className="space-y-8 max-w-4xl">
        {/* Navigation Back */}
        <div>
          <Link
            href="/student/applications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Status Lamaran
          </Link>
        </div>

        {/* Header: Position & Status Identity */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  <Building2 className="w-3.5 h-3.5" />
                  {application.job.company.name}
                </span>
                {application.job.company.verified && (
                  <span className="text-tiny text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 font-medium">
                    Terverifikasi
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {application.job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Diajukan pada: {appliedDate}</span>
                </div>
                <span>•</span>
                <span>{application.job.location}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <StatusBadge status={application.status} />
            </div>
          </div>
        </div>

        {/* 1. Timeline Progression */}
        <ApplicationTimeline
          hasSubmitted={Boolean(application.submission)}
          hasReview={Boolean(application.review)}
          
          decision={application.review?.decision}
        />

        {/* 2. Study Case Details */}
        {studyCase && (
          <section
            aria-labelledby="case-section-heading"
            className="bg-card border-l-4 border-l-brand-600 border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-tiny font-bold uppercase tracking-wider text-brand-700">
                    Tantangan Penugasan
                  </span>
                  <h2 id="case-section-heading" className="text-xl font-bold text-foreground">
                    {studyCase.title}
                  </h2>
                </div>
              </div>

              {formattedStudyCaseDeadline && (
                <span className="text-xs text-muted-foreground bg-base-100 px-3 py-1 rounded-md self-start sm:self-auto">
                  Batas Pengerjaan: <strong className="text-foreground">{formattedStudyCaseDeadline}</strong>
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Deskripsi Masalah:
                </h3>
                <p className="text-sm text-base-700 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                  {studyCase.problemDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Instruksi & Ketentuan Solusi:
                </h3>
                <div className="text-sm text-base-700 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                  {studyCase.instructions}
                </div>
              </div>

              {studyCase.requiredSkills.length > 0 && (
                <div>
                  <h3 className="text-caption text-muted-foreground mb-1.5">
                    Keahlian yang Diuji:
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {studyCase.requiredSkills.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. Submission Workspace or Submitted Summary */}
        <section aria-labelledby="submission-section-heading">
          {application.submission ? (
            <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 id="submission-section-heading" className="text-lg font-bold text-foreground">
                      Solusi Study Case yang Telah Dikumpulkan
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Terkumpul pada {submittedDate}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                  Sudah Terkirim
                </span>
              </div>

              <div className="space-y-4">
                {/* Repository URL */}
                <div>
                  <label className="block text-caption text-muted-foreground mb-1">
                    Tautan Repositori Kode:
                  </label>
                  <a
                    href={application.submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 bg-base-50 px-3.5 py-2 rounded-md border border-border break-all"
                  >
                    <GitBranch className="w-4 h-4 flex-shrink-0" />
                    <span>{application.submission.repoUrl}</span>
                  </a>
                </div>

                {/* Deployed URL (if present) */}
                {application.submission.deployedUrl && (
                  <div>
                    <label className="block text-caption text-muted-foreground mb-1">
                      Tautan Demo / Live Deploy:
                    </label>
                    <a
                      href={application.submission.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 bg-base-50 px-3.5 py-2 rounded-md border border-border break-all"
                    >
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span>{application.submission.deployedUrl}</span>
                    </a>
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <label className="block text-caption text-muted-foreground mb-1">
                    Penjelasan Solusi & Arsitektur:
                  </label>
                  <div className="text-sm text-base-800 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                    {application.submission.explanation}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              {!application.review && (
                <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-950">Menunggu Penilaian Tim Teknis Perusahaan</p>
                    <p className="mt-0.5 text-amber-800 leading-relaxed">
                      Pengumpulan solusimu telah diterima oleh sistem. Praktisi teknis dari {application.job.company.name} akan meninjau kode dan memberikan umpan balik langsung.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : studyCase ? (
            /* Not submitted yet -> Render SubmissionForm */
            <SubmissionForm
              applicationId={application.id}
              companyName={application.job.company.name}
              studyCaseTitle={studyCase.title}
            />
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">Tidak Ada Tantangan Study Case</p>
              <p className="text-xs text-muted-foreground">
                Lamaranmu sedang ditinjau langsung oleh tim HR / Rekrutmen {application.job.company.name}.
              </p>
            </div>
          )}
        </section>

        {/* 4. Review Results (if reviewed by company) */}
        {application.review && (
          <section
            aria-labelledby="review-section-heading"
            className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <Award className="w-6 h-6 text-brand-700" />
              <div>
                <h2 id="review-section-heading" className="text-lg font-bold text-foreground">
                  Hasil Penilaian Tim Teknis Perusahaan
                </h2>
                <p className="text-xs text-muted-foreground">
                  Evaluasi resmi oleh tim {application.job.company.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-base-50 border border-border">
                <p className="text-caption text-muted-foreground">Skor Penilaian:</p>
                <p className="text-3xl font-extrabold text-foreground mt-1">
                  {application.review.score}
                  <span className="text-sm font-normal text-muted-foreground"> / 100</span>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-base-50 border border-border">
                <p className="text-caption text-muted-foreground">Keputusan Magang:</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      application.review.decision === 'ACCEPTED'
                        ? 'bg-brand-100 text-brand-800'
                        : 'bg-destructive-light text-destructive'
                    }`}
                  >
                    {application.review.decision === 'ACCEPTED'
                      ? 'Diterima Magang PKL'
                      : 'Belum Memenuhi Kualifikasi'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <p className="text-xs font-semibold text-foreground">Catatan & Umpan Balik Tim Teknis:</p>
              <div className="text-sm text-base-800 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                {application.review.feedback}
              </div>
            </div>
          </section>
        )}
      </div>
    </StudentLayout>
  )
}
