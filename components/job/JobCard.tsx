import Link from 'next/link'
import { MapPin, Calendar, CheckCircle2, FileCode, ArrowRight } from 'lucide-react'

export interface JobCardProps {
  id: string
  title: string
  location: string
  applicationDeadline: string | Date
  company: {
    name: string
    verified: boolean
  }
  skills: Array<{
    id: string
    name: string
  }>
  techStack: string[]
  studyCase?: {
    title: string
    deadline: string | Date
  } | null
  studentSkillIds?: string[]
}

export function JobCard({
  id,
  title,
  location,
  applicationDeadline,
  company,
  skills,
  techStack,
  studyCase,
  studentSkillIds = [],
}: JobCardProps) {
  const deadlineDate = new Date(applicationDeadline)
  const isExpired = deadlineDate < new Date()
  const formattedDeadline = deadlineDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Calculate real skill match overlap (NO fake percentage)
  const studentSkillSet = new Set(studentSkillIds)
  const matchedSkillsCount = skills.filter((s) => studentSkillSet.has(s.id)).length
  const totalSkillsCount = skills.length

  return (
    <article className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs hover:border-brand-300 hover:shadow-sm transition-all flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header: Company & Title */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs font-semibold text-brand-700 tracking-wide uppercase">
              {company.name}
            </span>
            {company.verified && (
              <span className="inline-flex items-center gap-1 text-tiny text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                <CheckCircle2 className="w-3 h-3" />
                Terverifikasi
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            <Link
              href={`/student/jobs/${id}`}
              className="hover:text-brand-600 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
            >
              {title}
            </Link>
          </h2>
        </div>

        {/* Metadata: Location & Deadline */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-base-500" aria-hidden="true" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-base-500" aria-hidden="true" />
            <span className={isExpired ? 'text-destructive font-medium' : ''}>
              Batas: {formattedDeadline} {isExpired && '(Ditutup)'}
            </span>
          </div>
        </div>

        {/* Study Case Differentiator Callout */}
        {studyCase ? (
          <div className="p-3 rounded-md bg-brand-50/50 border border-brand-200/80 flex items-start gap-2.5">
            <FileCode className="w-4 h-4 text-brand-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-tiny font-bold uppercase tracking-wider text-brand-800">
                Study Case Industri
              </p>
              <p className="text-xs font-medium text-brand-950 truncate mt-0.5">
                {studyCase.title}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-md bg-base-100 text-xs text-muted-foreground">
            Tidak ada tantangan study case khusus
          </div>
        )}

        {/* Skills & Tech Stack with Real Match Indication */}
        <div className="space-y-2">
          {totalSkillsCount > 0 && (
            <div>
              <div className="flex items-center justify-between text-caption text-muted-foreground mb-1.5">
                <span>Keahlian yang Dibutuhkan:</span>
                {studentSkillIds.length > 0 && (
                  <span className="font-semibold text-brand-700">
                    {matchedSkillsCount}/{totalSkillsCount} skill kamu cocok
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5" role="list" aria-label="Keahlian yang dibutuhkan">
                {skills.map((skill) => {
                  const isMatched = studentSkillSet.has(skill.id)
                  return (
                    <span
                      key={skill.id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-tiny font-medium border ${
                        isMatched
                          ? 'bg-brand-50 text-brand-800 border-brand-200'
                          : 'bg-base-100 text-base-700 border-base-200'
                      }`}
                    >
                      {skill.name}
                      {isMatched && <span className="ml-1 text-brand-600 font-bold">✓</span>}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {techStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-tiny text-muted-foreground">Tech:</span>
              {techStack.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-xs bg-base-100 text-base-600 text-tiny font-mono"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="text-tiny text-muted-foreground">+{techStack.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
        <Link
          href={`/student/jobs/${id}`}
          className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          Lihat Detail & Kerjakan Case
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
