import { requireCompany } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { CompanyJobsList } from './CompanyJobsList'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Kelola Lowongan PKL | YukMagang',
  description: 'Daftar lowongan PKL industri dan tantangan study case yang Anda publikasikan.',
}

interface CompanyJobsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CompanyJobsPage({ searchParams }: CompanyJobsPageProps) {
  const session = await requireCompany()
  const params = await searchParams
  const justCreated = params?.created === 'true'

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

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: {
      skills: {
        include: {
          skill: {
            select: { id: true, name: true, category: true },
          },
        },
      },
      studyCase: {
        select: {
          id: true,
          title: true,
          problemDescription: true,
          instructions: true,
          deadline: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
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
      <div className="space-y-6 max-w-5xl">
        <PageHeader
          title="Lowongan PKL Anda"
          description="Kelola lowongan magang industri dan pantau keterlibatan siswa pada setiap tantangan study case nyata."
          action={
            <Link href="/company/jobs/create">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Buat Lowongan
              </Button>
            </Link>
          }
        />

        <CompanyJobsList initialJobs={jobs} justCreated={justCreated} />
      </div>
    </CompanyLayout>
  )
}
