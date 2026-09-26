'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireStudent } from '@/lib/proxy'
import { revalidatePath } from 'next/cache'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  major: z.enum(['RPL', 'TKJ', 'PPLG', 'OTHER']),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
})

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string }

function getFirstZodError(error: z.ZodError): { message: string; field?: string } {
  const firstIssue = error.issues[0]
  return {
    message: firstIssue.message,
    field: firstIssue.path[0] as string | undefined,
  }
}

export async function updateStudentProfile(formData: FormData): Promise<ActionResult> {
  const session = await requireStudent()

  const rawData = {
    name: formData.get('name') as string,
    major: formData.get('major') as 'RPL' | 'TKJ' | 'PPLG' | 'OTHER',
    bio: formData.get('bio') as string | undefined,
  }

  const validated = updateProfileSchema.safeParse(rawData)

  if (!validated.success) {
    const { message, field } = getFirstZodError(validated.error)
    return { success: false, error: message, field }
  }

  const { name, major, bio } = validated.data

  try {
    const profile = await prisma.studentProfile.update({
      where: { userId: session.userId },
      data: {
        name,
        major,
        bio: bio ?? null,
      },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    })

    revalidatePath('/student/profile')

    return { success: true, data: profile }
  } catch (error) {
    console.error('Update student profile error:', error)
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }
}

export async function addStudentSkill(skillId: string): Promise<ActionResult> {
  const session = await requireStudent()

  if (!skillId) {
    return { success: false, error: 'Skill ID is required', field: 'skillId' }
  }

  try {
    const existingSkill = await prisma.skill.findUnique({ where: { id: skillId } })
    if (!existingSkill) {
      return { success: false, error: 'Skill not found', field: 'skillId' }
    }

    const profile = await prisma.studentProfile.findUniqueOrThrow({ where: { userId: session.userId } })

    await prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: profile.id,
          skillId,
        },
      },
      update: {},
      create: {
        studentId: profile.id,
        skillId,
      },
    })

    revalidatePath('/student/profile')

    return { success: true, data: { skillId, skill: existingSkill } }
  } catch (error) {
    console.error('Add student skill error:', error)
    return { success: false, error: 'Failed to add skill. Please try again.' }
  }
}

export async function removeStudentSkill(skillId: string): Promise<ActionResult> {
  const session = await requireStudent()

  if (!skillId) {
    return { success: false, error: 'Skill ID is required', field: 'skillId' }
  }

  try {
    const profile = await prisma.studentProfile.findUniqueOrThrow({ where: { userId: session.userId } })

    await prisma.studentSkill.delete({
      where: {
        studentId_skillId: {
          studentId: profile.id,
          skillId,
        },
      },
    })

    revalidatePath('/student/profile')

    return { success: true, data: null }
  } catch (error) {
    console.error('Remove student skill error:', error)
    return { success: false, error: 'Failed to remove skill. Please try again.' }
  }
}