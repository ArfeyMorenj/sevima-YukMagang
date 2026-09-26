'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireCompany } from '@/lib/proxy'
import { revalidatePath } from 'next/cache'

const reviewSchema = z.object({
  score: z
    .number({ message: 'Skor harus berupa angka' })
    .int('Skor harus berupa bilangan bulat')
    .min(0, 'Skor minimal adalah 0')
    .max(100, 'Skor maksimal adalah 100'),
  feedback: z
    .string()
    .trim()
    .min(10, 'Umpan balik minimal 10 karakter')
    .max(5000, 'Umpan balik maksimal 5000 karakter'),
  decision: z.enum(['ACCEPTED', 'REJECTED'], {
    message: 'Keputusan harus berupa Diterima (ACCEPTED) atau Belum Lolos (REJECTED)',
  }),
})

export type ReviewInput = z.infer<typeof reviewSchema>

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string }

export async function reviewApplication(
  applicationId: string,
  input: ReviewInput
): Promise<ActionResult<{ reviewId: string }>> {
  // 1. Authenticate company
  const session = await requireCompany()

  if (!applicationId || typeof applicationId !== 'string') {
    return { success: false, error: 'Application ID tidak valid.' }
  }

  // 2. Validate input
  const validated = reviewSchema.safeParse(input)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    return {
      success: false,
      error: firstIssue.message,
      field: firstIssue.path[0] as string | undefined,
    }
  }

  const { score, feedback, decision } = validated.data

  try {
    // 3. Find company
    const company = await prisma.company.findUnique({
      where: { userId: session.userId },
      select: { id: true, name: true },
    })

    if (!company) {
      return { success: false, error: 'Profil perusahaan tidak ditemukan.' }
    }

    // 4. Find application and verify company ownership
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            id: true,
            companyId: true,
            title: true,
            techStack: true,
            studyCase: {
              select: {
                title: true,
              },
            },
          },
        },
        submission: true,
        student: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!application) {
      return { success: false, error: 'Lamaran tidak ditemukan.' }
    }

    // Critical ownership verification: Job must belong to this company
    if (application.job.companyId !== company.id) {
      return { success: false, error: 'Akses ditolak: Lowongan ini bukan milik perusahaan Anda.' }
    }

    if (!application.submission) {
      return {
        success: false,
        error: 'Siswa belum mengumpulkan solusi study case. Anda hanya dapat menilai lamaran yang telah mengumpulkan solusi.',
      }
    }

    // 5. Transaction: Review + Application status + PortfolioItem atomically
    const review = await prisma.$transaction(async (tx) => {
      // Create or update review
      const rev = await tx.review.upsert({
        where: { applicationId },
        create: {
          applicationId,
          score,
          feedback,
          decision,
        },
        update: {
          score,
          feedback,
          decision,
          reviewedAt: new Date(),
        },
      })

      // Update application status to match decision (ACCEPTED or REJECTED)
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: decision,
        },
      })

      // Create or update portfolio item (Both ACCEPTED and REJECTED create valid portfolio evidence!)
      await tx.portfolioItem.upsert({
        where: { applicationId },
        create: {
          studentId: application.student.id,
          applicationId: application.id,
          studyCaseTitle: application.job.studyCase?.title || application.job.title,
          companyName: company.name,
          technologies: application.job.techStack,
          repoUrl: application.submission!.repoUrl,
          deployedUrl: application.submission!.deployedUrl,
          score,
          feedback,
          result: decision,
        },
        update: {
          studyCaseTitle: application.job.studyCase?.title || application.job.title,
          companyName: company.name,
          technologies: application.job.techStack,
          repoUrl: application.submission!.repoUrl,
          deployedUrl: application.submission!.deployedUrl,
          score,
          feedback,
          result: decision,
        },
      })

      return rev
    })

    // 6. Revalidate affected routes
    revalidatePath(`/company/applications/${applicationId}/review`)
    revalidatePath(`/company/jobs/${application.job.id}/applicants`)
    revalidatePath(`/student/applications/${applicationId}`)
    revalidatePath('/student/applications')
    revalidatePath('/student/portfolio')
    revalidatePath('/company/jobs')

    return { success: true, data: { reviewId: review.id } }
  } catch (error) {
    console.error('Review application error:', error)
    return { success: false, error: 'Gagal menyimpan penilaian. Silakan coba lagi.' }
  }
}
