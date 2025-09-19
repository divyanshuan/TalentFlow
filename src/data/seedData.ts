import { Job, Candidate, Assessment, AssessmentSection } from "../types";
import { db } from "../services/database";

// Sample job data
const sampleJobs: Omit<Job, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Senior Frontend Developer",
    slug: "senior-frontend-developer",
    status: "active",
    tags: ["React", "TypeScript", "Frontend", "Senior"],
    order: 1,
    description:
      "We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.",
    requirements: [
      "5+ years React experience",
      "TypeScript proficiency",
      "CSS/SCSS expertise",
      "Testing experience",
    ],
    location: "Bangalore, India",
    salary: "₹15,00,000 - ₹25,00,000",
  },
  {
    title: "Backend Engineer",
    slug: "backend-engineer",
    status: "active",
    tags: ["Node.js", "Python", "Backend", "API"],
    order: 2,
    description:
      "Join our backend team to build scalable and robust server-side applications.",
    requirements: [
      "3+ years backend development",
      "Node.js or Python",
      "Database design",
      "API development",
    ],
    location: "Mumbai, India",
    salary: "₹12,00,000 - ₹18,00,000",
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer",
    status: "active",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    order: 3,
    description:
      "Help us scale our infrastructure and improve our deployment processes.",
    requirements: [
      "AWS experience",
      "Container orchestration",
      "CI/CD pipelines",
      "Monitoring tools",
    ],
    location: "Delhi, India",
    salary: "₹14,00,000 - ₹20,00,000",
  },
  {
    title: "Product Manager",
    slug: "product-manager",
    status: "active",
    tags: ["Product", "Strategy", "Leadership", "Analytics"],
    order: 4,
    description:
      "Lead product strategy and work with cross-functional teams to deliver great products.",
    requirements: [
      "3+ years PM experience",
      "Technical background",
      "Analytics skills",
      "Leadership experience",
    ],
    location: "Pune, India",
    salary: "₹18,00,000 - ₹28,00,000",
  },
  {
    title: "UX Designer",
    slug: "ux-designer",
    status: "active",
    tags: ["Design", "User Research", "Prototyping", "Figma"],
    order: 5,
    description:
      "Create intuitive and beautiful user experiences for our products.",
    requirements: [
      "Portfolio required",
      "Figma proficiency",
      "User research",
      "Prototyping skills",
    ],
    location: "Chennai, India",
    salary: "₹10,00,000 - ₹15,00,000",
  },
  {
    title: "Data Scientist",
    slug: "data-scientist",
    status: "active",
    tags: ["Machine Learning", "Python", "Statistics", "Analytics"],
    order: 6,
    description:
      "Apply machine learning and statistical analysis to solve complex business problems.",
    requirements: [
      "PhD or MS in relevant field",
      "Python/R proficiency",
      "ML algorithms",
      "Statistics background",
    ],
    location: "Hyderabad, India",
    salary: "₹16,00,000 - ₹24,00,000",
  },
  {
    title: "Mobile Developer (React Native)",
    slug: "mobile-developer-react-native",
    status: "active",
    tags: ["React Native", "Mobile", "iOS", "Android"],
    order: 7,
    description: "Build cross-platform mobile applications using React Native.",
    requirements: [
      "React Native experience",
      "iOS/Android knowledge",
      "JavaScript/TypeScript",
      "Mobile UI/UX",
    ],
    location: "Kolkata, India",
    salary: "₹11,00,000 - ₹16,00,000",
  },
  {
    title: "QA Engineer",
    slug: "qa-engineer",
    status: "active",
    tags: ["Testing", "Automation", "Selenium", "Quality"],
    order: 8,
    description:
      "Ensure the quality of our products through comprehensive testing strategies.",
    requirements: [
      "Testing experience",
      "Automation tools",
      "Test planning",
      "Bug tracking",
    ],
    location: "Ahmedabad, India",
    salary: "₹8,00,000 - ₹12,00,000",
  },
  {
    title: "Security Engineer",
    slug: "security-engineer",
    status: "active",
    tags: ["Security", "Cybersecurity", "Penetration Testing", "Compliance"],
    order: 9,
    description:
      "Protect our systems and data from security threats and vulnerabilities.",
    requirements: [
      "Security certifications",
      "Penetration testing",
      "Security tools",
      "Compliance knowledge",
    ],
    location: "Jaipur, India",
    salary: "₹13,00,000 - ₹19,00,000",
  },
  {
    title: "Technical Writer",
    slug: "technical-writer",
    status: "active",
    tags: ["Documentation", "Technical Writing", "API Docs", "Communication"],
    order: 10,
    description:
      "Create clear and comprehensive technical documentation for our products and APIs.",
    requirements: [
      "Technical writing experience",
      "API documentation",
      "Markdown/Git",
      "Communication skills",
    ],
    location: "Remote",
    salary: "₹6,00,000 - ₹10,00,000",
  },
  // Archived jobs
  {
    title: "Junior Developer",
    slug: "junior-developer",
    status: "archived",
    tags: ["JavaScript", "React", "Junior", "Entry Level"],
    order: 11,
    description:
      "Entry-level position for recent graduates or career changers.",
    requirements: [
      "Basic programming knowledge",
      "Willingness to learn",
      "Problem-solving skills",
    ],
    location: "Indore, India",
    salary: "₹5,00,000 - ₹8,00,000",
  },
  {
    title: "Marketing Manager",
    slug: "marketing-manager",
    status: "archived",
    tags: ["Marketing", "Digital Marketing", "Campaigns", "Analytics"],
    order: 12,
    description: "Lead our marketing efforts and drive user acquisition.",
    requirements: [
      "Marketing experience",
      "Digital marketing",
      "Analytics tools",
      "Campaign management",
    ],
    location: "Gurgaon, India",
    salary: "₹9,00,000 - ₹13,00,000",
  },
  {
    title: "Sales Representative",
    slug: "sales-representative",
    status: "archived",
    tags: ["Sales", "B2B", "CRM", "Communication"],
    order: 13,
    description:
      "Drive sales growth by building relationships with potential customers.",
    requirements: [
      "Sales experience",
      "B2B sales",
      "CRM systems",
      "Communication skills",
    ],
    location: "Noida, India",
    salary: "₹6,00,000 - ₹10,00,000",
  },
  // Additional jobs to reach 25 total
  {
    title: "Full Stack Developer",
    slug: "full-stack-developer",
    status: "active",
    tags: ["React", "Node.js", "MongoDB", "Full Stack"],
    order: 14,
    description: "Build end-to-end applications using modern web technologies.",
    requirements: [
      "React/Node.js experience",
      "Database knowledge",
      "API development",
      "Frontend/Backend skills",
    ],
    location: "Kochi, India",
    salary: "₹12,00,000 - ₹18,00,000",
  },
  {
    title: "Machine Learning Engineer",
    slug: "machine-learning-engineer",
    status: "active",
    tags: ["Python", "TensorFlow", "ML", "AI"],
    order: 15,
    description:
      "Develop and deploy machine learning models for production use.",
    requirements: [
      "Python expertise",
      "ML frameworks",
      "Model deployment",
      "Statistics knowledge",
    ],
    location: "Bangalore, India",
    salary: "₹18,00,000 - ₹30,00,000",
  },
  {
    title: "Cloud Solutions Architect",
    slug: "cloud-solutions-architect",
    status: "active",
    tags: ["AWS", "Azure", "Architecture", "Cloud"],
    order: 16,
    description:
      "Design and implement cloud-based solutions for enterprise clients.",
    requirements: [
      "Cloud platform expertise",
      "Architecture design",
      "Migration experience",
      "Security knowledge",
    ],
    location: "Pune, India",
    salary: "₹20,00,000 - ₹35,00,000",
  },
  {
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    status: "active",
    tags: ["Figma", "Sketch", "Design", "Prototyping"],
    order: 17,
    description:
      "Create intuitive and beautiful user interfaces and experiences.",
    requirements: [
      "Design tools proficiency",
      "User research",
      "Prototyping",
      "Design systems",
    ],
    location: "Mumbai, India",
    salary: "₹8,00,000 - ₹15,00,000",
  },
  {
    title: "Database Administrator",
    slug: "database-administrator",
    status: "active",
    tags: ["SQL", "PostgreSQL", "MySQL", "Database"],
    order: 18,
    description: "Manage and optimize database systems for high performance.",
    requirements: [
      "Database management",
      "Performance tuning",
      "Backup/recovery",
      "Security practices",
    ],
    location: "Chennai, India",
    salary: "₹10,00,000 - ₹16,00,000",
  },
  {
    title: "Business Analyst",
    slug: "business-analyst",
    status: "active",
    tags: ["Analytics", "Requirements", "Documentation", "Stakeholder"],
    order: 19,
    description:
      "Analyze business processes and requirements for technical solutions.",
    requirements: [
      "Business analysis",
      "Requirements gathering",
      "Documentation",
      "Stakeholder management",
    ],
    location: "Delhi, India",
    salary: "₹9,00,000 - ₹14,00,000",
  },
  {
    title: "Content Writer",
    slug: "content-writer",
    status: "active",
    tags: ["Writing", "SEO", "Marketing", "Content"],
    order: 20,
    description:
      "Create engaging content for marketing and product documentation.",
    requirements: [
      "Writing skills",
      "SEO knowledge",
      "Marketing content",
      "Technical writing",
    ],
    location: "Remote",
    salary: "₹4,00,000 - ₹8,00,000",
  },
  {
    title: "Network Engineer",
    slug: "network-engineer",
    status: "active",
    tags: ["Networking", "Cisco", "Security", "Infrastructure"],
    order: 21,
    description: "Design and maintain network infrastructure and security.",
    requirements: [
      "Network protocols",
      "Cisco equipment",
      "Network security",
      "Troubleshooting",
    ],
    location: "Hyderabad, India",
    salary: "₹11,00,000 - ₹17,00,000",
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    status: "active",
    tags: ["Agile", "Scrum", "Leadership", "Project Management"],
    order: 22,
    description:
      "Lead cross-functional teams to deliver projects on time and budget.",
    requirements: [
      "Project management",
      "Agile/Scrum",
      "Team leadership",
      "Risk management",
    ],
    location: "Gurgaon, India",
    salary: "₹12,00,000 - ₹20,00,000",
  },
  {
    title: "Customer Success Manager",
    slug: "customer-success-manager",
    status: "active",
    tags: ["Customer Success", "Retention", "Support", "Account Management"],
    order: 23,
    description: "Ensure customer satisfaction and drive product adoption.",
    requirements: [
      "Customer success",
      "Account management",
      "Data analysis",
      "Communication skills",
    ],
    location: "Bangalore, India",
    salary: "₹8,00,000 - ₹13,00,000",
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer-2",
    status: "archived",
    tags: ["Docker", "Jenkins", "CI/CD", "Infrastructure"],
    order: 24,
    description: "Streamline development and deployment processes.",
    requirements: [
      "CI/CD pipelines",
      "Containerization",
      "Infrastructure as code",
      "Monitoring tools",
    ],
    location: "Pune, India",
    salary: "₹14,00,000 - ₹22,00,000",
  },
  {
    title: "HR Manager",
    slug: "hr-manager",
    status: "archived",
    tags: ["HR", "Recruitment", "Employee Relations", "HRIS"],
    order: 25,
    description: "Manage human resources operations and employee relations.",
    requirements: [
      "HR experience",
      "Recruitment",
      "Employee relations",
      "HR systems",
    ],
    location: "Mumbai, India",
    salary: "₹10,00,000 - ₹16,00,000",
  },
];

