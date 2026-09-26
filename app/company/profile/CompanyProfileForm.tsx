'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { updateCompanyProfile } from '@/app/actions/company/profile'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import { FormSection } from '@/components/forms/FormSection'
import { PageHeader } from '@/components/ui/PageHeader'
import { CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'

interface CompanyData {
  id: string
  name: string
  description: string | null
  location: string | null
  website: string | null
  verified: boolean
  user: {
    email: string
  }
}

interface CompanyProfileFormProps {
  initialData: CompanyData
}

export function CompanyProfileForm({ initialData }: CompanyProfileFormProps) {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description || '')
  const [location, setLocation] = useState(initialData.location || '')
  const [website, setWebsite] = useState(initialData.website || '')

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setSuccess(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', name)
      if (description) formData.set('description', description)
      if (location) formData.set('location', location)
      if (website) formData.set('website', website)

      const result = await updateCompanyProfile(formData)

      if (result.success) {
        setSuccess('Profil perusahaan berhasil diperbarui.')
      } else {
        setError(result.error || 'Gagal memperbarui profil.')
        if (result.field) {
          setFieldErrors({ [result.field]: result.error || 'Input tidak valid' })
        }
      }
    })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Profil Perusahaan"
        description="Kelola informasi profil industri Anda untuk mempermudah siswa SMK mengenali lingkungan kerja dan teknologi yang digunakan."
      />

      {/* Verification Status Banner */}
      <div
        className={`p-4 rounded-md border flex items-start sm:items-center justify-between gap-3 text-sm ${
          initialData.verified
            ? 'bg-brand-50/70 border-brand-200 text-brand-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {initialData.verified ? (
            <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" aria-hidden="true" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {initialData.verified ? 'Status Kemitraan: Terverifikasi' : 'Status Kemitraan: Terdaftar'}
            </p>
            <p className="text-xs mt-0.5 opacity-90">
              {initialData.verified
                ? 'Profil perusahaan telah diverifikasi dan siap mempublikasikan lowongan PKL terpercaya.'
                : 'Akun Anda aktif. Verifikasi mitra industri dilakukan secara bertahap oleh tim kurasi YukMagang.'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-md bg-destructive-light/60 border border-destructive/30 text-destructive text-sm flex items-center gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="p-4 rounded-md bg-brand-50 border border-brand-200 text-brand-900 text-sm flex items-center gap-3 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" aria-hidden="true" />
          <span>{success}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection
          title="Identitas Perusahaan"
          description="Nama dan lokasi kerja yang akan dilihat siswa pada daftar lowongan PKL."
        >
          <div className="space-y-4">
            <FormField
              label="Nama Perusahaan"
              name="name"
              type="text"
              required
              value={name}
              onChange={setName}
              placeholder="Contoh: PT Teknologi Bangsa Indonesia"
              error={fieldErrors.name}
              hint="Gunakan nama resmi perusahaan atau brand industri yang dikenal."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Lokasi / Domisili Kantor"
                name="location"
                type="text"
                value={location}
                onChange={setLocation}
                placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                error={fieldErrors.location}
                hint="Kota atau skema kerja (misal: Hybrid / On-site)."
              />

              <FormField
                label="Website Perusahaan"
                name="website"
                type="url"
                value={website}
                onChange={setWebsite}
                placeholder="https://perusahaan.co.id"
                error={fieldErrors.website}
                hint="Tautan website resmi atau portofolio produk industri."
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Tentang Perusahaan"
          description="Berikan gambaran umum mengenai bidang usaha, kultur tim, dan lingkungan kerja magang."
        >
          <FormField
            label="Deskripsi Singkat"
            name="description"
            as="textarea"
            maxLength={1000}
            value={description}
            onChange={setDescription}
            placeholder="Jelaskan fokus industri, teknologi yang dikembangkan, dan apa yang akan dipelajari siswa selama PKL..."
            error={fieldErrors.description}
            hint="Deskripsi yang jelas meningkatkan minat siswa SMK yang tepat untuk mendaftar."
          />
        </FormSection>

        {/* Readonly Account Info */}
        <div className="p-4 rounded-md border border-border bg-base-50/50 text-sm">
          <span className="font-medium text-foreground block mb-1">Email Akun Perusahaan</span>
          <p className="text-muted-foreground font-mono text-xs">{initialData.user.email}</p>
          <p className="text-caption text-muted-foreground mt-1">
            Email login tidak dapat diubah secara mandiri untuk alasan keamanan akun mitra industri.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" loading={isPending} disabled={isPending}>
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
