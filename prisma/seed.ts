import { PrismaClient, Role, Major, SkillCategory, ApplicationStatus, Decision } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (in reverse order of dependencies)
  await prisma.portfolioItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.application.deleteMany()
  await prisma.studyCase.deleteMany()
  await prisma.jobSkill.deleteMany()
  await prisma.job.deleteMany()
  await prisma.studentSkill.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.company.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create Skills
  const skillsData = [
    // Languages
    { name: 'JavaScript', category: SkillCategory.LANGUAGE },
    { name: 'TypeScript', category: SkillCategory.LANGUAGE },
    { name: 'Python', category: SkillCategory.LANGUAGE },
    { name: 'Java', category: SkillCategory.LANGUAGE },
    { name: 'PHP', category: SkillCategory.LANGUAGE },
    { name: 'Go', category: SkillCategory.LANGUAGE },
    { name: 'Dart', category: SkillCategory.LANGUAGE },
    { name: 'C#', category: SkillCategory.LANGUAGE },
    // Frameworks
    { name: 'React', category: SkillCategory.FRAMEWORK },
    { name: 'Next.js', category: SkillCategory.FRAMEWORK },
    { name: 'Vue.js', category: SkillCategory.FRAMEWORK },
    { name: 'Laravel', category: SkillCategory.FRAMEWORK },
    { name: 'Express.js', category: SkillCategory.FRAMEWORK },
    { name: 'Django', category: SkillCategory.FRAMEWORK },
    { name: 'Flutter', category: SkillCategory.FRAMEWORK },
    { name: 'React Native', category: SkillCategory.FRAMEWORK },
    { name: 'Spring Boot', category: SkillCategory.FRAMEWORK },
    { name: '.NET Core', category: SkillCategory.FRAMEWORK },
    // Databases
    { name: 'PostgreSQL', category: SkillCategory.DATABASE },
    { name: 'MySQL', category: SkillCategory.DATABASE },
    { name: 'MongoDB', category: SkillCategory.DATABASE },
    { name: 'Redis', category: SkillCategory.DATABASE },
    { name: 'SQLite', category: SkillCategory.DATABASE },
    // Tools
    { name: 'Git', category: SkillCategory.TOOL },
    { name: 'Docker', category: SkillCategory.TOOL },
    { name: 'Kubernetes', category: SkillCategory.TOOL },
    { name: 'CI/CD', category: SkillCategory.TOOL },
    { name: 'Linux', category: SkillCategory.TOOL },
    { name: 'VS Code', category: SkillCategory.TOOL },
    { name: 'Postman', category: SkillCategory.TOOL },
    { name: 'Figma', category: SkillCategory.TOOL },
    // Cloud
    { name: 'AWS', category: SkillCategory.CLOUD },
    { name: 'Google Cloud', category: SkillCategory.CLOUD },
    { name: 'Azure', category: SkillCategory.CLOUD },
    { name: 'Vercel', category: SkillCategory.CLOUD },
    { name: 'Netlify', category: SkillCategory.CLOUD },
    // Technical
    { name: 'REST API', category: SkillCategory.TECHNICAL },
    { name: 'GraphQL', category: SkillCategory.TECHNICAL },
    { name: 'Microservices', category: SkillCategory.TECHNICAL },
    { name: 'WebSocket', category: SkillCategory.TECHNICAL },
    { name: 'OAuth/JWT', category: SkillCategory.TECHNICAL },
    { name: 'Testing', category: SkillCategory.TECHNICAL },
    // Networking (TKJ)
    { name: 'Cisco Networking', category: SkillCategory.TECHNICAL },
    { name: 'MikroTik', category: SkillCategory.TECHNICAL },
    { name: 'Network Security', category: SkillCategory.TECHNICAL },
    { name: 'VPN', category: SkillCategory.TECHNICAL },
    { name: 'Firewall', category: SkillCategory.TECHNICAL },
    // Soft Skills
    { name: 'Communication', category: SkillCategory.SOFT },
    { name: 'Teamwork', category: SkillCategory.SOFT },
    { name: 'Problem Solving', category: SkillCategory.SOFT },
    { name: 'Time Management', category: SkillCategory.SOFT },
  ]

  const skills = await Promise.all(
    skillsData.map((s) => prisma.skill.create({ data: s }))
  )
  console.log(`✅ Created ${skills.length} skills`)

  // Create Company Users & Profiles
  const companyPasswordHash = await bcrypt.hash('company123', 12)

  const companyUser1 = await prisma.user.create({
    data: {
      email: 'techcorp@demo.com',
      passwordHash: companyPasswordHash,
      role: Role.COMPANY,
      company: {
        create: {
          name: 'TechCorp Indonesia',
          description: 'Leading software development company specializing in web and mobile applications.',
          location: 'Jakarta, Indonesia',
          website: 'https://techcorp.example.com',
          verified: true,
        },
      },
    },
    include: { company: true },
  })

  const companyUser2 = await prisma.user.create({
    data: {
      email: 'digitalworks@demo.com',
      passwordHash: companyPasswordHash,
      role: Role.COMPANY,
      company: {
        create: {
          name: 'DigitalWorks',
          description: 'Digital agency providing custom software solutions and IT consulting.',
          location: 'Bandung, Indonesia',
          website: 'https://digitalworks.example.com',
          verified: true,
        },
      },
    },
    include: { company: true },
  })

  const companyUser3 = await prisma.user.create({
    data: {
      email: 'netinfra@demo.com',
      passwordHash: companyPasswordHash,
      role: Role.COMPANY,
      company: {
        create: {
          name: 'NetInfra Solutions',
          description: 'Network infrastructure and cybersecurity solutions provider.',
          location: 'Surabaya, Indonesia',
          website: 'https://netinfra.example.com',
          verified: true,
        },
      },
    },
    include: { company: true },
  })

  console.log('✅ Created 3 demo companies')

  // Helper to get skill IDs by name
  const getSkillIds = (names: string[]) => skills.filter((s) => names.includes(s.name)).map((s) => s.id)

  // Create Jobs with Study Cases
  const techcorp = companyUser1.company!
  const digitalworks = companyUser2.company!
  const netinfra = companyUser3.company!

  const job1 = await prisma.job.create({
    data: {
      companyId: techcorp.id,
      title: 'Full Stack Developer Intern (Next.js + PostgreSQL)',
      description: 'Join our development team to build modern web applications using Next.js, TypeScript, and PostgreSQL. You will work on real features, write tests, and learn best practices.',
      location: 'Jakarta, Indonesia (Hybrid)',
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Prisma'],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      skills: {
        create: getSkillIds(['Next.js', 'TypeScript', 'PostgreSQL', 'React', 'Tailwind CSS', 'Prisma', 'Git', 'REST API']).map((skillId) => ({ skillId })),
      },
      studyCase: {
        create: {
          title: 'Build a Task Management Dashboard',
          problemDescription: 'Create a task management dashboard where users can create, read, update, and delete tasks. Tasks have title, description, status (todo/in-progress/done), priority, and due date.',
          instructions: '1. Use Next.js 14+ with App Router\n2. Use TypeScript\n3. Use Prisma with PostgreSQL\n4. Implement authentication (simple email/password)\n5. Create REST API for tasks\n6. Build responsive UI with Tailwind CSS\n7. Deploy to Vercel\n8. Push code to GitHub',
          requiredSkills: ['Next.js', 'TypeScript', 'PostgreSQL', 'React', 'Prisma', 'Git'],
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
      },
    },
    include: { skills: { include: { skill: true } }, studyCase: true },
  })

  const job2 = await prisma.job.create({
    data: {
      companyId: techcorp.id,
      title: 'Backend Developer Intern (Node.js + Express)',
      description: 'Work on backend services for our SaaS platform. Build REST APIs, work with databases, and learn about scalable architecture.',
      location: 'Jakarta, Indonesia (Remote)',
      techStack: ['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      skills: {
        create: getSkillIds(['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Git']).map((skillId) => ({ skillId })),
      },
      studyCase: {
        create: {
          title: 'Design and Implement a RESTful API for E-commerce',
          problemDescription: 'Build a REST API for a simple e-commerce system with products, categories, orders, and users.',
          instructions: '1. Use Node.js with Express and TypeScript\n2. Use PostgreSQL with Prisma\n3. Implement JWT authentication\n4. Create CRUD for products, categories, orders\n5. Add input validation\n6. Write unit tests\n7. Document API with Swagger\n8. Deploy with Docker',
          requiredSkills: ['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'JWT', 'Docker'],
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
    },
    include: { skills: { include: { skill: true } }, studyCase: true },
  })

  const job3 = await prisma.job.create({
    data: {
      companyId: digitalworks.id,
      title: 'Frontend Developer Intern (React + TypeScript)',
      description: 'Create beautiful, responsive user interfaces for client projects. Work with designers and backend developers.',
      location: 'Bandung, Indonesia (On-site)',
      techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Query'],
      applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      skills: {
        create: getSkillIds(['React', 'TypeScript', 'Tailwind CSS', 'React Query', 'Git', 'Figma', 'REST API']).map((skillId) => ({ skillId })),
      },
      studyCase: {
        create: {
          title: 'Build a Kanban Board Application',
          problemDescription: 'Create a Trello-like kanban board with drag-and-drop functionality. Boards contain lists, lists contain cards.',
          instructions: '1. Use React 18+ with TypeScript\n2. Use Vite as build tool\n3. Implement drag-and-drop with @dnd-kit\n4. Use React Query for state management\n5. Style with Tailwind CSS\n6. Persist data to localStorage\n7. Add dark mode support\n8. Deploy to Vercel/Netlify',
          requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'React Query', 'Git'],
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
    },
    include: { skills: { include: { skill: true } }, studyCase: true },
  })

  const job4 = await prisma.job.create({
    data: {
      companyId: digitalworks.id,
      title: 'Mobile App Developer Intern (Flutter)',
      description: 'Develop cross-platform mobile applications using Flutter. Work on both iOS and Android apps.',
      location: 'Bandung, Indonesia (Hybrid)',
      techStack: ['Flutter', 'Dart', 'Firebase', 'Provider/Bloc', 'REST API'],
      applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      skills: {
        create: getSkillIds(['Flutter', 'Dart', 'Firebase', 'REST API', 'Git', 'Figma', 'Testing']).map((skillId) => ({ skillId })),
      },
      studyCase: {
        create: {
          title: 'Build a Habit Tracker Mobile App',
          problemDescription: 'Create a habit tracking app where users can add habits, set frequency, mark completion, and view streaks.',
          instructions: '1. Use Flutter 3+ with Dart\n2. Use Provider or Bloc for state management\n3. Use SQLite (sqflite) for local storage\n4. Implement local notifications\n5. Add streak calculation logic\n6. Create clean, Material Design UI\n7. Test on both iOS and Android\n8. Push to GitHub with README',
          requiredSkills: ['Flutter', 'Dart', 'SQLite', 'Git', 'Testing'],
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
    },
    include: { skills: { include: { skill: true } }, studyCase: true },
  })

  const job5 = await prisma.job.create({
    data: {
      companyId: netinfra.id,
      title: 'Network Engineering Intern (Cisco + MikroTik)',
      description: 'Learn network infrastructure management, configure routers/switches, and help with network monitoring.',
      location: 'Surabaya, Indonesia (On-site)',
      techStack: ['Cisco IOS', 'MikroTik RouterOS', 'Linux', 'VPN', 'Firewall'],
      applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      skills: {
        create: getSkillIds(['Cisco Networking', 'MikroTik', 'Linux', 'VPN', 'Firewall', 'Network Security', 'Git']).map((skillId) => ({ skillId })),
      },
      studyCase: {
        create: {
          title: 'Design and Configure a Small Office Network',
          problemDescription: 'Design a network topology for a 50-person office with VLANs, DHCP, VPN access, and basic firewall rules.',
          instructions: '1. Create network topology diagram\n2. Configure Cisco switch with VLANs\n3. Configure MikroTik router for DHCP, NAT, VPN\n4. Set up firewall rules\n5. Document all configurations\n6. Test connectivity between VLANs\n7. Write implementation guide\n8. Submit diagrams and config files',
          requiredSkills: ['Cisco Networking', 'MikroTik', 'VPN', 'Firewall', 'VLAN'],
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
    },
    include: { skills: { include: { skill: true } }, studyCase: true },
  })

  console.log('✅ Created 5 jobs with study cases')

  // Create Student User & Profile
  const studentPasswordHash = await bcrypt.hash('student123', 12)

  const studentUser = await prisma.user.create({
    data: {
      email: 'budi.santoso@student.demo',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          name: 'Budi Santoso',
          major: Major.RPL,
          bio: 'SMK RPL student passionate about web development. Love building things with React and Next.js.',
          skills: {
            create: getSkillIds(['Next.js', 'TypeScript', 'React', 'PostgreSQL', 'Tailwind CSS', 'Git', 'REST API', 'Docker', 'Vercel']).map((skillId) => ({ skillId })),
          },
        },
      },
    },
    include: { studentProfile: { include: { skills: { include: { skill: true } } } } },
  })

  console.log('✅ Created demo student with skills')

  // Create Applications & Submissions & Reviews & Portfolio Items
  const studentProfile = studentUser.studentProfile!

  // Application 1: Applied to job1 (TechCorp Full Stack), SUBMITTED, REVIEWED, ACCEPTED
  const app1 = await prisma.application.create({
    data: {
      studentId: studentProfile.id,
      jobId: job1.id,
      status: ApplicationStatus.ACCEPTED,
      submission: {
        create: {
          repoUrl: 'https://github.com/budi/task-dashboard',
          deployedUrl: 'https://task-dashboard-budi.vercel.app',
          explanation: 'Built a full-stack task management dashboard using Next.js 14 App Router, TypeScript, Prisma, and PostgreSQL. Implemented authentication with JWT, created RESTful API for tasks with CRUD operations, and built a responsive UI with Tailwind CSS. Used React Hook Form for form validation and deployed to Vercel with automatic deployments from GitHub.',
        },
      },
      review: {
        create: {
          score: 88,
          feedback: 'Excellent implementation! Clean code structure, proper TypeScript types, good use of Prisma relations. The UI is polished and responsive. Minor suggestion: add pagination for large task lists. Great job on the authentication flow!',
          decision: Decision.ACCEPTED,
        },
      },
      portfolioItem: {
        create: {
          studentId: studentProfile.id,
          studyCaseTitle: 'Build a Task Management Dashboard',
          companyName: 'TechCorp Indonesia',
          technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'React', 'Tailwind CSS', 'Prisma'],
          repoUrl: 'https://github.com/budi/task-dashboard',
          deployedUrl: 'https://task-dashboard-budi.vercel.app',
          score: 88,
          feedback: 'Excellent implementation! Clean code structure, proper TypeScript types, good use of Prisma relations. The UI is polished and responsive. Minor suggestion: add pagination for large task lists. Great job on the authentication flow!',
          result: Decision.ACCEPTED,
        },
      },
    },
    include: { submission: true, review: true, portfolioItem: true },
  })

  // Application 2: Applied to job2 (TechCorp Backend), SUBMITTED, REVIEWED, REJECTED
  const app2 = await prisma.application.create({
    data: {
      studentId: studentProfile.id,
      jobId: job2.id,
      status: ApplicationStatus.REJECTED,
      submission: {
        create: {
          repoUrl: 'https://github.com/budi/ecommerce-api',
          deployedUrl: 'https://ecommerce-api-budi.fly.dev',
          explanation: 'Built a RESTful e-commerce API with Node.js, Express, TypeScript, and PostgreSQL. Implemented JWT authentication with access/refresh tokens, created CRUD endpoints for products, categories, and orders. Added input validation with Zod, wrote unit tests with Jest, and documented API with Swagger. Containerized with Docker and deployed to Fly.io.',
        },
      },
      review: {
        create: {
          score: 72,
          feedback: 'Good effort on the API design and Docker setup. However, the order management logic has some edge cases not handled (concurrent order placement). Test coverage could be improved. The Swagger documentation is well done. Keep practicing!',
          decision: Decision.REJECTED,
        },
      },
      portfolioItem: {
        create: {
          studentId: studentProfile.id,
          studyCaseTitle: 'Design and Implement a RESTful API for E-commerce',
          companyName: 'TechCorp Indonesia',
          technologies: ['Node.js', 'Express.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Jest'],
          repoUrl: 'https://github.com/budi/ecommerce-api',
          deployedUrl: 'https://ecommerce-api-budi.fly.dev',
          score: 72,
          feedback: 'Good effort on the API design and Docker setup. However, the order management logic has some edge cases not handled (concurrent order placement). Test coverage could be improved. The Swagger documentation is well done. Keep practicing!',
          result: Decision.REJECTED,
        },
      },
    },
    include: { submission: true, review: true, portfolioItem: true },
  })

  // Application 3: Applied to job3 (DigitalWorks Frontend), PENDING (no submission yet)
  await prisma.application.create({
    data: {
      studentId: studentProfile.id,
      jobId: job3.id,
      status: ApplicationStatus.PENDING,
    },
  })

  // Application 4: Applied to job4 (DigitalWorks Mobile), PENDING
  await prisma.application.create({
    data: {
      studentId: studentProfile.id,
      jobId: job4.id,
      status: ApplicationStatus.PENDING,
    },
  })

  console.log('✅ Created 4 applications (2 reviewed with portfolio items, 2 pending)')

  // Create additional student for variety (no applications)
  await prisma.user.create({
    data: {
      email: 'siti.rahayu@student.demo',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          name: 'Siti Rahayu',
          major: Major.TKJ,
          bio: 'TKJ student interested in network engineering and cybersecurity.',
          skills: {
            create: getSkillIds(['Cisco Networking', 'MikroTik', 'Linux', 'Network Security', 'VPN', 'Firewall', 'Git', 'Python']).map((skillId) => ({ skillId })),
          },
        },
      },
    },
  })

  await prisma.user.create({
    data: {
      email: 'ahmad.fauzi@student.demo',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      studentProfile: {
        create: {
          name: 'Ahmad Fauzi',
          major: Major.PPLG,
          bio: 'PPLG student building mobile apps with Flutter. Also learning backend with Firebase.',
          skills: {
            create: getSkillIds(['Flutter', 'Dart', 'Firebase', 'REST API', 'Git', 'Figma', 'Testing', 'SQLite']).map((skillId) => ({ skillId })),
          },
        },
      },
    },
  })

  console.log('✅ Created 2 additional students')

  console.log('🎉 Seeding completed successfully!')
  console.log('')
  console.log('Demo Accounts:')
  console.log('  Student: budi.santoso@student.demo / student123')
  console.log('  Student: siti.rahayu@student.demo / student123')
  console.log('  Student: ahmad.fauzi@student.demo / student123')
  console.log('  Company: techcorp@demo.com / company123')
  console.log('  Company: digitalworks@demo.com / company123')
  console.log('  Company: netinfra@demo.com / company123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })