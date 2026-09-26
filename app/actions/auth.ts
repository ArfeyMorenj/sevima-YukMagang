'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { createSession, destroySession } from '@/lib/session'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['STUDENT', 'COMPANY']),
  major: z.enum(['RPL', 'TKJ', 'PPLG', 'OTHER']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type ActionResult = 
  | { success: true; redirectTo: string }
  | { success: false; error: string; field?: string }

function getFirstZodError(error: z.ZodError): { message: string; field?: string } {
  const firstIssue = error.issues[0]
  return {
    message: firstIssue.message,
    field: firstIssue.path[0] as string | undefined,
  }
}

export async function register(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    name: formData.get('name') as string,
    role: formData.get('role') as 'STUDENT' | 'COMPANY',
    major: formData.get('major') as 'RPL' | 'TKJ' | 'PPLG' | 'OTHER' | undefined,
  }
  
  const validated = registerSchema.safeParse(rawData)
  
  if (!validated.success) {
    const { message, field } = getFirstZodError(validated.error)
    return { success: false, error: message, field }
  }
  
  const { email, password, name, role, major } = validated.data
  const normalizedEmail = email.toLowerCase().trim()
  
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
  
  if (existingUser) {
    return { success: false, error: 'Email already registered', field: 'email' }
  }
  
  const passwordHash = await hashPassword(password)
  
  try {
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role,
        ...(role === 'STUDENT' && {
          studentProfile: {
            create: {
              name,
              major: major || 'OTHER',
            },
          },
        }),
        ...(role === 'COMPANY' && {
          company: {
            create: {
              name,
            },
          },
        }),
      },
    })
    
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    
    return { 
      success: true, 
      redirectTo: role === 'STUDENT' ? '/student' : '/company' 
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Registration failed. Please try again.' }
  }
}

export async function login(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const validated = loginSchema.safeParse(rawData)
  
  if (!validated.success) {
    const { message, field } = getFirstZodError(validated.error)
    return { success: false, error: message, field }
  }
  
  const { email, password } = validated.data
  const normalizedEmail = email.toLowerCase().trim()
  
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
  
  if (!user) {
    return { success: false, error: 'Invalid email or password', field: 'email' }
  }
  
  const isValid = await verifyPassword(password, user.passwordHash)
  
  if (!isValid) {
    return { success: false, error: 'Invalid email or password', field: 'password' }
  }
  
  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
  
  return { 
    success: true, 
    redirectTo: user.role === 'STUDENT' ? '/student' : '/company' 
  }
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect('/login')
}