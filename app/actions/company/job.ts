'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireCompany } from '@/lib/proxy'
import { revalidatePath } from 'next/cache'

const createJobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Judul lowongan minimal 3 karakter')
      .max(150, 'Judul lowongan maksimal 150 karakter'),
    description: z
      .string()
      .trim()
      .min(20, 'Deskripsi lowongan minimal 20 karakter')
      .max(5000, 'Deskripsi lowongan maksimal 5000 karakter'),
    location: z
      .string()
      .trim()
      .min(2, 'Lokasi / skema kerja minimal 2 karakter')
      .max(150, 'Lokasi maksimal 150 karakter'),
    techStack: z
      .array(z.string().trim().min(1))
      .min(1, 'Sebutkan minimal 1 teknologi / tech stack utama'),
    applicationDeadline: z.string().refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime()) && date > new Date()
    }, 'Batas pendaftaran harus berupa tanggal di masa depan'),
    skillIds: z
      .array(z.string().min(1))
      .min(1, 'Pilih minimal 1 keahlian teknis yang dibutuhkan'),
    studyCase: z.object({
      title: z
        .string()
        .trim()
        .min(3, 'Judul study case minimal 3 karakter')
        .max(150, 'Judul study case maksimal 150 karakter'),
      problemDescription: z
        .string()
        .trim()
        .min(20, 'Deskripsi masalah study case minimal 20 karakter')
        .max(5000, 'Deskripsi masalah maksimal 5000 karakter'),
      instructions: z
        .string()
        .trim()
        .min(20, 'Instruksi pengerjaan minimal 20 karakter')
        .max(5000, 'Instruksi pengerjaan maksimal 5000 karakter'),
      requiredSkills: z
        .array(z.string().trim().min(1))
        .min(1, 'Minimal 1 keahlian diperlukan untuk study case'),
      deadline: z.string().refine((val) => {
        const date = new Date(val)
        return !isNaN(date.getTime()) && date > new Date()
      }, 'Batas pengumpulan study case harus berupa tanggal di masa depan'),
    }),
  })
  .refine(
    (data) => {
      const appDate = new Date(data.applicationDeadline)
      const caseDate = new Date(data.studyCase.deadline)
      return caseDate <= appDate
    },
    {
      message: 'Batas pengerjaan study case tidak boleh melebihi batas akhir pendaftaran lowongan',
      path: ['studyCase', 'deadline'],
    }
  )

export type CreateJobInput = z.infer<typeof createJobSchema>

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string }

function getFirstZodError(error: z.ZodError): { message: string; field?: string } {
  const firstIssue = error.issues[0]
  const field = firstIssue.path.join('.')
  return {
    message: firstIssue.message,
    field: field || undefined,
  }
}

export async function createJob(input: CreateJobInput): Promise<ActionResult<{ id: string }>> {
  const session = await requireCompany()

  const company = await prisma.company.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  })

  if (!company) {
    return { success: false, error: 'Profil perusahaan tidak ditemukan. Silakan lengkapi profil terlebih dahulu.' }
  }

  const validated = createJobSchema.safeParse(input)

  if (!validated.success) {
    const { message, field } = getFirstZodError(validated.error)
    return { success: false, error: message, field }
  }

  const { title, description, location, techStack, applicationDeadline, skillIds, studyCase } = validated.data

  try {
    const newJob = await prisma.$transaction(async (tx) => {
      const existingSkills = await tx.skill.findMany({
        where: { id: { in: skillIds } },
        select: { id: true, name: true },
      })

      if (existingSkills.length !== skillIds.length) {
        throw new Error('Satu atau lebih keahlian yang dipilih tidak valid.')
      }

      const studyCaseSkills =
        studyCase.requiredSkills.length > 0
          ? studyCase.requiredSkills
          : existingSkills.map((s) => s.name)

      const job = await tx.job.create({
        data: {
          companyId: company.id,
          title,
          description,
          location,
          techStack,
          applicationDeadline: new Date(applicationDeadline),
          skills: {
            create: skillIds.map((skillId) => ({ skillId })),
          },
          studyCase: {
            create: {
              title: studyCase.title,
              problemDescription: studyCase.problemDescription,
              instructions: studyCase.instructions,
              requiredSkills: studyCaseSkills,
              deadline: new Date(studyCase.deadline),
            },
          },
        },
        select: {
          id: true,
        },
      })

      return job
    })

    revalidatePath('/company')
    revalidatePath('/company/jobs')

    return { success: true, data: { id: newJob.id } }
  } catch (error) {
    console.error('Create job transaction error:', error)
    const errMessage = error instanceof Error ? error.message : 'Gagal mempublikasikan lowongan. Silakan coba lagi.'
    return { success: false, error: errMessage }
  }
}

export async function deleteJob(jobId: string): Promise<ActionResult<null>> {
  const session = await requireCompany()

  if (!jobId) {
    return { success: false, error: 'Job ID diperlukan' }
  }

  try {
    const company = await prisma.company.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    })

    if (!company) {
      return { success: false, error: 'Akses ditolak' }
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, companyId: true },
    })

    if (!job || job.companyId !== company.id) {
      return { success: false, error: 'Lowongan tidak ditemukan atau Anda tidak memiliki akses untuk menghapusnya.' }
    }

    await prisma.job.delete({
      where: { id: jobId },
    })

    revalidatePath('/company')
    revalidatePath('/company/jobs')

    return { success: true, data: null }
  } catch (error) {
    console.error('Delete job error:', error)
    return { success: false, error: 'Gagal menghapus lowongan. Silakan coba lagi.' }
  }
}
