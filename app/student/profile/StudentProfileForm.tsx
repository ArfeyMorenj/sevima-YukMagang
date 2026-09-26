'use client'

import { useState, useEffect } from 'react'
import { useTransition } from 'react'
import { updateStudentProfile, addStudentSkill, removeStudentSkill } from '@/app/actions/student/profile'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/forms/FormField'
import { FormSection } from '@/components/forms/FormSection'
import { SkillPicker } from '@/components/forms/SkillPicker'
import { SkillChip } from '@/components/ui/SkillChip'
import { PageHeader } from '@/components/ui/PageHeader'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
}

interface StudentProfileData {
  userId: string
  email: string
  role: 'STUDENT'
  studentProfile: {
    id: string
    name: string
    major: string
    bio: string | null
    skills: { skillId: string; skill: Skill }[]
  }
}

interface StudentProfileFormProps {
  initialData: StudentProfileData
}

export default function StudentProfileForm({ initialData }: StudentProfileFormProps) {
  const [name, setName] = useState(initialData.studentProfile.name)
  const [major, setMajor] = useState(initialData.studentProfile.major)
  const [bio, setBio] = useState(initialData.studentProfile.bio || '')
  const [skills, setSkills] = useState(initialData.studentProfile.skills.map((s) => s.skill))
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, startTransition] = useTransition()
  const [isLoadingSkills, setIsLoadingSkills] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills')
        if (res.ok) {
          const data = await res.json()
          setAvailableSkills(data)
        }
      } catch (err) {
        console.error('Failed to fetch skills:', err)
      } finally {
        setIsLoadingSkills(false)
      }
    }
    fetchSkills()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('major', major)
      if (bio) formData.set('bio', bio)

      const result = await updateStudentProfile(formData)

      if (result.success) {
        setSuccess('Profil berhasil diperbarui.')
      } else {
        setError(result.error || 'Gagal memperbarui profil.')
      }
    })
  }

  const handleAddSkill = async (skillId: string) => {
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const result = await addStudentSkill(skillId)

      if (result.success) {
        const skill = availableSkills.find((s) => s.id === skillId)
        if (skill) {
          setSkills((prev) => [...prev, skill])
          setSuccess(`Keahlian ${skill.name} berhasil ditambahkan.`)
        }
      } else {
        setError(result.error || 'Gagal menambahkan keahlian.')
      }
    })
  }

  const handleRemoveSkill = async (skillId: string) => {
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const removedSkill = skills.find((s) => s.id === skillId)
      const result = await removeStudentSkill(skillId)

      if (result.success) {
        setSkills((prev) => prev.filter((s) => s.id !== skillId))
        setSuccess(`Keahlian ${removedSkill?.name || ''} dihapus.`)
      } else {
        setError(result.error || 'Gagal menghapus keahlian.')
      }
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil Siswa"
        description="Kelola informasi diri dan keahlianmu. Informasi ini menentukan akurasi pencocokan dengan lowongan PKL industri."
      />

      {error && (
        <div
          className="p-3.5 bg-destructive-light/60 border border-destructive/20 text-destructive text-sm rounded-md flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="p-3.5 bg-success-light/60 border border-success/20 text-success text-sm rounded-md flex items-start gap-2.5"
          role="alert"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-8">
        {/* Section 1: Informasi Dasar */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-7 shadow-xs">
          <FormSection
            title="Informasi Dasar"
            description="Informasi ini akan ditampilkan kepada perusahaan saat kamu melamar posisi PKL."
          >
            <div className="space-y-4">
              <FormField
                label="Nama Lengkap"
                name="name"
                type="text"
                required
                value={name}
                onChange={setName}
                placeholder="Budi Santoso"
                disabled={isLoading}
              />

              <FormField
                label="Jurusan SMK"
                name="major"
                as="select"
                required
                value={major}
                onChange={setMajor}
                disabled={isLoading}
                selectOptions={[
                  { value: 'RPL', label: 'RPL (Rekayasa Perangkat Lunak)' },
                  { value: 'TKJ', label: 'TKJ (Teknik Komputer dan Jaringan)' },
                  { value: 'PPLG', label: 'PPLG (Pengembangan Perangkat Lunak dan Gim)' },
                  { value: 'OTHER', label: 'Jurusan Terkait Lainnya' },
                ]}
              />

              <FormField
                label="Deskripsi Diri / Bio Singkat"
                name="bio"
                as="textarea"
                value={bio}
                onChange={setBio}
                placeholder="Ceritakan latar belakang minat teknologi, fokus keahlian, atau proyek yang pernah kamu kerjakan di sekolah..."
                maxLength={500}
                hint="Maksimal 500 karakter. Jelaskan minat dan fokus keahlianmu."
                disabled={isLoading}
              />
            </div>
          </FormSection>
        </div>

        {/* Section 2: Keahlian Teknis */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-7 shadow-xs">
          <FormSection
            title="Keahlian Teknis (Skills)"
            description={`${skills.length} keahlian terdaftar • Keahlian ini menentukan skor kecocokan saat kamu mencari lowongan PKL.`}
          >
            <div className="space-y-6">
              {/* Skill Picker */}
              <SkillPicker
                availableSkills={availableSkills}
                selectedSkills={skills}
                onAddSkill={handleAddSkill}
                disabled={isLoading || isLoadingSkills}
                label="Cari dan Tambah Keahlian"
              />

              {/* Current Skills List */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Keahlian Terdaftar ({skills.length})
                  </h3>
                  {skills.length > 0 && (
                    <span className="text-2xs text-muted-foreground">
                      Klik tanda silang (✕) untuk menghapus
                    </span>
                  )}
                </div>

                {skills.length === 0 ? (
                  <div className="p-4 text-center rounded-md border border-dashed border-base-200 bg-base-50/50">
                    <p className="text-sm text-base-600">Belum ada keahlian yang ditambahkan.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Gunakan kolom pencarian di atas untuk menambahkan bahasa pemrograman, framework, atau tools yang kamu kuasai.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Daftar keahlian terdaftar">
                    {skills.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        skill={skill}
                        removable
                        onRemove={handleRemoveSkill}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormSection>
        </div>

        {/* Single Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Perubahan nama, jurusan, dan bio disimpan dengan menekan tombol Simpan Profil.
          </p>
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className="px-6 h-10 font-semibold shadow-xs"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Profil'}
          </Button>
        </div>
      </form>
    </div>
  )
}