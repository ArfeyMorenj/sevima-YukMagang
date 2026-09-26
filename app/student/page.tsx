import { getStudentProfile } from '@/lib/proxy'
import { StudentLayout } from '@/components/layout/StudentLayout'
import Link from 'next/link'
import { Briefcase, FolderOpen, Award, ArrowRight, UserCheck, Plus, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function StudentDashboard() {
  const session = await getStudentProfile()
  const profile = session.studentProfile
  const skills = profile.skills.map((s) => s.skill)
  const hasBio = Boolean(profile.bio && profile.bio.trim().length > 0)
  const skillsCount = skills.length

  // Calculate actual completeness criteria
  const isProfileComplete = hasBio && skillsCount >= 3

  return (
    <StudentLayout
      user={{
        name: profile.name,
        email: session.email,
        major: profile.major,
      }}
    >
      <div className="space-y-8 max-w-5xl">
        {/* Welcome & Context Banner */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  Siswa SMK • {profile.major}
                </span>
                <span className="text-xs text-muted-foreground">Akun Aktif</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Selamat Datang, {profile.name}!
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-base-600 leading-relaxed max-w-2xl">
                Temukan lowongan PKL yang cocok dengan keahlianmu, kerjakan tantangan study case industri, dan bangun portofolio yang diakui perusahaan.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/student/profile"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-base-100 text-foreground transition-colors"
              >
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                Edit Profil
              </Link>
            </div>
          </div>
        </div>

        {/* Action Callout (What to do next) */}
        {!isProfileComplete ? (
          <div className="p-5 rounded-lg bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-amber-950">Langkah Berikutnya: Lengkapi Keahlian Kamu</h2>
                <p className="text-xs text-amber-800 mt-0.5 leading-normal">
                  {skillsCount === 0
                    ? 'Kamu belum menambahkan skill teknis. Tambahkan minimal 3 skill untuk memaksimalkan kecocokan lowongan PKL.'
                    : `Saat ini kamu memiliki ${skillsCount} skill terdaftar. Lengkapi bio dan skill lainnya agar profilmu siap dicocokkan.`}
                </p>
              </div>
            </div>
            <Link
              href="/student/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-colors flex-shrink-0 shadow-xs"
            >
              Lengkapi Keahlian
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-brand-50/60 border border-brand-200/80 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-950">Profil dan Keahlian Kamu Siap</p>
                <p className="text-xs text-brand-700">{skillsCount} keahlian terdata untuk pencocokan lowongan PKL.</p>
              </div>
            </div>
            <Link
              href="/student/jobs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors flex-shrink-0 shadow-xs"
            >
              Jelajahi Lowongan
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 3 Core Product Pathways */}
        <section aria-labelledby="pathways-heading">
          <h2 id="pathways-heading" className="text-lg font-bold text-foreground mb-4">
            Alur Program PKL Kamu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pathway 1: Jobs */}
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-xs hover:border-brand-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-md bg-brand-50 text-brand-700 border border-brand-200/60 flex items-center justify-center mb-3">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground">1. Lowongan PKL</h3>
                <p className="text-xs text-base-600 mt-1.5 leading-relaxed">
                  Telusuri posisi PKL aktif dari perusahaan mitra. Sistem mencocokkan secara transparan berdasarkan skill dan jurusanmu.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-base-100">
                <Link
                  href="/student/jobs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
                >
                  Telusuri Lowongan PKL
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pathway 2: Applications & Study Case */}
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-xs hover:border-brand-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200/60 flex items-center justify-center mb-3">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground">2. Lamaran & Study Case</h3>
                <p className="text-xs text-base-600 mt-1.5 leading-relaxed">
                  Kerjakan studi kasus nyata dari industri. Kumpulkan tautan repositori kode dan jelaskan solusi yang kamu kembangkan.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-base-100">
                <Link
                  href="/student/applications"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-800 transition-colors"
                >
                  Cek Status Lamaran
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pathway 3: Portfolio */}
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-xs hover:border-brand-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center mb-3">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-foreground">3. Portfolio Terverifikasi</h3>
                <p className="text-xs text-base-600 mt-1.5 leading-relaxed">
                  Setiap penyelesaian studi kasus dinilai oleh praktisi perusahaan dan otomatis menjadi portofolio teruji milikmu.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-base-100">
                <Link
                  href="/student/portfolio"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  Buka Portofolio
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Current Skills Summary */}
        <section aria-labelledby="skills-summary-heading" className="bg-card border border-border rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="skills-summary-heading" className="text-base font-semibold text-foreground">
                Keahlian Kamu Saat Ini
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keahlian ini digunakan oleh mesin pencocokan untuk menemukan PKL yang sesuai.
              </p>
            </div>
            <Link
              href="/student/profile"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
            >
              <Plus className="w-3.5 h-3.5" />
              Kelola Keahlian
            </Link>
          </div>

          {skills.length === 0 ? (
            <div className="p-6 text-center rounded-md border border-dashed border-base-300 bg-base-50/50">
              <p className="text-sm text-base-600 font-medium">Belum ada keahlian yang ditambahkan</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Tambahkan bahasa pemrograman, framework, atau tools yang kamu kuasai dari sekolah maupun proyek mandiri.
              </p>
              <div className="mt-4">
                <Link
                  href="/student/profile"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Keahlian Sekarang
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1" role="list" aria-label="Daftar keahlian siswa">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-brand-50 text-brand-800 border border-brand-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </StudentLayout>
  )
}