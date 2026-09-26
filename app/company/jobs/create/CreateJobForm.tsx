'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createJob, CreateJobInput } from '@/app/actions/company/job'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import { SkillPicker } from '@/components/forms/SkillPicker'
import { SkillChip } from '@/components/ui/SkillChip'
import { PageHeader } from '@/components/ui/PageHeader'
import { AlertCircle, Plus, X, ArrowLeft } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
}

interface CreateJobFormProps {
  availableSkills: Skill[]
}

export function CreateJobForm({ availableSkills }: CreateJobFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Job Information
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [techStackInput, setTechStackInput] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [applicationDeadline, setApplicationDeadline] = useState('')

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])

  // Study Case
  const [studyCaseTitle, setStudyCaseTitle] = useState('')
  const [studyCaseProblem, setStudyCaseProblem] = useState('')
  const [studyCaseInstructions, setStudyCaseInstructions] = useState('')
  const [studyCaseDeadline, setStudyCaseDeadline] = useState('')

  // Feedback states
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  // Tech stack tag handler
  const handleAddTech = () => {
    const trimmed = techStackInput.trim()
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack((prev) => [...prev, trimmed])
      setTechStackInput('')
    }
  }

  const handleKeyDownTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTech()
    }
  }

  const handleRemoveTech = (tag: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tag))
  }

  // Skill handlers
  const handleAddSkill = (skillId: string) => {
    const skill = availableSkills.find((s) => s.id === skillId)
    if (skill && !selectedSkills.some((s) => s.id === skillId)) {
      setSelectedSkills((prev) => [...prev, skill])
    }
  }

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Client-side quick checks
    if (selectedSkills.length === 0) {
      setError('Pilih minimal 1 keahlian teknis yang dibutuhkan.')
      return
    }

    const effectiveTechStack = techStack.length > 0
      ? techStack
      : techStackInput.trim()
      ? [techStackInput.trim()]
      : selectedSkills.map((s) => s.name)

    const payload: CreateJobInput = {
      title,
      description,
      location,
      techStack: effectiveTechStack,
      applicationDeadline,
      skillIds: selectedSkills.map((s) => s.id),
      studyCase: {
        title: studyCaseTitle,
        problemDescription: studyCaseProblem,
        instructions: studyCaseInstructions,
        requiredSkills: selectedSkills.map((s) => s.name),
        deadline: studyCaseDeadline || applicationDeadline,
      },
    }

    startTransition(async () => {
      const result = await createJob(payload)

      if (result.success) {
        router.push('/company/jobs?created=true')
      } else {
        setError(result.error || 'Gagal mempublikasikan lowongan.')
        if (result.field) {
          setFieldErrors({ [result.field]: result.error || 'Input tidak valid' })
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  // Pre-calculate minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDateStr = tomorrow.toISOString().split('T')[0]

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Top Header */}
      <div>
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Lowongan
        </Link>
        <PageHeader
          title="Buat Lowongan PKL & Study Case"
          description="Publikasikan posisi magang industri dan buat tantangan study case nyata untuk menyeleksi siswa SMK berbasis kompetensi."
        />
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-md bg-destructive-light/60 border border-destructive/30 text-destructive text-sm flex items-start gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Ada kesalahan pada data formulir:</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informasi Lowongan */}
        <section className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200/60">
                1
              </span>
              <h2 className="text-lg font-semibold text-foreground">Informasi Lowongan PKL</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-9">
              Rincian posisi, lokasi pelaksanaan, serta batas waktu pendaftaran bagi siswa SMK.
            </p>
          </div>

          <div className="space-y-5">
            <FormField
              label="Judul Posisi PKL"
              name="title"
              type="text"
              required
              value={title}
              onChange={setTitle}
              placeholder="Contoh: Junior Frontend Web Developer (React / Next.js)"
              error={fieldErrors.title}
              hint="Gunakan judul posisi yang jelas dan spesifik dengan bidang keahlian (RPL / TKJ / PPLG)."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Lokasi / Skema Kerja"
                name="location"
                type="text"
                required
                value={location}
                onChange={setLocation}
                placeholder="Contoh: Jakarta Selatan (Hybrid) atau Remote (Indonesia)"
                error={fieldErrors.location}
                hint="Sebutkan kota penempatan atau skema (On-site / Hybrid / Remote)."
              />

              <div className="w-full">
                <label htmlFor="applicationDeadline" className="block text-sm font-medium mb-1 text-foreground">
                  Batas Akhir Pendaftaran <span className="text-destructive ml-1">*</span>
                </label>
                <input
                  id="applicationDeadline"
                  type="date"
                  required
                  min={minDateStr}
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input rounded-sm bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {fieldErrors.applicationDeadline ? (
                  <p className="mt-1 text-xs text-destructive">{fieldErrors.applicationDeadline}</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Tanggal penutupan pendaftaran lowongan.</p>
                )}
              </div>
            </div>

            <FormField
              label="Deskripsi Posisi & Tanggung Jawab"
              name="description"
              as="textarea"
              required
              maxLength={5000}
              value={description}
              onChange={setDescription}
              placeholder="Jelaskan ruang lingkup pekerjaan, apa yang akan dikerjakan siswa, lingkungan kerja tim, dan kriteria kualifikasi yang diharapkan..."
              error={fieldErrors.description}
              hint="Minimal 20 karakter. Deskripsi yang jelas mempermudah siswa memahami ekspektasi kerja."
            />

            {/* Tech Stack Input */}
            <div className="w-full">
              <label htmlFor="tech-stack-input" className="block text-sm font-medium mb-1 text-foreground">
                Tech Stack / Alat Utama
              </label>
              <div className="flex gap-2">
                <input
                  id="tech-stack-input"
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  onKeyDown={handleKeyDownTech}
                  placeholder="Ketik teknologi lalu tekan Enter (misal: Next.js, PostgreSQL, Figma)"
                  className="flex-1 h-10 px-3 py-2 border border-input rounded-sm bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="button" variant="outline" onClick={handleAddTech}>
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Teknologi spesifik yang digunakan sehari-hari di tim Anda.
              </p>

              {/* Tech Stack Tags Display */}
              {techStack.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-base-100 text-base-800 border border-base-200"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                        aria-label={`Hapus ${tech}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Kebutuhan Keahlian */}
        <section className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200/60">
                2
              </span>
              <h2 className="text-lg font-semibold text-foreground">Kebutuhan Keahlian (Matching Engine)</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-9">
              Keahlian teknis yang akan dicocokkan langsung dengan profil keahlian siswa SMK secara transparan.
            </p>
          </div>

          <div className="space-y-4">
            <SkillPicker
              availableSkills={availableSkills}
              selectedSkills={selectedSkills}
              onAddSkill={handleAddSkill}
              label="Pilih Keahlian yang Diperlukan"
            />

            {fieldErrors.skillIds && (
              <p className="text-xs text-destructive">{fieldErrors.skillIds}</p>
            )}

            {/* Selected Skills Chips */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Keahlian Terpilih ({selectedSkills.length})
              </p>
              {selectedSkills.length === 0 ? (
                <div className="p-4 rounded-md border border-dashed border-border bg-base-50/50 text-center text-xs text-muted-foreground">
                  Belum ada keahlian yang dipilih. Cari dan tambahkan minimal 1 keahlian di atas.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <SkillChip
                      key={skill.id}
                      skill={skill}
                      removable
                      onRemove={() => handleRemoveSkill(skill.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Study Case (Core Differentiator) */}
        <section className="bg-card border-l-4 border-l-brand-600 border-y border-r border-border rounded-r-lg rounded-l-xs p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-border pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  3
                </span>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Tantangan Industri (Study Case)
                </h2>
              </div>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                Fitur Inti YukMagang
              </span>
            </div>

            {/* Distinctive Educational Callout */}
            <div className="mt-3 p-3.5 rounded-md bg-brand-50/60 border border-brand-200/70 text-brand-950 text-xs sm:text-sm leading-relaxed">
              <p className="font-semibold text-brand-900 mb-0.5">
                Ini adalah tantangan nyata yang akan menjadi bagian dari proses seleksi.
              </p>
              <p className="text-xs text-brand-800/90">
                Siswa SMK yang melamar akan mengerjakan study case ini. Hasil pengerjaan yang Anda beri penilaian akan otomatis menjadi bukti portofolio nyata bagi siswa—bahkan jika belum diterima.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <FormField
              label="Judul Study Case"
              name="studyCaseTitle"
              type="text"
              required
              value={studyCaseTitle}
              onChange={setStudyCaseTitle}
              placeholder="Contoh: Buat RESTful API CRUD Manajemen Stok Barang Sederhana"
              error={fieldErrors['studyCase.title']}
              hint="Judul proyek atau studi kasus yang aplikatif dan sesuai tingkat siswa SMK."
            />

            <FormField
              label="Deskripsi Masalah (Problem Description)"
              name="studyCaseProblem"
              as="textarea"
              required
              maxLength={5000}
              value={studyCaseProblem}
              onChange={setStudyCaseProblem}
              placeholder="Ceritakan latar belakang masalah yang perlu diselesaikan. Contoh: Toko kelontong membutuhkan pencatatan barang masuk dan keluar dengan validasi stok..."
              error={fieldErrors['studyCase.problemDescription']}
              hint="Jelaskan kebutuhan fungsional dan konteks bisnis dari kasus nyata ini."
            />

            <FormField
              label="Instruksi Pengerjaan (Instructions)"
              name="studyCaseInstructions"
              as="textarea"
              required
              maxLength={5000}
              value={studyCaseInstructions}
              onChange={setStudyCaseInstructions}
              placeholder="Tuliskan panduan langkah demi langkah:&#10;1. Gunakan framework yang ditentukan&#10;2. Sertakan file README dengan panduan instalasi&#10;3. Unggah kode ke repositori GitHub publik&#10;4. (Opsional) Lampirkan URL deployment live"
              error={fieldErrors['studyCase.instructions']}
              hint="Berikan instruksi yang jelas mengenai format submission (GitHub repo / deployed URL)."
            />

            <div className="w-full sm:w-1/2">
              <label htmlFor="studyCaseDeadline" className="block text-sm font-medium mb-1 text-foreground">
                Batas Waktu Pengumpulan Study Case <span className="text-destructive ml-1">*</span>
              </label>
              <input
                id="studyCaseDeadline"
                type="date"
                required
                min={minDateStr}
                max={applicationDeadline || undefined}
                value={studyCaseDeadline}
                onChange={(e) => setStudyCaseDeadline(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-sm bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {fieldErrors['studyCase.deadline'] ? (
                <p className="mt-1 text-xs text-destructive">{fieldErrors['studyCase.deadline']}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Harus sebelum atau bersamaan dengan batas akhir lowongan.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <Link
            href="/company/jobs"
            className="w-full sm:w-auto text-center px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-md transition-colors"
          >
            Batal
          </Link>

          <Button
            type="submit"
            size="lg"
            loading={isPending}
            disabled={isPending}
            className="w-full sm:w-auto px-8"
          >
            {isPending ? 'Mempublikasikan Lowongan...' : 'Publikasikan Lowongan & Study Case'}
          </Button>
        </div>
      </form>
    </div>
  )
}