// Sample candidate data
const generateCandidates = (
  jobs: Job[]
): Omit<Candidate, "id" | "createdAt" | "updatedAt">[] => {
  const firstNames = [
    // Male names
    "Arjun",
    "Rajesh",
    "Vikram",
    "Amit",
    "Rahul",
    "Suresh",
    "Kumar",
    "Prakash",
    "Ankit",
    "Deepak",
    "Nikhil",
    "Rohit",
    "Sachin",
    "Manish",
    "Gaurav",
    "Ravi",
    "Vinod",
    "Ajay",
    "Sandeep",
    "Pankaj",
    "Ramesh",
    "Suresh",
    "Manoj",
    "Vishal",
    "Raj",
    "Kiran",
    "Sunil",
    "Dinesh",
    "Mukesh",
    "Harish",
    "Suresh",
    "Bharat",
    "Ashok",
    "Dilip",
    "Naresh",
    "Jitendra",
    "Vijay",
    "Mahesh",
    "Narendra",
    "Rakesh",
    "Satish",
    "Pramod",
    "Yogesh",
    "Brijesh",
    "Hemant",
    "Girish",
    "Subhash",
    "Ranjit",
    "Naveen",
    "Pradeep",

    // Female names
    "Priya",
    "Anita",
    "Sunita",
    "Rekha",
    "Sushma",
    "Kavita",
    "Meera",
    "Seema",
    "Ritu",
    "Neha",
    "Pooja",
    "Shilpa",
    "Manisha",
    "Deepa",
    "Shweta",
    "Nisha",
    "Radha",
    "Geeta",
    "Sarita",
    "Kalpana",
    "Kiran",
    "Anjali",
    "Rashmi",
    "Vidya",
    "Usha",
    "Suman",
    "Lata",
    "Asha",
    "Kamala",
    "Sushila",
    "Rajni",
    "Vandana",
    "Preeti",
    "Sonia",
    "Monika",
    "Rekha",
    "Poonam",
    "Neetu",
    "Shanti",
    "Indira",
    "Madhuri",
    "Shobha",
    "Ranjana",
    "Veena",
    "Sushila",
    "Pushpa",
    "Lalita",
    "Urmila",
    "Chandni",
    "Kavita",
  ];
  const lastNames = [
    "Sharma",
    "Verma",
    "Gupta",
    "Kumar",
    "Singh",
    "Patel",
    "Yadav",
    "Khan",
    "Shah",
    "Agarwal",
    "Jain",
    "Malik",
    "Chauhan",
    "Reddy",
    "Mishra",
    "Pandey",
    "Rao",
    "Joshi",
    "Nair",
    "Iyer",
    "Agarwal",
    "Bansal",
    "Goel",
    "Goyal",
    "Khanna",
    "Bhatia",
    "Chopra",
    "Mehta",
    "Saxena",
    "Tiwari",
    "Dubey",
    "Tripathi",
    "Awasthi",
    "Dwivedi",
    "Trivedi",
    "Pandit",
    "Shukla",
    "Verma",
    "Srivastava",
    "Sinha",
    "Bose",
    "Banerjee",
    "Chakraborty",
    "Mukherjee",
    "Das",
    "Ghosh",
    "Roy",
    "Sen",
    "Dutta",
    "Mondal",
    "Patil",
    "Deshmukh",
    "Jadhav",
    "Kulkarni",
    "Pawar",
    "Gavde",
    "Shinde",
    "Bhosle",
    "Chavan",
    "More",
    "Reddy",
    "Naidu",
    "Rao",
    "Krishna",
    "Murthy",
    "Venkat",
    "Sastry",
    "Raman",
    "Iyer",
    "Menon",
  ];
  const stages: Candidate["stage"][] = [
    "applied",
    "screen",
    "tech",
    "offer",
    "hired",
    "rejected",
  ];

  const candidates: Omit<Candidate, "id" | "createdAt" | "updatedAt">[] = [];

  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];

    candidates.push({
      name,
      email,
      phone: `+91-${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 900) + 100
      }-${Math.floor(Math.random() * 9000) + 1000}`,
      stage,
      jobId: job.id,
      linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}`,
      portfolio:
        Math.random() > 0.7
          ? `https://${firstName.toLowerCase()}-${lastName.toLowerCase()}.com`
          : undefined,
      notes:
        Math.random() > 0.8
          ? `Strong candidate with ${
              Math.floor(Math.random() * 5) + 1
            } years of experience in Indian tech industry.`
          : undefined,
    });
  }

  return candidates;
};

