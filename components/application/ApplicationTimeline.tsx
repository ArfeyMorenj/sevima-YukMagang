import { CheckCircle2, Clock, FileCode, Award } from 'lucide-react'

interface ApplicationTimelineProps {
  hasSubmitted: boolean
  hasReview: boolean
  status?: string
  decision?: 'ACCEPTED' | 'REJECTED' | null
}

export function ApplicationTimeline({
  hasSubmitted,
  hasReview,
  decision,
}: ApplicationTimelineProps) {
  const steps = [
    {
      title: '1. Lamaran Terdaftar',
      desc: 'Pengajuan lamaran berhasil dikirim.',
      status: 'completed',
      icon: CheckCircle2,
    },
    {
      title: '2. Pengumpulan Study Case',
      desc: hasSubmitted
        ? 'Repositori kode dan penjelasan telah dikumpulkan.'
        : 'Selesaikan tantangan dan kumpulkan solusi kamu.',
      status: hasSubmitted ? 'completed' : 'current',
      icon: FileCode,
    },
    {
      title: '3. Penilaian Perusahaan',
      desc: hasReview
        ? 'Solusi telah ditinjau dan dinilai oleh tim teknis.'
        : hasSubmitted
        ? 'Tim teknis perusahaan sedang meninjau karyamu.'
        : 'Menunggu pengumpulan solusi study case.',
      status: hasReview ? 'completed' : hasSubmitted ? 'current' : 'upcoming',
      icon: Clock,
    },
    {
      title: '4. Keputusan Seleksi',
      desc:
        decision === 'ACCEPTED'
          ? 'Selamat! Kamu dinyatakan Diterima PKL.'
          : decision === 'REJECTED'
          ? 'Proses selesai. Karyamu tersimpan di portofolio.'
          : 'Hasil akhir seleksi magang.',
      status: hasReview ? 'completed' : 'upcoming',
      icon: Award,
    },
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
        Alur Progres Lamaran
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed'
          const isCurrent = step.status === 'current'

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border transition-colors flex flex-col justify-between ${
                isCompleted
                  ? 'bg-brand-50/60 border-brand-200 text-brand-950'
                  : isCurrent
                  ? 'bg-amber-50/60 border-amber-300 text-amber-950 ring-1 ring-amber-300'
                  : 'bg-base-50/50 border-border text-muted-foreground'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{step.title}</span>
                  <step.icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isCompleted
                        ? 'text-brand-700'
                        : isCurrent
                        ? 'text-amber-700'
                        : 'text-base-400'
                    }`}
                  />
                </div>
                <p className="text-tiny leading-relaxed opacity-90">{step.desc}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-black/5 text-tiny font-semibold">
                {isCompleted && <span className="text-brand-800">Selesai</span>}
                {isCurrent && <span className="text-amber-800">Langkah Saat Ini</span>}
                {!isCompleted && !isCurrent && <span>Menunggu</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
