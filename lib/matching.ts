/**
 * YukMagang Deterministic Matching Engine
 * Algorithm: Weighted Jaccard Similarity with Major Relevance
 * Source of Truth: docs/design.md (lines 413-465)
 * Pure, deterministic, zero database/React dependencies.
 */

export type MajorType = 'RPL' | 'TKJ' | 'PPLG' | 'OTHER'

export interface StudentMatchProfile {
  major: MajorType | string
  skills: Array<{ name: string }>
}

export interface JobMatchInput {
  skills: Array<{ name: string }>
  techStack: string[]
}

export interface MatchResult {
  percentage: number
  matchedSkills: string[]
  missingSkills: string[]
  majorMatches: boolean
}

/**
 * Infers the primary SMK major required for a job based on tech stack and skills.
 */
export function mapJobMajor(job: JobMatchInput): MajorType {
  const tech = job.techStack.join(' ').toLowerCase()
  const skills = job.skills.map((s) => s.name.toLowerCase()).join(' ')
  const all = tech + ' ' + skills

  if (
    all.includes('react') ||
    all.includes('next') ||
    all.includes('node') ||
    all.includes('typescript') ||
    all.includes('javascript') ||
    all.includes('web')
  ) {
    return 'RPL'
  }

  if (
    all.includes('network') ||
    all.includes('cisco') ||
    all.includes('mikrotik') ||
    all.includes('linux') ||
    all.includes('server') ||
    all.includes('cloud')
  ) {
    return 'TKJ'
  }

  if (
    all.includes('flutter') ||
    all.includes('dart') ||
    all.includes('mobile') ||
    all.includes('android') ||
    all.includes('ios') ||
    all.includes('game') ||
    all.includes('gim')
  ) {
    return 'PPLG'
  }

  return 'OTHER'
}

/**
 * Calculates a deterministic weighted matching score (0 - 100).
 * Weights: Skills 70%, Major 30%.
 */
export function calculateMatch(
  student: StudentMatchProfile,
  job: JobMatchInput
): MatchResult {
  const studentSkills = new Set(
    student.skills.map((s) => s.name.toLowerCase().trim()).filter(Boolean)
  )
  const jobSkills = new Set(
    job.skills.map((s) => s.name.toLowerCase().trim()).filter(Boolean)
  )
  const jobTechStack = new Set(
    job.techStack.map((t) => t.toLowerCase().trim()).filter(Boolean)
  )

  // Combine job requirements (skills + tech stack)
  const allJobRequirements = new Set([...jobSkills, ...jobTechStack])

  // Intersection: skills possessed by student that match requirements
  const matched = [...studentSkills].filter((s) => allJobRequirements.has(s))
  const matchCount = matched.length
  const totalRequirements = allJobRequirements.size

  // Weighted score: 70% Skill overlap, 30% Major congruence
  const skillWeight = 0.7
  const majorWeight = 0.3

  const skillScore = totalRequirements > 0 ? matchCount / totalRequirements : 0
  const expectedMajor = mapJobMajor(job)
  const majorScore = student.major === expectedMajor ? 1 : 0

  const finalScore = Math.round(
    (skillScore * skillWeight + majorScore * majorWeight) * 100
  )

  const missingSkills = [...allJobRequirements].filter(
    (req) => !studentSkills.has(req)
  )

  return {
    percentage: Math.min(Math.max(finalScore, 0), 100),
    matchedSkills: matched,
    missingSkills,
    majorMatches: majorScore === 1,
  }
}
