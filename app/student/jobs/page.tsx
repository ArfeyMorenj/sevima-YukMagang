import { getStudentProfile } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { JobsList } from './JobsList'
import { calculateMatch } from '@/lib/matching'

export const dynamic = 'force-dynamic'

export default async function StudentJobsPage() {
  const session = await getStudentProfile()
  const student = session.studentProfile

  const studentSkillIds = student.skills.map((s) => s.skill.id)
  const studentMatchProfile = {
    major: student.major,
    skills: student.skills.map((s) => ({ name: s.skill.name })),
  }

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

  // Format and deterministically compute matching score using calculateMatch
  const formattedJobs = rawJobs.map((job) => {
    const jobSkills = job.skills.map((s) => ({
      id: s.skill.id,
      name: s.skill.name,
    }))

    // Calculate match using pure deterministic matching engine
    const match = calculateMatch(studentMatchProfile, {
      skills: jobSkills,
      techStack: job.techStack,
    })

    return {
      id: job.id,
      title: job.title,
      location: job.location,
      applicationDeadline: job.applicationDeadline.toISOString(),
      company: {
        name: job.company.name,
        verified: job.company.verified,
      },
      skills: jobSkills,
      techStack: job.techStack,
      studyCase: job.studyCase
        ? {
            title: job.studyCase.title,
            deadline: job.studyCase.deadline.toISOString(),
          }
        : null,
      matchPercentage: match.percentage,
      matchedSkillNames: match.matchedSkills,
      majorMatches: match.majorMatches,
    }
  })

  // Deterministic sort: Active jobs with highest match percentage first
  const now = new Date().getTime()
  formattedJobs.sort((a, b) => {
    const aExpired = new Date(a.applicationDeadline).getTime() < now
    const bExpired = new Date(b.applicationDeadline).getTime() < now

    if (aExpired !== bExpired) {
      return aExpired ? 1 : -1 // Active jobs first
    }

    // Match percentage descending
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage
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
