import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireCompany } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import { ReviewForm } from '@/components/company/ReviewForm'
import {
  ArrowLeft,
  User,
  GraduationCap,
  Calendar,
  FileCode,
  GitBranch,
  Globe,
  Briefcase,
  AlertCircle,
  Clock,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ApplicationReviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const { id } = await params
  const session = await requireCompany()

  // 1. Get logged-in company
  const company = await prisma.company.findUnique({
    where: { userId: session.userId },
    select: {
      id: true,
      name: true,
      verified: true,
      user: { select: { email: true } },
    },
  })

  if (!company) {
    notFound()
  }

  // 2. Fetch application with full relations
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          skills: {
            include: {
              skill: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      job: {
        include: {
          studyCase: true,
        },
      },
      submission: true,
      review: true,
    },
  })

  // 3. Security Check: Application's job must belong to this company
  if (!application || application.job.companyId !== company.id) {
    notFound()
  }

  const appliedDate = new Date(application.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const submittedDate = application.submission
    ? new Date(application.submission.submittedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const studyCase = application.job.studyCase

  return (
    <CompanyLayout
      user={{
        name: company.name,
        companyName: company.name,
        email: company.user.email,
        verified: company.verified,
      }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Navigation Back */}
        <div>
          <Link
            href={`/company/jobs/${application.job.id}/applicants`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Pelamar
          </Link>
        </div>

        {/* Page Heading */}
        <div className="border-b border-border pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Tinjauan Lamaran Magang PKL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Penilaian Solusi: {application.student.name}
          </h1>
          <p className="text-xs sm:text-sm text-base-600 mt-1">
            Posisi: <strong className="text-foreground">{application.job.title}</strong>
          </p>
        </div>

        {/* 1. Candidate Profile Card */}
        <section aria-labelledby="applicant-info-heading" className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 id="applicant-info-heading" className="text-base font-bold text-foreground">
                  {application.student.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-brand-700 font-medium">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Jurusan: {application.student.major}
                  </span>
                  <span>•</span>
                  <span>Melamar: {appliedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Bio if available */}
          {application.student.bio && (
            <div className="text-xs text-base-700 bg-base-50 p-3 rounded-md border border-border">
              <p className="font-semibold text-muted-foreground mb-0.5">Bio / Tentang Siswa:</p>
              <p>{application.student.bio}</p>
            </div>
          )}

          {/* Student Skills */}
          {application.student.skills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-caption text-muted-foreground">Keahlian Terdaftar Siswa:</p>
              <div className="flex flex-wrap gap-1.5" role="list">
                {application.student.skills.map((s) => (
                  <span
                    key={s.skill.id}
                    className="px-2.5 py-0.5 rounded-full text-xs bg-brand-50 text-brand-800 border border-brand-200 font-medium"
                  >
                    {s.skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 2. Study Case Reference */}
        {studyCase && (
          <section aria-labelledby="case-ref-heading" className="bg-card border-l-4 border-l-brand-600 border border-border rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-brand-800">
              <FileCode className="w-5 h-5 text-brand-700" />
              <h2 id="case-ref-heading" className="text-sm font-bold uppercase tracking-wider">
                Tantangan Penugasan: {studyCase.title}
              </h2>
            </div>
            <div className="text-xs text-base-700 space-y-2 bg-base-50 p-4 rounded-md border border-border">
              <div>
                <p className="font-semibold text-foreground">Deskripsi Masalah:</p>
                <p className="mt-0.5 leading-relaxed whitespace-pre-line">{studyCase.problemDescription}</p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="font-semibold text-foreground">Instruksi Pengerjaan:</p>
                <p className="mt-0.5 leading-relaxed whitespace-pre-line">{studyCase.instructions}</p>
              </div>
            </div>
          </section>
        )}

        {/* 3. Student Submission Work */}
        <section aria-labelledby="submission-info-heading" className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 id="submission-info-heading" className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-700" />
              Solusi yang Dikumpulkan oleh Siswa
            </h2>
            {submittedDate && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Dikumpulkan: {submittedDate}
              </span>
            )}
          </div>

          {application.submission ? (
            <div className="space-y-4">
              {/* Repo Link */}
              <div>
                <label className="block text-caption text-muted-foreground mb-1">
                  Repositori Kode Sumber:
                </label>
                <a
                  href={application.submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 bg-base-50 px-3.5 py-2.5 rounded-md border border-border break-all"
                >
                  <GitBranch className="w-4 h-4 flex-shrink-0" />
                  <span>{application.submission.repoUrl}</span>
                </a>
              </div>

              {/* Deployed Link if available */}
              {application.submission.deployedUrl && (
                <div>
                  <label className="block text-caption text-muted-foreground mb-1">
                    Demo Live / Deployment:
                  </label>
                  <a
                    href={application.submission.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 bg-base-50 px-3.5 py-2.5 rounded-md border border-border break-all"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span>{application.submission.deployedUrl}</span>
                  </a>
                </div>
              )}

              {/* Explanation Text */}
              <div>
                <label className="block text-caption text-muted-foreground mb-1">
                  Penjelasan Solusi & Arsitektur oleh Siswa:
                </label>
                <div className="text-sm text-base-800 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                  {application.submission.explanation}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Siswa Belum Mengumpulkan Solusi</p>
                <p className="mt-0.5 text-amber-800">
                  Siswa masih dalam proses pengerjaan study case. Formulir penilaian dapat diisi setelah siswa mengumpulkan repositori kode.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 4. Company Review Form */}
        {application.submission ? (
          <section aria-labelledby="review-form-heading">
            <ReviewForm
              applicationId={application.id}
              jobTitle={application.job.title}
              studentName={application.student.name}
              existingReview={
                application.review
                  ? {
                      score: application.review.score,
                      feedback: application.review.feedback,
                      decision: application.review.decision,
                    }
                  : null
              }
            />
          </section>
        ) : (
          <div className="p-4 rounded-md bg-base-100 text-muted-foreground border border-border text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Formulir penilaian belum aktif karena siswa belum mengumpulkan penugasan.</span>
          </div>
        )}
      </div>
    </CompanyLayout>
  )
}
