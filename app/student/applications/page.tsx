import { getStudentProfile } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { ApplicationsList, ApplicationItemProps } from './ApplicationsList'

export const dynamic = 'force-dynamic'

export default async function StudentApplicationsPage() {
  const session = await getStudentProfile()
  const student = session.studentProfile

  const rawApplications = await prisma.application.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          company: {
            select: {
              name: true,
              verified: true,
            },
          },
          studyCase: {
            select: {
              title: true,
              deadline: true,
            },
          },
        },
      },
      submission: {
        select: {
          id: true,
          submittedAt: true,
          repoUrl: true,
        },
      },
      review: {
        select: {
          score: true,
          decision: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const applications: ApplicationItemProps[] = rawApplications.map((app) => ({
    id: app.id,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    job: {
      id: app.job.id,
      title: app.job.title,
      location: app.job.location,
      company: {
        name: app.job.company.name,
        verified: app.job.company.verified,
      },
      studyCase: app.job.studyCase
        ? {
            title: app.job.studyCase.title,
            deadline: app.job.studyCase.deadline.toISOString(),
          }
        : null,
    },
    submission: app.submission
      ? {
          id: app.submission.id,
          submittedAt: app.submission.submittedAt.toISOString(),
          repoUrl: app.submission.repoUrl,
        }
      : null,
    review: app.review
      ? {
          score: app.review.score,
          decision: app.review.decision,
        }
      : null,
  }))

  return (
    <StudentLayout
      user={{
        name: student.name,
        email: session.email,
        major: student.major,
      }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Status Lamaran PKL Saya
          </h1>
          <p className="mt-1 text-sm text-base-600">
            Pantau seluruh posisi yang telah kamu lamar, kumpulkan solusi study case industri, dan lihat perkembangan seleksi magangmu.
          </p>
        </div>

        {/* Applications List */}
        <ApplicationsList applications={applications} />
      </div>
    </StudentLayout>
  )
}
