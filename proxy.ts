import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId: string
  email: string
  role: 'STUDENT' | 'COMPANY'
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'yukmagang_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  },
}

async function getSessionFromCookies(): Promise<SessionData | null> {
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

export async function proxy(request: NextRequest): Promise<NextResponse | void> {
  const { pathname } = request.nextUrl
  
  const session = await getSessionFromCookies()
  
  const isStudentRoute = pathname.startsWith('/student')
  const isCompanyRoute = pathname.startsWith('/company')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isRoot = pathname === '/'
  
  if (!session) {
    if (isStudentRoute || isCompanyRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return
  }
  
  if (isStudentRoute && session.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/company', request.url))
  }
  
  if (isCompanyRoute && session.role !== 'COMPANY') {
    return NextResponse.redirect(new URL('/student', request.url))
  }
  
  if (isAuthRoute || isRoot) {
    const redirectTo = session.role === 'STUDENT' ? '/student' : '/company'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }
}