'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { submitStudyCase, SubmissionInput } from '@/app/actions/student/application'
import {
  FileCode,
  GitBranch,
  Globe,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react'

interface SubmissionFormProps {
  applicationId: string
  companyName: string
  studyCaseTitle: string
}

export function SubmissionForm({
  applicationId,
  companyName,
  studyCaseTitle,
}: SubmissionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [repoUrl, setRepoUrl] = useState('')
  const [deployedUrl, setDeployedUrl] = useState('')
  const [explanation, setExplanation] = useState('')

  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFieldErrors({})

    // Basic client validations
    const errors: Record<string, string> = {}
    if (!repoUrl.trim()) {
      errors.repoUrl = 'URL repositori wajib diisi.'
    } else if (!repoUrl.startsWith('http://') && !repoUrl.startsWith('https://')) {
      errors.repoUrl = 'URL repositori harus diawali dengan https:// atau http://'
    }

    if (deployedUrl.trim() && !deployedUrl.startsWith('http://') && !deployedUrl.startsWith('https://')) {
      errors.deployedUrl = 'URL deploy harus diawali dengan https:// atau http://'
    }

    if (!explanation.trim()) {
      errors.explanation = 'Penjelasan solusi wajib diisi.'
    } else if (explanation.trim().length < 50) {
      errors.explanation = `Penjelasan masih kurang ${50 - explanation.trim().length} karakter lagi (minimal 50 karakter).`
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload: SubmissionInput = {
      repoUrl: repoUrl.trim(),
      deployedUrl: deployedUrl.trim() || undefined,
      explanation: explanation.trim(),
    }

    startTransition(async () => {
      try {
        const result = await submitStudyCase(applicationId, payload)

        if (!result.success) {
          setFormError(result.error)
          if (result.field) {
            setFieldErrors((prev) => ({ ...prev, [result.field!]: result.error }))
          }
          return
        }

        setSuccessMessage('Study case berhasil dikumpulkan! Halaman sedang diperbarui...')
        router.refresh()
      } catch {
        setFormError('Terjadi kendala saat mengirim pengumpulan. Silakan periksa koneksi internet.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-brand-500/40 rounded-lg p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div className="border-b border-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-brand-700">
          <FileCode className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Formulir Pengumpulan</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">
          Kumpulkan Solusi Study Case: {studyCaseTitle}
        </h3>
        <p className="text-xs text-muted-foreground">
          Pastikan repositori kode kamu bersifat publik atau dapat diakses oleh tim teknis {companyName}.
        </p>
      </div>

      {formError && (
        <div className="p-3.5 bg-destructive-light text-destructive border border-red-200 rounded-md text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-brand-50 text-brand-900 border border-brand-200 rounded-md text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Field: Repository URL */}
      <div className="space-y-1.5">
        <label htmlFor="repoUrl" className="block text-xs font-semibold text-foreground">
          Tautan Repositori Kode (GitBranch, GitLab, dll.) <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <GitBranch className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="repoUrl"
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://GitBranch.com/username/project-study-case"
            disabled={isPending}
            required
            className={`w-full pl-9 pr-3 py-2 text-sm bg-background border rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
              fieldErrors.repoUrl ? 'border-destructive' : 'border-input'
            }`}
          />
        </div>
        {fieldErrors.repoUrl ? (
          <p className="text-tiny text-destructive">{fieldErrors.repoUrl}</p>
        ) : (
          <p className="text-tiny text-muted-foreground">
            Sediakan link repositori Git yang berisi kode sumber solusi study case kamu.
          </p>
        )}
      </div>

      {/* Field: Deployed Demo URL (Optional) */}
      <div className="space-y-1.5">
        <label htmlFor="deployedUrl" className="block text-xs font-semibold text-foreground">
          Tautan Demo / Deployment Live <span className="text-muted-foreground font-normal">(Opsional)</span>
        </label>
        <div className="relative">
          <Globe className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="deployedUrl"
            type="url"
            value={deployedUrl}
            onChange={(e) => setDeployedUrl(e.target.value)}
            placeholder="https://project-demo.vercel.app"
            disabled={isPending}
            className={`w-full pl-9 pr-3 py-2 text-sm bg-background border rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${
              fieldErrors.deployedUrl ? 'border-destructive' : 'border-input'
            }`}
          />
        </div>
        {fieldErrors.deployedUrl ? (
          <p className="text-tiny text-destructive">{fieldErrors.deployedUrl}</p>
        ) : (
          <p className="text-tiny text-muted-foreground">
            Jika solusimu sudah di-deploy ke Vercel, Netlify, atau platform cloud lainnya.
          </p>
        )}
      </div>

      {/* Field: Explanation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="explanation" className="block text-xs font-semibold text-foreground">
            Penjelasan Solusi & Arsitektur Kode <span className="text-destructive">*</span>
          </label>
          <span
            className={`text-tiny font-mono ${
              explanation.trim().length < 50 ? 'text-amber-700' : 'text-brand-700'
            }`}
          >
            {explanation.trim().length}/50 karakter minimal
          </span>
        </div>
        <textarea
          id="explanation"
          rows={5}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Jelaskan bagaimana kamu menyelesaikan permasalahan ini, teknologi yang kamu gunakan, struktur file penting, dan kendala yang berhasil kamu atasi..."
          disabled={isPending}
          required
          className={`w-full p-3 text-sm bg-background border rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring resize-y ${
            fieldErrors.explanation ? 'border-destructive' : 'border-input'
          }`}
        />
        {fieldErrors.explanation ? (
          <p className="text-tiny text-destructive">{fieldErrors.explanation}</p>
        ) : (
          <p className="text-tiny text-muted-foreground">
            Uraikan pendekatan teknismu secara jelas agar tim penilai memahami logika dan pemahamanmu.
          </p>
        )}
      </div>

      {/* Human Review Notice — Anti Fake AI Slop */}
      <div className="p-3.5 bg-base-100 rounded-md border border-border text-xs text-base-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-base-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground">Penilaian Dilakukan Langsung oleh Perusahaan Mitra</p>
          <p className="text-muted-foreground leading-relaxed">
            Kode dan penjelasan yang kamu kumpulkan akan dievaluasi oleh praktisi industri dari {companyName}, bukan otomatisasi AI. Penilaian mencakup kualitas kode, kelengkapan fitur, dan pemahaman konsep.
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
              Mengumpulkan Solusi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kumpulkan Solusi Study Case
            </>
          )}
        </button>
      </div>
    </form>
  )
}