// Sample assessment data
const createAssessment = (
  job: Job
): Omit<Assessment, "id" | "jobId" | "createdAt" | "updatedAt"> => {
  const sections: Omit<AssessmentSection, "id">[] = [
    {
      title: "Technical Skills Assessment",
      description: "Comprehensive evaluation of technical knowledge and skills",
      order: 1,
      questions: [
        {
          id: "tech-1",
          type: "single-choice",
          title:
            "How many years of experience do you have with the primary technology for this role?",
          required: true,
          options: [
            "Less than 1 year",
            "1-2 years",
            "3-5 years",
            "5+ years",
            "10+ years",
          ],
          order: 1,
        },
        {
          id: "tech-2",
          type: "multi-choice",
          title: "Which of the following technologies are you familiar with?",
          required: true,
          options: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Python",
            "AWS",
            "Docker",
            "Git",
            "MongoDB",
            "PostgreSQL",
            "Kubernetes",
            "Terraform",
          ],
          order: 2,
        },
        {
          id: "tech-3",
          type: "short-text",
          title:
            "Describe your most challenging technical project and the technologies used.",
          required: true,
          maxLength: 500,
          order: 3,
        },
        {
          id: "tech-4",
          type: "single-choice",
          title: "How do you stay updated with the latest technology trends?",
          required: true,
          options: [
            "Online courses and tutorials",
            "Technical blogs and documentation",
            "Conferences and meetups",
            "Open source contributions",
            "All of the above",
          ],
          order: 4,
        },
        {
          id: "tech-5",
          type: "numeric",
          title:
            "Rate your expertise level in the primary technology for this role (1-10):",
          required: true,
          min: 1,
          max: 10,
          order: 5,
        },
      ],
    },
    {
      title: "Problem Solving & Analytical Skills",
      description: "Evaluate analytical thinking and problem-solving abilities",
      order: 2,
      questions: [
        {
          id: "problem-1",
          type: "single-choice",
          title:
            "When facing a complex problem, what is your typical approach?",
          required: true,
          options: [
            "Break it down into smaller parts",
            "Research similar solutions online",
            "Ask for help from team members",
            "Try multiple approaches simultaneously",
            "Start with the simplest solution first",
          ],
          order: 1,
        },
        {
          id: "problem-2",
          type: "long-text",
          title:
            "Describe a time when you had to learn a new technology quickly to solve a critical problem. What was your learning approach?",
          required: true,
          maxLength: 1000,
          order: 2,
        },
        {
          id: "problem-3",
          type: "single-choice",
          title: "How do you handle debugging complex issues?",
          required: true,
          options: [
            "Use systematic debugging tools",
            "Add extensive logging",
            "Test hypotheses one by one",
            "Ask for a second opinion",
            "Research similar issues online",
          ],
          order: 3,
        },
        {
          id: "problem-4",
          type: "short-text",
          title:
            "Describe a situation where you had to optimize performance of a slow application.",
          required: true,
          maxLength: 400,
          order: 4,
        },
      ],
    },
    {
      title: "Communication & Collaboration",
      description: "Assess communication skills and teamwork capabilities",
      order: 3,
      questions: [
        {
          id: "comm-1",
          type: "single-choice",
          title:
            "How do you prefer to communicate technical concepts to non-technical stakeholders?",
          required: true,
          options: [
            "Visual diagrams and flowcharts",
            "Simple analogies and examples",
            "Step-by-step explanations",
            "Interactive demonstrations",
            "Written documentation",
          ],
          order: 1,
        },
        {
          id: "comm-2",
          type: "numeric",
          title:
            "On a scale of 1-10, how comfortable are you with pair programming?",
          required: true,
          min: 1,
          max: 10,
          order: 2,
        },
        {
          id: "comm-3",
          type: "short-text",
          title:
            "Describe your experience working in a cross-functional team environment.",
          required: true,
          maxLength: 300,
          order: 3,
        },
        {
          id: "comm-4",
          type: "single-choice",
          title:
            "How do you handle disagreements with team members about technical decisions?",
          required: true,
          options: [
            "Present data and evidence",
            "Seek input from senior team members",
            "Compromise on a middle ground",
            "Stand firm on your position",
            "Escalate to management",
          ],
          order: 4,
        },
      ],
    },
    {
      title: "Experience & Career Goals",
      description: "Understand candidate's background and career aspirations",
      order: 4,
      questions: [
        {
          id: "exp-1",
          type: "single-choice",
          title: "What type of work environment do you prefer?",
          required: true,
          options: ["Remote", "Hybrid", "Office", "No preference"],
          order: 1,
        },
        {
          id: "exp-2",
          type: "long-text",
          title: "What are your career goals for the next 3-5 years?",
          required: true,
          maxLength: 800,
          order: 2,
        },
        {
          id: "exp-3",
          type: "single-choice",
          title: "How do you prefer to receive feedback?",
          required: true,
          options: [
            "Regular one-on-one meetings",
            "Written feedback",
            "Real-time feedback during work",
            "Formal performance reviews",
            "Peer feedback",
          ],
          order: 3,
        },
        {
          id: "exp-4",
          type: "numeric",
          title: "What is your expected salary range (in ₹)?",
          required: false,
          min: 500000,
          max: 5000000,
          order: 4,
        },
        {
          id: "exp-5",
          type: "short-text",
          title: "What motivates you most in your work?",
          required: true,
          maxLength: 250,
          order: 5,
        },
      ],
    },
    {
      title: "Role-Specific Questions",
      description: "Questions specific to this position and company",
      order: 5,
      questions: [
        {
          id: "role-1",
          type: "single-choice",
          title: "Are you genuinely interested in this specific role?",
          required: true,
          options: [
            "Yes, very interested",
            "Yes, somewhat interested",
            "Not sure",
            "No",
          ],
          order: 1,
        },
        {
          id: "role-2",
          type: "long-text",
          title: "Why are you interested in this position and our company?",
          required: true,
          maxLength: 800,
          conditional: {
            questionId: "role-1",
            operator: "equals",
            value: "Yes, very interested",
          },
          order: 2,
        },
        {
          id: "role-3",
          type: "single-choice",
          title: "What is your availability to start?",
          required: true,
          options: [
            "Immediately",
            "2 weeks notice",
            "1 month notice",
            "2 months notice",
            "Negotiable",
          ],
          order: 3,
        },
        {
          id: "role-4",
          type: "short-text",
          title: "Do you have any questions about the role or company?",
          required: false,
          maxLength: 500,
          order: 4,
        },
      ],
    },
  ];

  return {
    title: `${job.title} Comprehensive Assessment`,
    description: `Detailed assessment for the ${job.title} position covering technical skills, problem-solving, communication, and role-specific competencies`,
    sections: sections.map((section) => ({
      ...section,
      id: `section-${Math.random().toString(36).substr(2, 9)}`,
      questions: section.questions.map((q) => ({
        ...q,
        id: q.id,
      })),
    })),
  };
};

