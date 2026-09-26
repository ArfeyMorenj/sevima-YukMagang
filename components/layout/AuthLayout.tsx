'use client'

import { ReactNode } from 'react'
import { Target, FileCheck, Award } from 'lucide-react'

interface AuthLayoutProps {
  formTitle: string
  formSubtitle?: string
  formAction: ReactNode
  footerLinks?: ReactNode
}

const productBenefits = [
  {
    icon: Target,
    title: 'Skill-based matching',
    desc: 'Pencocokan lowongan PKL berbasis keahlian nyata dan jurusan SMK kamu (RPL, TKJ, PPLG).',
  },
  {
    icon: FileCheck,
    title: 'Real company study case',
    desc: 'Buktikan kemampuan teknis lewat tantangan nyata yang dirancang langsung oleh perusahaan mitra.',
  },
  {
    icon: Award,
    title: 'Portfolio with company feedback',
    desc: 'Bangun portofolio terverifikasi lengkap dengan skor dan ulasan objektif dari industri.',
  },
]

export function AuthLayout({
  formTitle,
  formSubtitle,
  formAction,
  footerLinks,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-12">
      {/* Left Brand Column — Desktop */}
      <div className="hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between p-12 xl:p-16 bg-brand-50 border-r border-brand-100">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            YM
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">YukMagang</span>
        </div>

        {/* Core Value Proposition */}
        <div className="my-auto max-w-xl space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100/80 text-brand-800 border border-brand-200 mb-4">
              Platform PKL Siswa SMK & Perusahaan
            </span>
            <h1 className="text-h1 font-bold text-foreground tracking-tight text-3xl xl:text-4xl leading-tight">
              Cari PKL. Buktikan Skill. Bangun Portfolio.
            </h1>
            <p className="mt-3 text-body-lg text-base-600 leading-relaxed">
              Jembatan nyata antara siswa SMK dengan industri. Temukan tempat magang yang tepat, selesaikan study case nyata, dan jadikan hasil karyamu bukti kompetensi yang diakui industri.
            </p>
          </div>

          {/* 3 Real Product Benefits */}
          <div className="space-y-4">
            {productBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3.5 p-3.5 rounded-lg bg-white/70 border border-brand-100 shadow-2xs">
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center mt-0.5">
                  <benefit.icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{benefit.title}</h2>
                  <p className="text-xs text-base-600 mt-0.5 leading-normal">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Restrained Real-Product Visual Preview */}
          <div className="p-4 rounded-lg bg-white border border-base-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-base-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                <span className="text-xs font-semibold text-foreground">Contoh Alur Seleksi Transparan</span>
              </div>
              <span className="text-2xs font-medium px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                Rule-based Match
              </span>
            </div>
            <div className="pt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded bg-base-50 border border-base-100">
                <p className="font-semibold text-foreground">1. Profil & Skill</p>
                <p className="text-2xs text-muted-foreground mt-0.5">Keahlian terdata</p>
              </div>
              <div className="p-2.5 rounded bg-brand-50/60 border border-brand-100">
                <p className="font-semibold text-brand-900">2. Study Case</p>
                <p className="text-2xs text-brand-700 mt-0.5">Tantangan teknis</p>
              </div>
              <div className="p-2.5 rounded bg-base-50 border border-base-100">
                <p className="font-semibold text-foreground">3. Portfolio</p>
                <p className="text-2xs text-muted-foreground mt-0.5">Skor & feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-base-500">
          <p>© {new Date().getFullYear()} YukMagang. Membantu vokasi Indonesia lebih berdaya saing.</p>
        </div>
      </div>

      {/* Right Form Column — Auth Form */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 py-12 sm:px-12 xl:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                YM
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">YukMagang</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Cari PKL. Buktikan Skill. Bangun Portfolio.
            </p>
          </div>

          {/* Form Header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{formTitle}</h1>
            {formSubtitle && (
              <p className="mt-1.5 text-sm text-muted-foreground">{formSubtitle}</p>
            )}
          </header>

          {/* Form Content */}
          <div className="space-y-4">
            {formAction}
          </div>

          {/* Footer Links */}
          {footerLinks && (
            <footer className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              {footerLinks}
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}