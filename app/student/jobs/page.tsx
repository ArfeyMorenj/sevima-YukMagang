import { getStudentProfile } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { JobsList } from './JobsList'

export const dynamic = 'force-dynamic'

export default async function StudentJobsPage() {
  const session = await getStudentProfile()
  const student = session.studentProfile

  const studentSkillIds = student.skills.map((s) => s.skill.id)
  const studentSkillSet = new Set(studentSkillIds)

  // Fetch all jobs with relations
  const rawJobs = await prisma.job.findMany({
    include: {
      company: {
        select: {
          name: true,
          verified: true,
        },
      },
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
      studyCase: {
        select: {
          title: true,
          deadline: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Format and deterministically sort by relevance (matched skill count descending, then deadline)
  const formattedJobs = rawJobs.map((job) => ({
    id: job.id,
    title: job.title,
    location: job.location,
    applicationDeadline: job.applicationDeadline.toISOString(),
    company: {
      name: job.company.name,
      verified: job.company.verified,
    },
    skills: job.skills.map((s) => ({
      id: s.skill.id,
      name: s.skill.name,
    })),
    techStack: job.techStack,
    studyCase: job.studyCase
      ? {
          title: job.studyCase.title,
          deadline: job.studyCase.deadline.toISOString(),
        }
      : null,
  }))

  // Sort: jobs with more matched skills first, then non-expired first
  formattedJobs.sort((a, b) => {
    const aMatches = a.skills.filter((s) => studentSkillSet.has(s.id)).length
    const bMatches = b.skills.filter((s) => studentSkillSet.has(s.id)).length
    if (bMatches !== aMatches) {
      return bMatches - aMatches
    }
    return new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime()
  })

  return (
    <StudentLayout
      user={{
        name: student.name,
        email: session.email,
        major: student.major,
      }}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Eksplorasi Lowongan PKL
              </h1>
              <p className="mt-1 text-sm text-base-600">
                Pilih lowongan magang industri yang sesuai dengan kompetensi keahlian dan jurusanmu. Kerjakan study case untuk membuktikan kemampuanmu.
              </p>
            </div>
            {studentSkillIds.length === 0 && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
                  Belum ada skill terdaftar di profil
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Jobs List Client Component */}
        <JobsList
          jobs={formattedJobs}
          studentSkillIds={studentSkillIds}
        />
      </div>
    </StudentLayout>
  )
}
