// Single source of truth for the résumé content shared by every version of the site.

export type Period = { start: string; end: string };
export type Group = { title: string; items: string[] };

export const period = (p: Period, separator = " – ") => `${p.start}${separator}${p.end}`;

export const profile = {
  name: "Tam Kok Yan",
  title: "NetSuite Technical Consultant",
  company: "BlackOak Consulting",
  email: "kokyan2003330@gmail.com",
  linkedin: "https://www.linkedin.com/in/kytam0330/",
  location: "Greater Kuala Lumpur, Malaysia",
  photo: "/assets/photo.png",
  blackoakStart: "2024-11",
};

export const university = "Tunku Abdul Rahman University of Management and Technology";

export const netsuiteRole = {
  title: "NetSuite Technical Consultant",
  org: "BlackOak Consulting Sdn Bhd",
  place: "Subang Jaya",
  employment: "Full-time",
  period: { start: "May 2025", end: "Present" },
  summary:
    "Delivering technical customisation, automation, and integration solutions on Oracle NetSuite — working across Order-to-Cash (O2C) and Procure-to-Pay (P2P) processes to translate business requirements into working system logic.",
  groups: [
    {
      title: "Customisation & Business Process Automation",
      items: [
        "Develop custom solutions in SuiteScript 2.1 across User Event, Client, Suitelet, Scheduled, and Map/Reduce script types",
        "Build customisation features supporting Order-to-Cash and Procure-to-Pay processes, including transaction-level validation, automation, and downstream processing logic",
        "Design and implement a Withholding Tax application to support statutory tax handling within transaction workflows",
        "Architect an approval workflow system with exception handling routed to a queryable custom record, ensuring failures never block core transaction processing",
        "Extend transactions using linked custom records rather than direct field additions, preserving transaction integrity and supporting one-to-many data relationships",
        "Build a reusable popup selector framework capable of handling 50,000+ option datasets through a shared Suitelet and provider pattern",
        "Develop a custom autocomplete field solution using INLINEHTML and Client Script",
        "Migrate legacy SuiteScript 1.0 customisations to SuiteScript 2.1",
      ],
    },
    {
      title: "System Integration",
      items: [
        "Implement a bank EFT Host-to-Host integration covering SFTP connectivity, PGP encryption, FreeMarker file templating, and outbound IP whitelisting configuration",
        "Build high-volume data export integrations to SFTP, applying date-based chunking and Map/Reduce parallel processing to handle datasets exceeding one million records within platform governance limits",
        "Develop REST Web Services workflows for custom record creation and updates",
      ],
    },
    {
      title: "Reporting & Data",
      items: [
        "Build custom saved searches and SuiteQL queries to support operational and management reporting",
        "Optimise search design for large datasets — evaluating aggregation usage and field-level joins to maintain query performance at scale",
        "Develop Advanced PDF/HTML templates for transaction documents",
        "Implement saved search enhancements including dynamic HTML rendering and mass update procedures",
      ],
    },
    {
      title: "Engineering Practices",
      items: [
        "Maintain Git-based version control and CI/CD pipelines for SuiteScript SDF projects, supporting multi-developer workflows through a structured branching strategy",
        "Build reusable components and frameworks to reduce duplication across client implementations",
        "Document solution designs, workflow logic, and technical specifications for client and internal handover",
      ],
    },
    {
      title: "Troubleshooting & Support",
      items: [
        "Diagnose and resolve defects across Sandbox and Production environments, including environment behaviour discrepancies, script governance limits, and platform-level constraints",
        "Support UAT cycles and post-deployment stabilisation",
      ],
    },
  ] satisfies Group[],
  tags: [
    "Oracle NetSuite",
    "SuiteScript 2.1",
    "SuiteQL",
    "Map/Reduce",
    "REST Web Services",
    "SFTP & PGP",
    "FreeMarker",
    "SDF · Git · CI/CD",
  ],
};

export const internship = {
  title: "Student Intern",
  org: "BlackOak Consulting Sdn Bhd",
  place: "Subang Jaya",
  period: { start: "Nov 2024", end: "Apr 2025" },
  tags: ["Work-based Learning"],
};

export const codeInstructor = {
  title: "Code Instructor",
  employment: "Part-Time",
  org: "Codekidz by EduWel Sdn. Bhd.",
  place: "Kuala Lumpur",
  period: { start: "Jul 2023", end: "Jan 2024" },
  bullets: [
    "Designed and delivered coding lessons for primary and secondary school students.",
    "Taught with age-appropriate programming languages such as Scratch and Python.",
    "Ran a curriculum focused on fundamental coding concepts, problem-solving and algorithmic thinking.",
  ],
  tags: ["Scratch", "Python", "Teaching", "Curriculum"],
};

export const programmeRep = {
  title: "Programme Representative",
  org: "Faculty of Computing and Information Technology (FOCS), TARUMT",
  period: { start: "Jun 2022", end: "2025" },
  bullets: [
    "Helped the faculty communicate and deliver information to students.",
    "Raised students' opinions and feedback with faculty management.",
  ],
};

export const weiqiClub = {
  title: "Secretary, Weiqi Club",
  org: "TARUMT",
  period: { start: "Jun 2022", end: "Oct 2022" },
  bullets: [
    "Assisted the President in completing the club's registration forms.",
    "Competed in the Confucius Cup Weiqi Competition (2022).",
  ],
};

export const degree = {
  title: "Bachelor of Computer Science (Honours) in Data Science",
  period: { start: "Jun 2022", end: "Jun 2025" },
  cgpa: "3.8131",
};

export const foundation = {
  title: "Foundation in Computing",
  period: { start: "2021", end: "2022" },
  cgpa: "3.8088",
};

export const netsuiteSkills = [
  "SuiteScript 2.1",
  "Map/Reduce",
  "Suitelet & Client Script",
  "SuiteQL",
  "Saved Searches",
  "Advanced PDF/HTML",
  "REST Web Services",
  "SDF",
  "Order-to-Cash",
  "Procure-to-Pay",
];

export const integrationSkills = [
  "SFTP",
  "PGP Encryption",
  "FreeMarker",
  "Git",
  "CI/CD",
  "Business Process Automation",
];

export const programmingLanguages = ["Python", "Java", "SQL"];
export const spokenLanguages = ["English", "Chinese"];