export const seedDatabase = async () => {
  try {
    // Check if database already has data
    const existingJobs = await db.jobs.count();
    const existingCandidates = await db.candidates.count();
    
    // Only seed if database is empty
    if (existingJobs > 0 || existingCandidates > 0) {
      console.log("Database already has data, skipping seed");
      return;
    }

    console.log("Database is empty, seeding with sample data...");

    // Seed jobs
    const now = new Date().toISOString();
    const jobs: Job[] = sampleJobs.map((job, index) => ({
      ...job,
      id: `job-${index + 1}`,
      createdAt: now,
      updatedAt: now,
    }));

    await db.jobs.bulkAdd(jobs);
    console.log(`Seeded ${jobs.length} jobs`);

    // Seed candidates
    const candidates: Omit<Candidate, "id" | "createdAt" | "updatedAt">[] =
      generateCandidates(jobs);
    const candidatesWithIds: Candidate[] = candidates.map((candidate) => ({
      ...candidate,
      id: `candidate-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    }));

    await db.candidates.bulkAdd(candidatesWithIds);
    console.log(`Seeded ${candidatesWithIds.length} candidates`);

    // Seed assessments for first 5 jobs to ensure we have at least 3 comprehensive assessments
    const assessments = jobs.slice(0, 5).map((job) => {
      const assessmentData = createAssessment(job);
      return {
        ...assessmentData,
        id: `assessment-${job.id}`,
        jobId: job.id,
        createdAt: now,
        updatedAt: now,
      };
    });

    await db.assessments.bulkAdd(assessments);
    console.log(`Seeded ${assessments.length} assessments`);

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

// Function to manually clear database and reseed (for testing purposes)
export const resetDatabase = async () => {
  try {
    console.log("Clearing database and reseeding...");
    await db.jobs.clear();
    await db.candidates.clear();
    await db.assessments.clear();
    await db.assessmentResponses.clear();
    await db.candidateTimeline.clear();
    await db.notes.clear();
    
    // Now seed fresh data
    await seedDatabase();
    console.log("Database reset and reseeded successfully");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  }
};
