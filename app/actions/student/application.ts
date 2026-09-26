'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireStudent } from '@/lib/proxy'
import { revalidatePath } from 'next/cache'

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string }

// ─── Apply to Job ────────────────────────────────────────────────────────────

export async function applyToJob(jobId: string): Promise<ActionResult<{ applicationId: string }>> {
  const session = await requireStudent()

  if (!jobId || typeof jobId !== 'string' || jobId.trim().length === 0) {
    return { success: false, error: 'Job ID tidak valid.' }
  }

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    })

    if (!student) {
      return { success: false, error: 'Profil siswa tidak ditemukan. Silakan lengkapi profil terlebih dahulu.' }
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true, applicationDeadline: true },
    })

    if (!job) {
      return { success: false, error: 'Lowongan tidak ditemukan.' }
    }

    if (new Date() > job.applicationDeadline) {
      return { success: false, error: 'Batas pendaftaran lowongan ini sudah berakhir.' }
    }

    const existing = await prisma.application.findUnique({
      where: {
        studentId_jobId: {
          studentId: student.id,
          jobId: job.id,
        },
      },
      select: { id: true },
    })

    if (existing) {
      return { success: false, error: 'Kamu sudah melamar ke lowongan ini sebelumnya.', field: 'duplicate' }
    }

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId: job.id,
        status: 'PENDING',
      },
      select: { id: true },
    })

    revalidatePath('/student/applications')
    revalidatePath('/student/jobs')
    revalidatePath(`/student/jobs/${jobId}`)

    return { success: true, data: { applicationId: application.id } }
  } catch (error) {
    console.error('Apply to job error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, error: 'Kamu sudah melamar ke lowongan ini sebelumnya.', field: 'duplicate' }
    }
    return { success: false, error: 'Gagal mengirim lamaran. Silakan coba lagi.' }
  }
}

// ─── Submit Study Case ────────────────────────────────────────────────────────

const submissionSchema = z.object({
  repoUrl: z
    .string()
    .trim()
    .min(1, 'URL repositori wajib diisi')
    .url('URL repositori tidak valid — pastikan diawali dengan https://'),
  deployedUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || z.string().url().safeParse(val).success,
      'URL deploy tidak valid — pastikan diawali dengan https://'
    ),
  explanation: z
    .string()
    .trim()
    .min(50, 'Penjelasan solusi minimal 50 karakter')
    .max(5000, 'Penjelasan solusi maksimal 5000 karakter'),
})

export type SubmissionInput = z.infer<typeof submissionSchema>

export async function submitStudyCase(
  applicationId: string,
  input: SubmissionInput
): Promise<ActionResult<{ submissionId: string }>> {
  const session = await requireStudent()

  if (!applicationId || typeof applicationId !== 'string') {
    return { success: false, error: 'Application ID tidak valid.' }
  }

  const validated = submissionSchema.safeParse(input)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    return {
      success: false,
      error: firstIssue.message,
      field: firstIssue.path[0] as string | undefined,
    }
  }

  const { repoUrl, deployedUrl, explanation } = validated.data

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    })

    if (!student) {
      return { success: false, error: 'Profil siswa tidak ditemukan.' }
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        studentId: true,
        status: true,
        submission: { select: { id: true } },
        job: {
          select: {
            studyCase: { select: { id: true } },
          },
        },
      },
    })

    if (!application) {
      return { success: false, error: 'Lamaran tidak ditemukan.' }
    }

    if (application.studentId !== student.id) {
      return { success: false, error: 'Akses ditolak.' }
    }

    if (!application.job.studyCase) {
      return { success: false, error: 'Lowongan ini tidak memiliki study case untuk dikumpulkan.' }
    }

    if (application.submission) {
      return { success: false, error: 'Kamu sudah mengumpulkan study case untuk lamaran ini.' }
    }

    const submission = await prisma.submission.create({
      data: {
        applicationId: application.id,
        repoUrl,
        deployedUrl: deployedUrl && deployedUrl.length > 0 ? deployedUrl : null,
        explanation,
      },
      select: { id: true },
    })

    revalidatePath(`/student/applications/${applicationId}`)
    revalidatePath('/student/applications')

    return { success: true, data: { submissionId: submission.id } }
  } catch (error) {
    console.error('Submit study case error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { success: false, error: 'Kamu sudah mengumpulkan study case untuk lamaran ini.' }
    }
    return { success: false, error: 'Gagal mengumpulkan study case. Silakan coba lagi.' }
  }
}
