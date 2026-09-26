import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireCompany } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import { ApplicantList, ApplicantItemProps } from '@/components/company/ApplicantList'
import { ArrowLeft, Briefcase, FileCode2, MapPin, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface JobApplicantsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobApplicantsPage({ params }: JobApplicantsPageProps) {
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

  // 2. Fetch job and verify ownership
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      studyCase: {
        select: {
          title: true,
          deadline: true,
        },
      },
      applications: {
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
          submission: true,
          review: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  // Security check: Must belong to this company
  if (!job || job.companyId !== company.id) {
    notFound()
  }

  const formattedApplicants: ApplicantItemProps[] = job.applications.map((app) => ({
    id: app.id,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    student: {
      id: app.student.id,
      name: app.student.name,
      major: app.student.major,
      skills: app.student.skills.map((s) => ({
        id: s.skill.id,
        name: s.skill.name,
      })),
    },
    submission: app.submission
      ? {
          id: app.submission.id,
          submittedAt: app.submission.submittedAt.toISOString(),
          repoUrl: app.submission.repoUrl,
          deployedUrl: app.submission.deployedUrl,
          explanation: app.submission.explanation,
        }
      : null,
    review: app.review
      ? {
          score: app.review.score,
          decision: app.review.decision,
          reviewedAt: app.review.reviewedAt.toISOString(),
        }
      : null,
  }))

  const totalApplicants = formattedApplicants.length
  const submittedCount = formattedApplicants.filter((a) => Boolean(a.submission)).length
  const reviewedCount = formattedApplicants.filter((a) => Boolean(a.review)).length
  const acceptedCount = formattedApplicants.filter((a) => a.review?.decision === 'ACCEPTED').length

  const formattedDeadline = new Date(job.applicationDeadline).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <CompanyLayout
      user={{
        name: company.name,
        companyName: company.name,
        email: company.user.email,
        verified: company.verified,
      }}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Navigation Back */}
        <div>
          <Link
            href="/company/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Lowongan
          </Link>
        </div>

        {/* Job Identity Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-7 shadow-xs space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Manajemen Pelamar Posisi
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {job.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground pt-1 border-t border-border">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-base-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-base-500" />
              <span>Batas Pendaftaran: {formattedDeadline}</span>
            </div>
            {job.studyCase && (
              <div className="flex items-center gap-1.5 text-brand-800 font-medium">
                <FileCode2 className="w-3.5 h-3.5 text-brand-700" />
                <span>Tantangan: {job.studyCase.title}</span>
              </div>
            )}
          </div>

          {/* Simple Factual Summary Stats (No fake metrics/charts) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-md bg-base-50 border border-border text-center">
              <p className="text-tiny text-muted-foreground font-medium">Total Pelamar</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{totalApplicants}</p>
            </div>
            <div className="p-3 rounded-md bg-base-50 border border-border text-center">
              <p className="text-tiny text-muted-foreground font-medium">Kumpul Case</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{submittedCount}</p>
            </div>
            <div className="p-3 rounded-md bg-base-50 border border-border text-center">
              <p className="text-tiny text-muted-foreground font-medium">Sudah Dinilai</p>
              <p className="text-xl font-bold text-brand-700 mt-0.5">{reviewedCount}</p>
            </div>
            <div className="p-3 rounded-md bg-base-50 border border-border text-center">
              <p className="text-tiny text-muted-foreground font-medium">Diterima PKL</p>
              <p className="text-xl font-bold text-brand-800 mt-0.5">{acceptedCount}</p>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <section aria-labelledby="applicants-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="applicants-heading" className="text-lg font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-700" />
              Daftar Siswa Pelamar ({totalApplicants})
            </h2>
            <span className="text-xs text-muted-foreground">
              Urutan: Lamaran Terbaru
            </span>
          </div>

          <ApplicantList
            
            jobTitle={job.title}
            applicants={formattedApplicants}
          />
        </section>
      </div>
    </CompanyLayout>
  )
}
