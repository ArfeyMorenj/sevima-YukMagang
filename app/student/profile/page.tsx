import { getStudentProfile } from '@/lib/proxy'
import StudentProfileForm from './StudentProfileForm'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { redirect } from 'next/navigation'

async function getProfileData() {
  try {
    return await getStudentProfile()
  } catch {
    redirect('/login')
  }
}

export default async function StudentProfilePage() {
  const session = await getProfileData()

  return (
    <StudentLayout
      user={{
        name: session.studentProfile.name,
        email: session.email,
        major: session.studentProfile.major,
      }}
    >
      <div className="max-w-3xl">
        <StudentProfileForm initialData={session} />
      </div>
    </StudentLayout>
  )
}