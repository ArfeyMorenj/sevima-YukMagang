import {
  Building2,
  Calendar,
  GitBranch,
  Globe,
  Award,
  CheckCircle2,
  FileCode,
  MessageSquare,
} from 'lucide-react'

export interface PortfolioCardProps {
  id: string
  studyCaseTitle: string
  companyName: string
  technologies: string[]
  repoUrl: string
  deployedUrl?: string | null
  score: number
  feedback: string
  result: 'ACCEPTED' | 'REJECTED' | string
  createdAt: string
}

export function PortfolioCard({
  studyCaseTitle,
  companyName,
  technologies,
  repoUrl,
  deployedUrl,
  score,
  feedback,
  result,
  createdAt,
}: PortfolioCardProps) {
  const isAccepted = result === 'ACCEPTED'
  const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="bg-card border border-border rounded-lg p-6 sm:p-7 shadow-xs hover:border-brand-300 transition-all space-y-5">
      {/* Header: Company & Outcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              <Building2 className="w-3.5 h-3.5" />
              {companyName}
            </span>
            <span className="text-tiny text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Dinilai: {formattedDate}
            </span>
          </div>

          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pt-1">
            <FileCode className="w-5 h-5 text-brand-600 shrink-0" />
            <span>{studyCaseTitle}</span>
          </h2>
        </div>

        {/* Status Badge: Both Accepted and Rejected are recognized as verified evidence */}
        <div className="shrink-0 self-start sm:self-auto">
          {isAccepted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-300 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              Diterima Magang PKL
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Tantangan Teruji • Review Lengkap
            </span>
          )}
        </div>
      </div>

      {/* Score & Technologies Quick Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Score Box */}
        <div className="p-3.5 rounded-lg bg-base-50 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-tiny text-muted-foreground font-medium">Skor Industri</p>
            <p className="text-lg font-extrabold text-foreground">
              {score}
              <span className="text-xs font-normal text-muted-foreground"> / 100</span>
            </p>
          </div>
        </div>

        {/* Technologies Used */}
        <div className="sm:col-span-3 p-3.5 rounded-lg bg-base-50 border border-border space-y-1.5">
          <p className="text-tiny text-muted-foreground font-medium">Teknologi yang Diterapkan:</p>
          <div className="flex flex-wrap gap-1.5">
            {technologies.length > 0 ? (
              technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-card text-foreground text-xs font-mono border border-border"
                >
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Teknologi Umum Magang</span>
            )}
          </div>
        </div>
      </div>

      {/* Project Evidence Links */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50/60 hover:bg-brand-50 px-3.5 py-2 rounded-md border border-brand-200 transition-colors"
        >
          <GitBranch className="w-4 h-4 shrink-0" />
          <span>Lihat Repositori Solusi</span>
        </a>

        {deployedUrl && (
          <a
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 hover:text-cyan-800 bg-cyan-50/60 hover:bg-cyan-50 px-3.5 py-2 rounded-md border border-cyan-200 transition-colors"
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Lihat Live Demo</span>
          </a>
        )}
      </div>

      {/* Verified Company Feedback */}
      <div className="p-4 rounded-lg bg-base-50/80 border border-border space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <MessageSquare className="w-4 h-4 text-brand-600" />
          <span>Ulasan & Evaluasi Tim Teknis {companyName}:</span>
        </div>
        <p className="text-xs sm:text-sm text-base-700 leading-relaxed italic pl-6 border-l-2 border-brand-500/40 whitespace-pre-line">
          &ldquo;{feedback}&rdquo;
        </p>
      </div>
    </article>
  )
}
