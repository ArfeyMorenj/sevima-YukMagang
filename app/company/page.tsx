import { getCompanyProfile } from '@/lib/proxy'
import { CompanyLayout } from '@/components/layout/CompanyLayout'
import Link from 'next/link'
import { Building2, Briefcase, Plus, Settings, CheckCircle2, ShieldAlert } from 'lucide-react'

export default async function CompanyDashboard() {
  const session = await getCompanyProfile()
  const company = session.company

  return (
    <CompanyLayout
      user={{
        name: company.name,
        email: session.email,
        companyName: company.name,
        verified: company.verified,
      }}
    >
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-base-100 text-base-800 border border-base-200">
                  Dashboard Perusahaan Mitra
                </span>
                {company.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-success font-medium bg-success-light px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="w-3 h-3" />
                    Belum Verifikasi
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Selamat Datang, {company.name}!
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-base-600 leading-relaxed max-w-2xl">
                Kelola lowongan PKL untuk siswa SMK, berikan tantangan study case industri, dan temukan kandidat potensial berbasis keahlian nyata.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/company/profile"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-base-100 text-foreground transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                Profil Perusahaan
              </Link>
            </div>
          </div>
        </div>

        {/* Company Overview Card */}
        <section aria-labelledby="company-profile-heading" className="bg-card border border-border rounded-lg p-6 shadow-xs">
          <h2 id="company-profile-heading" className="text-base font-semibold text-foreground mb-4">
            Ringkasan Akun Perusahaan
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
            <div className="p-4 rounded-md bg-base-50/60 border border-base-200/60">
              <dt className="text-caption text-muted-foreground">Nama Perusahaan</dt>
              <dd className="font-semibold text-foreground mt-1 text-base">{company.name}</dd>
            </div>
            <div className="p-4 rounded-md bg-base-50/60 border border-base-200/60">
              <dt className="text-caption text-muted-foreground">Email Kontak</dt>
              <dd className="font-semibold text-foreground mt-1 text-base truncate">{session.email}</dd>
            </div>
            <div className="p-4 rounded-md bg-base-50/60 border border-base-200/60">
              <dt className="text-caption text-muted-foreground">Status Kemitraan</dt>
              <dd className="font-semibold mt-1 text-base flex items-center gap-1.5">
                {company.verified ? (
                  <span className="text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="text-muted-foreground font-normal">Mitra Terdaftar</span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Quick Actions */}
        <section aria-labelledby="company-actions-heading">
          <h2 id="company-actions-heading" className="text-base font-semibold text-foreground mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/company/jobs/create"
              className="p-5 rounded-lg border border-brand-200 bg-brand-50/50 hover:bg-brand-50 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-md bg-brand-600 text-white flex items-center justify-center mb-3 shadow-xs">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Buat Lowongan PKL Baru</h3>
                <p className="text-xs text-base-600 mt-1">
                  Publikasikan posisi PKL dan rancang tantangan study case industri.
                </p>
              </div>
              <span className="text-xs font-semibold text-brand-700 mt-4 block">Mulai Buat Lowongan →</span>
            </Link>

            <Link
              href="/company/jobs"
              className="p-5 rounded-lg border border-border bg-card hover:bg-base-50/50 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-md bg-base-100 text-base-700 flex items-center justify-center mb-3">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Kelola Lowongan</h3>
                <p className="text-xs text-base-600 mt-1">
                  Lihat lowongan yang aktif dan evaluasi pelamar yang telah masuk.
                </p>
              </div>
              <span className="text-xs font-semibold text-foreground mt-4 block">Buka Daftar Lowongan →</span>
            </Link>

            <Link
              href="/company/profile"
              className="p-5 rounded-lg border border-border bg-card hover:bg-base-50/50 transition-colors shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-md bg-base-100 text-base-700 flex items-center justify-center mb-3">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Profil Perusahaan</h3>
                <p className="text-xs text-base-600 mt-1">
                  Lengkapi informasi profil, website, lokasi, dan deskripsi perusahaan.
                </p>
              </div>
              <span className="text-xs font-semibold text-foreground mt-4 block">Pengaturan Profil →</span>
            </Link>
          </div>
        </section>
      </div>
    </CompanyLayout>
  )
}