import { Suspense } from 'react'
import LoginForm from './LoginForm'
import { AuthLayout } from '@/components/layout/AuthLayout'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <AuthLayout
      formTitle="Selamat Datang Kembali"
      formSubtitle="Masuk ke akun YukMagang untuk melanjutkan pencarian PKL atau kelola lowongan."
      formAction={
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>
      }
      footerLinks={
        <p>
          Belum memiliki akun?{' '}
          <Link href="/register" className="text-primary hover:text-primary-hover font-semibold transition-colors">
            Daftar sekarang
          </Link>
        </p>
      }
    />
  )
}