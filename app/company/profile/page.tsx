import { requireCompany } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import { CompanyProfileForm } from './CompanyProfileForm'

export const metadata = {
  title: 'Profil Perusahaan | YukMagang',
  description: 'Kelola identitas dan informasi perusahaan mitra YukMagang.',
}

export default async function CompanyProfilePage() {
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
    redirect('/company')
  }

  return (
    <CompanyLayout
      user={{
        name: company.name,
        email: company.user.email,
        companyName: company.name,
        verified: company.verified,
      }}
    >
      <CompanyProfileForm initialData={company} />
    </CompanyLayout>
  )
}
