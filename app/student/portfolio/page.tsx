import Link from 'next/link'
import { getStudentProfile } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { PortfolioCard, PortfolioCardProps } from '@/components/portfolio/PortfolioCard'
import { Award, Briefcase, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function StudentPortfolioPage() {
  const session = await getStudentProfile()
  const student = session.studentProfile

  // Query real portfolio items belonging ONLY to this student
  const rawPortfolioItems = await prisma.portfolioItem.findMany({
    where: {
      studentId: student.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const portfolioItems: PortfolioCardProps[] = rawPortfolioItems.map((item) => ({
    id: item.id,
    studyCaseTitle: item.studyCaseTitle,
    companyName: item.companyName,
    technologies: item.technologies,
    repoUrl: item.repoUrl,
    deployedUrl: item.deployedUrl,
    score: item.score,
    feedback: item.feedback,
    result: item.result,
    createdAt: item.createdAt.toISOString(),
  }))

  const acceptedCount = portfolioItems.filter((i) => i.result === 'ACCEPTED').length

  return (
    <StudentLayout
      user={{
        name: student.name,
        email: session.email,
        major: student.major,
      }}
    >
      <div className="space-y-7 max-w-5xl">
        {/* Page Header */}
        <div className="border-b border-border pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Bukti Pengalaman & Keterampilan Riil
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Portofolio Terverifikasi Industri
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-base-600 max-w-2xl leading-relaxed">
                Kumpulan bukti karya nyata yang kamu selesaikan dari penugasan study case industri, lengkap dengan evaluasi dan skor profesional praktisi perusahaan.
              </p>
            </div>

            {portfolioItems.length > 0 && (
              <div className="flex items-center gap-2 self-start sm:self-auto bg-base-50 p-2.5 rounded-lg border border-border">
                <div className="text-center px-2">
                  <p className="text-tiny text-muted-foreground font-medium">Total Portofolio</p>
                  <p className="text-base font-bold text-foreground">{portfolioItems.length}</p>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="text-center px-2">
                  <p className="text-tiny text-muted-foreground font-medium">Diterima PKL</p>
                  <p className="text-base font-bold text-brand-700">{acceptedCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Core Product Principle Callout */}
        <div className="p-4 sm:p-5 rounded-lg bg-brand-50/70 border border-brand-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-950">
                Setiap Solusi Menjadi Bukti Kompetensi Nyata
              </h2>
              <p className="text-xs text-brand-850 mt-0.5 leading-relaxed max-w-2xl">
                Di YukMagang, baik lamaranmu diterima maupun belum lolos, hasil pengerjaan study case yang telah diulas oleh praktisi industri tetap diakui sebagai portofolio teruji milikmu.
              </p>
            </div>
          </div>

          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            Cari Tantangan Baru
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Portfolio List or Empty State */}
        {portfolioItems.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-lg p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-base-100 text-base-500 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Belum Ada Portofolio Terverifikasi
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Portofolio kamu akan terbentuk secara otomatis setiap kali kamu menyelesaikan tantangan study case industri dan dinilai langsung oleh tim teknis perusahaan mitra.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/student/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Temukan Lowongan PKL & Mulai Case
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
