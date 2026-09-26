'use client'

import { useState } from 'react'
import { register } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, AlertCircle, GraduationCap, Building2 } from 'lucide-react'

const majors = [
  { value: 'RPL', label: 'RPL (Rekayasa Perangkat Lunak)' },
  { value: 'TKJ', label: 'TKJ (Teknik Komputer dan Jaringan)' },
  { value: 'PPLG', label: 'PPLG (Pengembangan Perangkat Lunak dan Gim)' },
  { value: 'OTHER', label: 'Jurusan Terkait Lainnya' },
]

const roles = [
  {
    value: 'STUDENT' as const,
    label: 'Siswa SMK',
    desc: 'Cari PKL, kerjakan study case, dan bangun portfolio',
    icon: GraduationCap,
  },
  {
    value: 'COMPANY' as const,
    label: 'Perusahaan',
    desc: 'Buka lowongan PKL dan temukan talenta vokasi terbaik',
    icon: Building2,
  },
]

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'STUDENT' as 'STUDENT' | 'COMPANY',
    major: 'RPL' as 'RPL' | 'TKJ' | 'PPLG' | 'OTHER',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 15
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 10
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 10
    return Math.min(strength, 100)
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setIsLoading(true)

    const fd = new FormData()
    fd.set('email', formData.email)
    fd.set('password', formData.password)
    fd.set('confirmPassword', formData.confirmPassword)
    fd.set('name', formData.name)
    fd.set('role', formData.role)
    if (formData.role === 'STUDENT') {
      fd.set('major', formData.major)
    }

    try {
      const result = await register(fd)

      if (result.success) {
        router.push(result.redirectTo)
        router.refresh()
      } else {
        setError(result.error)
        if (result.field) {
          setFieldErrors((prev) => ({ ...prev, [result.field!]: result.error }))
        }
      }
    } catch {
      setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          className="p-3 bg-destructive-light/60 border border-destructive/20 text-destructive text-sm rounded-md flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selection */}
      <fieldset>
        <legend className="block text-sm font-medium mb-2 text-foreground">
          Daftar Sebagai
        </legend>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Pilih peran akun">
          {roles.map((r) => {
            const isSelected = formData.role === r.value
            const Icon = r.icon
            return (
              <label
                key={r.value}
                className={cn(
                  'relative flex flex-col p-3.5 border rounded-md cursor-pointer transition-all',
                  isSelected
                    ? 'bg-brand-50/70 border-brand-500 text-brand-900 shadow-2xs ring-1 ring-brand-500'
                    : 'border-border bg-card text-muted-foreground hover:border-base-300 hover:bg-base-50/50'
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={isSelected}
                  onChange={handleChange}
                  className="sr-only"
                  aria-label={r.label}
                />
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn('w-4 h-4', isSelected ? 'text-brand-600' : 'text-muted-foreground')} />
                  <span className="font-semibold text-sm text-foreground">{r.label}</span>
                </div>
                <span className="text-2xs text-base-600 leading-tight line-clamp-2">
                  {r.desc}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium mb-1.5 text-foreground">
          {formData.role === 'STUDENT' ? 'Nama Lengkap Siswa' : 'Nama Perusahaan'}
        </label>
        <Input
          id="reg-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder={formData.role === 'STUDENT' ? 'Budi Santoso' : 'PT Teknologi Maju Sejahtera'}
          disabled={isLoading}
          error={fieldErrors.name}
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium mb-1.5 text-foreground">
          Alamat Email
        </label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="nama@email.com"
          disabled={isLoading}
          error={fieldErrors.email}
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium mb-1.5 text-foreground">
          Password
        </label>
        <div className="relative">
          <Input
            id="reg-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimal 8 karakter"
            minLength={8}
            disabled={isLoading}
            error={fieldErrors.password}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1.5 h-1">
              {[25, 50, 75, 100].map((threshold) => (
                <div
                  key={threshold}
                  className="flex-1 h-full rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor:
                      passwordStrength >= threshold
                        ? passwordStrength <= 25
                          ? 'hsl(var(--destructive))'
                          : passwordStrength <= 50
                          ? 'hsl(var(--warning))'
                          : passwordStrength <= 75
                          ? 'hsl(var(--accent))'
                          : 'hsl(var(--success))'
                        : 'hsl(var(--base-200))',
                  }}
                />
              ))}
            </div>
            <p className="text-2xs text-muted-foreground">
              Kekuatan sandi:{' '}
              <span className="font-medium text-foreground">
                {passwordStrength < 25
                  ? 'Sangat Lemah'
                  : passwordStrength < 50
                  ? 'Cukup'
                  : passwordStrength < 75
                  ? 'Kuat'
                  : 'Sangat Kuat'}
              </span>
            </p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="reg-confirm-password" className="block text-sm font-medium mb-1.5 text-foreground">
          Konfirmasi Password
        </label>
        <Input
          id="reg-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Ulangi password di atas"
          disabled={isLoading}
          error={fieldErrors.confirmPassword}
        />
      </div>

      {formData.role === 'STUDENT' && (
        <div>
          <label htmlFor="reg-major" className="block text-sm font-medium mb-1.5 text-foreground">
            Jurusan SMK
          </label>
          <Select
            id="reg-major"
            name="major"
            value={formData.major}
            onChange={handleChange}
            options={majors}
            placeholder="Pilih jurusan kamu"
            disabled={isLoading}
            error={fieldErrors.major}
          />
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 text-base font-semibold shadow-xs"
          loading={isLoading}
        >
          {isLoading ? 'Membuat Akun...' : 'Daftar Sekarang'}
        </Button>
      </div>
    </form>
  )

  return (
    <AuthLayout
      formTitle="Buat Akun Baru"
      formSubtitle="Bergabung dengan YukMagang untuk peluang PKL berkualitas atau temukan kandidat berbakat."
      formAction={formContent}
      footerLinks={
        <p>
          Sudah memiliki akun?{' '}
          <Link href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
            Masuk di sini
          </Link>
        </p>
      }
    />
  )
}