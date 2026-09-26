import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStudentProfile } from '@/lib/proxy'
import { prisma } from '@/lib/prisma'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { ApplyButton } from '@/components/job/ApplyButton'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  FileCode,
  Globe,
  Briefcase,
  AlertTriangle,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface JobDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentJobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const session = await getStudentProfile()
  const student = session.studentProfile

  const studentSkillIds = student.skills.map((s) => s.skill.id)
  const studentSkillSet = new Set(studentSkillIds)

  // Fetch job details
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          website: true,
          verified: true,
        },
      },
      skills: {
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
      },
      studyCase: true,
    },
  })

  if (!job) {
    notFound()
  }

  // Check if student has already applied
  const existingApplication = await prisma.application.findUnique({
    where: {
      studentId_jobId: {
        studentId: student.id,
        jobId: job.id,
      },
    },
    select: {
      id: true,
      status: true,
    },
  })

  const isExpired = new Date(job.applicationDeadline) < new Date()
  const formattedAppDeadline = new Date(job.applicationDeadline).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedStudyCaseDeadline = job.studyCase
    ? new Date(job.studyCase.deadline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const matchedSkillsCount = job.skills.filter((s) => studentSkillSet.has(s.skill.id)).length
  const totalSkillsCount = job.skills.length

  return (
    <StudentLayout
      user={{
        name: student.name,
        email: session.email,
        major: student.major,
      }}
    >
      <div className="space-y-8 max-w-4xl">
        {/* Back Link */}
        <div>
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Lowongan
          </Link>
        </div>

        {/* Job Identity Card */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                <Building2 className="w-3.5 h-3.5" />
                {job.company.name}
              </span>
              {job.company.verified && (
                <span className="inline-flex items-center gap-1 text-tiny text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Perusahaan Terverifikasi
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {job.title}
            </h1>
          </div>

          {/* Quick Metadata */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground pt-1 border-t border-border">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-base-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-base-500" />
              <span className={isExpired ? 'text-destructive font-medium' : ''}>
                Batas Lamaran: {formattedAppDeadline} {isExpired && '(Telah Berakhir)'}
              </span>
            </div>
            {job.company.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-base-500" />
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  Situs Web Perusahaan
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <section aria-labelledby="desc-heading" className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-3">
          <h2 id="desc-heading" className="text-lg font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            Deskripsi Lowongan PKL
          </h2>
          <div className="text-sm text-base-700 leading-relaxed whitespace-pre-line pt-1">
            {job.description}
          </div>
        </section>

        {/* Required Skills & Tech Stack */}
        <section aria-labelledby="skills-heading" className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 id="skills-heading" className="text-lg font-bold text-foreground">
              Persyaratan Keahlian & Teknologi
            </h2>
            {totalSkillsCount > 0 && studentSkillIds.length > 0 && (
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200 self-start sm:self-auto">
                {matchedSkillsCount} dari {totalSkillsCount} keahlian cocok dengan profilmu
              </span>
            )}
          </div>

          {/* Technical Skills */}
          {job.skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-caption text-muted-foreground">Keahlian yang Dibutuhkan:</p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Daftar keahlian yang dibutuhkan">
                {job.skills.map((s) => {
                  const isMatched = studentSkillSet.has(s.skill.id)
                  return (
                    <span
                      key={s.skill.id}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        isMatched
                          ? 'bg-brand-50 text-brand-800 border-brand-200'
                          : 'bg-base-100 text-base-700 border-base-200'
                      }`}
                    >
                      {s.skill.name}
                      {isMatched && <span className="ml-1.5 text-brand-600 font-bold">? Dikuasai</span>}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {job.techStack.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-caption text-muted-foreground">Tech Stack & Tools:</p>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-base-100 text-base-700 text-xs font-mono border border-base-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Study Case Section — CORE DIFFERENTIATOR */}
        <section
          aria-labelledby="case-heading"
          className="bg-card border-l-4 border-l-brand-600 border border-border rounded-lg p-6 sm:p-8 shadow-xs space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-tiny font-bold uppercase tracking-wider text-brand-700">
                  Tantangan Industri
                </span>
                <h2 id="case-heading" className="text-xl font-bold text-foreground">
                  {job.studyCase ? job.studyCase.title : 'Study Case Magang'}
                </h2>
              </div>
            </div>

            {formattedStudyCaseDeadline && (
              <span className="text-xs text-muted-foreground bg-base-100 px-3 py-1 rounded-md self-start sm:self-auto">
                Batas Pengerjaan: <strong className="text-foreground">{formattedStudyCaseDeadline}</strong>
              </span>
            )}
          </div>

          {job.studyCase ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Deskripsi Masalah / Studi Kasus:
                </h3>
                <p className="text-sm text-base-700 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                  {job.studyCase.problemDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Instruksi & Kriteria Pengerjaan:
                </h3>
                <div className="text-sm text-base-700 leading-relaxed whitespace-pre-line bg-base-50 p-4 rounded-md border border-border">
                  {job.studyCase.instructions}
                </div>
              </div>

              {job.studyCase.requiredSkills.length > 0 && (
                <div>
                  <h3 className="text-caption text-muted-foreground mb-1.5">
                    Keahlian Utama yang Dinilai dalam Study Case:
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.studyCase.requiredSkills.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-md bg-cyan-50/60 border border-cyan-200/80 text-xs text-cyan-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-700 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  Setelah melamar, kamu akan mengunggah tautan repositori kode dan penjelasan solusi di workspace lamaran. Hasil karyamu akan dinilai langsung oleh tim teknis {job.company.name}.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-md bg-amber-50 text-xs text-amber-800 border border-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Detail study case akan diberikan setelah kamu resmi mendaftar ke posisi ini.</span>
            </div>
          )}
        </section>

        {/* Primary Apply Action */}
        <section aria-label="Aksi Lamaran">
          <ApplyButton
            jobId={job.id}
            isExpired={isExpired}
            existingApplicationId={existingApplication?.id}
          />
        </section>
      </div>
    </StudentLayout>
  )
}
