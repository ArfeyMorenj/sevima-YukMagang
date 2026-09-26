import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function requireAuth(): Promise<{ userId: string; email: string; role: 'STUDENT' | 'COMPANY' }> {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireStudent(): Promise<{ userId: string; email: string; role: 'STUDENT' }> {
  const session = await requireAuth()
  
  if (session.role !== 'STUDENT') {
    redirect('/company')
  }
  
  return session as { userId: string; email: string; role: 'STUDENT' }
}

export async function requireCompany(): Promise<{ userId: string; email: string; role: 'COMPANY' }> {
  const session = await requireAuth()
  
  if (session.role !== 'COMPANY') {
    redirect('/student')
  }
  
  return session as { userId: string; email: string; role: 'COMPANY' }
}

export async function getOptionalSession(): Promise<{ userId: string; email: string; role: 'STUDENT' | 'COMPANY' } | null> {
  const session = await getSession()
  return session
}

export async function getStudentProfile() {
  const session = await requireStudent()
  
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
    select: { 
      id: true, 
      name: true, 
      major: true, 
      bio: true,
      skills: {
        include: { skill: true },
      },
    },
  })
  
  if (!profile) {
    redirect('/student/profile')
  }
  
  return { ...session, studentProfile: profile }
}

export async function getCompanyProfile() {
  const session = await requireCompany()
  
  const company = await prisma.company.findUnique({
    where: { userId: session.userId },
    select: { id: true, name: true, verified: true },
  })
  
  if (!company) {
    redirect('/company/profile')
  }
  
  return { ...session, company }
}