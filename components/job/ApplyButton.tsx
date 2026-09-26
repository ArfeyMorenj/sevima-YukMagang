'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { applyToJob } from '@/app/actions/student/application'
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ApplyButtonProps {
  jobId: string
  isExpired: boolean
  existingApplicationId?: string | null
}

export function ApplyButton({ jobId, isExpired, existingApplicationId }: ApplyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (existingApplicationId) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-brand-700 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-brand-950">
              Kamu Sudah Melamar ke Lowongan Ini
            </p>
            <p className="text-xs text-brand-800">
              Cek progres pengerjaan study case atau status seleksi di halaman lamaranmu.
            </p>
          </div>
        </div>
        <Link
          href={`/student/applications/${existingApplicationId}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors flex-shrink-0"
        >
          Lihat Halaman Lamaran
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="bg-destructive-light/60 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-destructive">
            Pendaftaran Lowongan Ditutup
          </p>
          <p className="text-xs text-muted-foreground">
            Batas waktu pendaftaran untuk posisi ini telah berakhir.
          </p>
        </div>
      </div>
    )
  }

  const handleApply = async () => {
    setError(null)
    setLoading(true)

    try {
      const res = await applyToJob(jobId)

      if (!res.success) {
        setError(res.error)
        setLoading(false)
        return
      }

      // Success: navigate to the student's new application workspace
      router.push(`/student/applications/${res.data.applicationId}`)
    } catch {
      setError('Terjadi kendala jaringan. Silakan coba beberapa saat lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-destructive-light text-destructive border border-red-200 rounded-md text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-base-50 border border-border rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Siap Membuktikan Kemampuanmu?
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-lg">
            Dengan menekan tombol lamar, kamu resmi mendaftar dan mendapatkan akses workspace untuk mengumpulkan solusi Study Case industri ini.
          </p>
        </div>
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold shadow-xs transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses Lamaran...
            </>
          ) : (
            <>
              Lamar & Mulai Study Case
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
