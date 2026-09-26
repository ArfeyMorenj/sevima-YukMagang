'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireCompany } from '@/lib/proxy'
import { revalidatePath } from 'next/cache'

const updateCompanyProfileSchema = z.object({
  name: z.string().trim().min(2, 'Nama perusahaan minimal 2 karakter').max(100, 'Nama perusahaan maksimal 100 karakter'),
  description: z.string().trim().max(1000, 'Deskripsi perusahaan maksimal 1000 karakter').optional(),
  location: z.string().trim().max(200, 'Lokasi maksimal 200 karakter').optional(),
  website: z
    .string()
    .trim()
    .max(255, 'Tautan website maksimal 255 karakter')
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      try {
        const url = new URL(val)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    }, 'Format URL website tidak valid (harus diawali http:// atau https://)'),
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

export async function updateCompanyProfile(formData: FormData): Promise<ActionResult> {
  const session = await requireCompany()

  const rawData = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || undefined,
    location: (formData.get('location') as string) || undefined,
    website: (formData.get('website') as string) || undefined,
  }

  const validated = updateCompanyProfileSchema.safeParse(rawData)

  if (!validated.success) {
    const { message, field } = getFirstZodError(validated.error)
    return { success: false, error: message, field }
  }

  const { name, description, location, website } = validated.data

  try {
    const company = await prisma.company.update({
      where: { userId: session.userId },
      data: {
        name,
        description: description && description.length > 0 ? description : null,
        location: location && location.length > 0 ? location : null,
        website: website && website.length > 0 ? website : null,
      },
    })

    revalidatePath('/company')
    revalidatePath('/company/profile')

    return { success: true, data: company }
  } catch (error) {
    console.error('Update company profile error:', error)
    return { success: false, error: 'Gagal memperbarui profil perusahaan. Silakan coba lagi.' }
  }
}
