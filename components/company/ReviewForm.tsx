'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { reviewApplication, ReviewInput } from '@/app/actions/company/review'
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Send,
  Info,
} from 'lucide-react'

interface ReviewFormProps {
  applicationId: string
  jobTitle: string
  studentName: string
  existingReview?: {
    score: number
    feedback: string
    decision: 'ACCEPTED' | 'REJECTED'
  } | null
}

export function ReviewForm({
  applicationId,
  jobTitle,
  studentName,
  existingReview,
}: ReviewFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [decision, setDecision] = useState<'ACCEPTED' | 'REJECTED'>(
    existingReview?.decision || 'ACCEPTED'
  )
  const [score, setScore] = useState<number | string>(
    existingReview?.score !== undefined ? existingReview.score : 80
  )
  const [feedback, setFeedback] = useState(existingReview?.feedback || '')

  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const numScore = Number(score)
    const errors: Record<string, string> = {}

    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      errors.score = 'Skor harus berupa bilangan antara 0 hingga 100.'
    }

    if (!feedback.trim()) {
      errors.feedback = 'Umpan balik wajib diisi.'
    } else if (feedback.trim().length < 10) {
      errors.feedback = 'Umpan balik minimal 10 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: ReviewInput = {
      score: numScore,
      feedback: feedback.trim(),
      decision,
    }

    startTransition(async () => {
      try {
        const result = await reviewApplication(applicationId, payload)

        if (!result.success) {
          setFormError(result.error)
          if (result.field) {
            setFieldErrors((prev) => ({ ...prev, [result.field!]: result.error }))
          }
          return
        }

        setSuccessMessage('Penilaian berhasil disimpan! Portofolio siswa telah diperbarui.')
        router.refresh()
      } catch {
        setFormError('Terjadi kendala saat menyimpan penilaian. Silakan coba lagi.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-brand-500/30 rounded-lg p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div className="border-b border-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-brand-700">
          <Award className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Formulir Penilaian Praktisi Industri
          </span>
        </div>
        <h3 className="text-lg font-bold text-foreground">
          Evaluasi Solusi Study Case: {studentName}
        </h3>
        <p className="text-xs text-muted-foreground">
          Posisi: <strong className="text-foreground">{jobTitle}</strong>
        </p>
      </div>

      {formError && (
        <div className="p-3.5 bg-destructive-light text-destructive border border-red-200 rounded-md text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-brand-50 text-brand-900 border border-brand-200 rounded-md text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Decision Radio Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-foreground">
          Keputusan Seleksi PKL <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Accept Option */}
          <button
            type="button"
            onClick={() => setDecision('ACCEPTED')}
            className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all ${
              decision === 'ACCEPTED'
                ? 'bg-brand-50/80 border-brand-600 ring-2 ring-brand-500/20'
                : 'bg-background border-border hover:bg-base-50'
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                decision === 'ACCEPTED' ? 'text-brand-700' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className="text-sm font-bold text-foreground">Diterima Magang PKL</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Kandidat memenuhi kualifikasi teknis dan dapat bergabung dalam program magang perusahaan.
              </p>
            </div>
          </button>

          {/* Reject Option */}
          <button
            type="button"
            onClick={() => setDecision('REJECTED')}
            className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all ${
              decision === 'REJECTED'
                ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-500/20'
                : 'bg-background border-border hover:bg-base-50'
            }`}
          >
            <XCircle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                decision === 'REJECTED' ? 'text-amber-700' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className="text-sm font-bold text-foreground">Belum Memenuhi Kualifikasi</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Kandidat belum lolos posisi ini, namun karya dan umpan balik tetap menjadi portofolio berharga miliknya.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Numeric Score */}
      <div className="space-y-1.5 max-w-xs">
        <label htmlFor="score" className="block text-xs font-semibold text-foreground">
          Skor Evaluasi Teknis (0 - 100) <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="score"
            type="number"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            disabled={isPending}
            required
            className={`w-full px-3 py-2 text-sm bg-background border rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
              fieldErrors.score ? 'border-destructive' : 'border-input'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
            / 100
          </span>
        </div>
        {fieldErrors.score ? (
          <p className="text-tiny text-destructive">{fieldErrors.score}</p>
        ) : (
          <p className="text-tiny text-muted-foreground">
            Nilai objektivitas praktisi berdasarkan kelengkapan fitur, arsitektur kode, dan solusi masalah.
          </p>
        )}
      </div>

      {/* Feedback Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="feedback" className="block text-xs font-semibold text-foreground">
            Catatan Evaluasi & Umpan Balik Teknis <span className="text-destructive">*</span>
          </label>
          <span className="text-tiny text-muted-foreground font-mono">
            {feedback.trim().length} karakter
          </span>
        </div>
        <textarea
          id="feedback"
          rows={5}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Berikan masukan yang membangun mengenai kualitas kodenya, hal yang sudah sangat baik, serta saran peningkatan kemampuan teknis siswa di masa mendatang..."
          disabled={isPending}
          required
          className={`w-full p-3 text-sm bg-background border rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring resize-y ${
            fieldErrors.feedback ? 'border-destructive' : 'border-input'
          }`}
        />
        {fieldErrors.feedback ? (
          <p className="text-tiny text-destructive">{fieldErrors.feedback}</p>
        ) : (
          <p className="text-tiny text-muted-foreground">
            Umpan balik ini akan tersimpan pada portofolio siswa sebagai catatan penilaian profesional dari praktisi industri.
          </p>
        )}
      </div>

      {/* Educational Notice */}
      <div className="p-3.5 bg-base-100 rounded-md border border-border text-xs text-base-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-base-500 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground">Otomatis Membangun Portofolio Siswa</p>
          <p className="text-muted-foreground leading-relaxed">
            Menyimpan penilaian ini otomatis menciptakan bukti portofolio teruji untuk siswa, baik diterima maupun belum lolos.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan Penilaian...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {existingReview ? 'Perbarui Penilaian' : 'Simpan & Publikasikan Penilaian'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
