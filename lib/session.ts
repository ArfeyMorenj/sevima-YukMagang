import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId: string
  email: string
  role: 'STUDENT' | 'COMPANY'
}

export interface SessionOptions {
  password: string
  cookieName: string
  cookieOptions: {
    secure: boolean
    httpOnly: boolean
    sameSite: 'lax'
    maxAge: number
    path: string
  }
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'yukmagang_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  
  if (!session.userId) {
    return null
  }
  
  return {
    userId: session.userId,
    email: session.email,
    role: session.role,
  }
}

export async function createSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  
  session.userId = data.userId
  session.email = data.email
  session.role = data.role
  
  await session.save()
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  
  await session.destroy()
}