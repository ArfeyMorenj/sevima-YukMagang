import { requireCompany } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import { CreateJobForm } from './CreateJobForm'

export const metadata = {
  title: 'Buat Lowongan PKL & Study Case | YukMagang',
  description: 'Publikasikan lowongan PKL baru dan buat tantangan study case industri untuk siswa SMK.',
}

export default async function CreateJobPage() {
  const session = await requireCompany()

  const company = await prisma.company.findUnique({
    where: { userId: session.userId },
    include: {
      user: {
        select: { email: true },
      },
    },
  })

  if (!company) {
    redirect('/company/profile')
  }

  // Pre-fetch all available skills for the skill picker
  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      name: true,
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <CompanyLayout
      user={{
        name: company.name,
        email: company.user.email,
        companyName: company.name,
        verified: company.verified,
      }}
    >
      <CreateJobForm availableSkills={skills} />
    </CompanyLayout>
  )
}
