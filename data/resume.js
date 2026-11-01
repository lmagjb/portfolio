/*
  ============================================================
  RESUME CONTENT  -  edit this file to change the site's text.
  Source: your two Canva resumes (read 2026-11-01).
  ============================================================
*/
window.RESUME = {
  name: "John Benedict R. De Chavez",
  handle: "jbdechavez",                     // used in the terminal prompt
  title: "IT Student | Web & Mobile Developer",
  location: "Lucena City, Philippines",
  languages: "Filipino (native), English (fluent)",

  // One or two sentences for the top of the home page
  pitch: "A full-stack web and mobile developer and BS Information Technology student. I build complete applications, from the database and API to the web and mobile screens, using Next.js, React, Node.js, SwiftUI and Jetpack Compose. I also run user research and usability tests, and I hold certifications from Meta, IBM, Google and Cisco.",

  // The short list of tools shown on the home page (full list is on the About page)
  coreTech: ["Next.js", "React", "TypeScript", "Node.js", "MySQL", "SwiftUI", "Jetpack Compose", "React Native", "Firebase", "Laravel"],
  email: "lmagjb123@gmail.com",
  phone: "",                                // left off the public site on purpose; add it if you want it shown
  photo: "assets/photo.jpg",                // save your photo here; it's hidden until the file exists
  resumePdf: "assets/resume.pdf",           // save your Canva resume PDF here; the button hides until it exists
  // Certificates are read live from this GitHub repo on every visit.
  // Add a file to the repo and it shows up on the site, no redeploy needed.
  certificateSource: {
    owner: "lmagjb",
    repo: "certificates",
    branch: "main",
    folder: ""          // "" = files at the repo root; or e.g. "certs"
  },

  links: {
    github: "https://github.com/lmagjb",
    linkedin: ""
  },

  // Lines typed out in the hero terminal
  terminalIntro: [
    "whoami",
    "cat summary.txt",
  ],

  summary:
    "IT student who builds web and mobile apps with Next.js, React, SwiftUI, Jetpack Compose, and React Native. " +
    "Built HAKBANG, a teacher promotion scoring system for DepEd, and ShelfLife, an iOS expiry and warranty tracker. " +
    "Co-authored an HCI research paper on AGRITrend, a marketplace app for farmers and vendors in Quezon Province, " +
    "covering user interviews, prototyping, and usability testing.",

  stats: [
    { value: "{certs}", label: "Certificates" },
    { value: "{issuers}", label: "Issuers (Meta, IBM, Google, Cisco...)" },
    { value: "{projects}", label: "Projects" },
    { value: "1", label: "HCI research paper" }
  ],

  // Skill groups. Add level: 0-100 to every item in a group to show progress bars instead of tags.
  skills: [
    { group: "Web Development", items: [
      { name: "React" }, { name: "Next.js" }, { name: "TypeScript" }, { name: "Tailwind CSS" }, { name: "Node.js & Express" }, { name: "Laravel & PHP" },
      { name: "Django & Python" }, { name: "HTML / CSS / JavaScript" }, { name: "Webpack & Babel" }
    ]},
    { group: "Mobile Development", items: [
      { name: "Swift & SwiftUI" }, { name: "React Native & Expo" }, { name: "Kotlin / Jetpack Compose" }, { name: "Flutter & Dart" }, { name: "Android Studio" }
    ]},
    { group: "Databases", items: [
      { name: "MySQL" }, { name: "MongoDB" }, { name: "Firebase Firestore" }, { name: "SQL" }
    ]},
    { group: "Tools, Systems & Languages", items: [
      { name: "C++" }, { name: "Linux shell" }, { name: "Cisco networking (CCNAv7)" }, { name: "Java (OOP)" },
      { name: "Figma" }, { name: "Xcode" }, { name: "Canva" }, { name: "XAMPP" },
      { name: "Filipino (native)" }, { name: "English (fluent)" }
    ]}
  ],

  // Research and work history, newest first
  experience: [
    {
      role: "Co-author, HCI research paper",
      company: "AGRITrend",
      period: "Manuel S. Enverga University Foundation",
      points: [
        "Wrote an HCI paper using Design Thinking, with 8 user interviews and SUS usability testing.",
        "Built prototype screens for onboarding, marketplace, vendor dashboard, and KYC verification.",
        "Wrote a Node.js script to bulk-import product data into Firebase Firestore."
      ]
    }
  ],

  // Projects, most important first. Each one gets its own page: project.html?id=<id>
  // type: used for the filter on the Projects page.
  // links: live demo and/or public code. Private repos get no code link (visitors would see a 404).
  projects: [
    {
      id: "hakbang",
      name: "HAKBANG",
      subtitle: "Teacher promotion scoring system for DepEd (formerly EvalPro)",
      type: "Web & Mobile",
      year: "2026",
      featured: true,
      role: "Full-stack developer",
      summary: "Scores teacher promotion applications out of 100 under DepEd Order No. 024, s. 2025, and runs the full eight-stage approval workflow.",
      description: "Teachers applying for reclassification go through classroom observation, portfolio assessment, board deliberation and final approval, and each step used to be tracked on paper and spreadsheets. HAKBANG puts the whole process in one system. It follows the Order's own rubrics to compute each applicant's Comparative Assessment Result, so no one types points by hand.",
      highlights: [
        "Eight-stage workflow with a role for each office: teacher, principal, AO II, PSDS, HR, Division Secretariat and SDS.",
        "Computes Education, Training, Experience, Performance, COI and NCOI scores to three decimal places, with rules that change by position applied for.",
        "Checked against seven real Form 2-A submissions from Lucena East III Elementary School: all 14 Education/Training/Experience values and all 11 COI/NCOI values matched.",
        "Reads uploaded documents with OCR (Tesseract) and generates a gap analysis for each teacher, with an optional AI-written summary in English or Filipino.",
        "Web app (Next.js) and mobile app (Expo / React Native) share one API; MySQL database on AWS RDS with versioned migrations."
      ],
      tags: ["Next.js", "TypeScript", "React", "MySQL", "NextAuth", "Tailwind CSS", "Expo / React Native", "Tesseract OCR", "AWS RDS"],
      links: [{ label: "Visit live site", url: "https://hakbang-deped.vercel.app" }],
      note: "Earlier versions: a clickable Figma prototype, then a first Next.js build with team 6bitLite."
    },
    {
      id: "shelflife",
      name: "ShelfLife",
      subtitle: "iOS app for expiry dates, return windows and warranties",
      type: "Mobile",
      year: "2026",
      featured: true,
      role: "Designer and iOS developer",
      summary: "Tracks food expiry, return windows and warranties in one feed, and suggests recipes for food that's about to expire.",
      description: "Food goes bad and warranties lapse because the dates live in different places. ShelfLife keeps them together: everything you add lands on a Pantry or Purchases shelf, and one \"Expiring Soon\" feed shows what needs attention first.",
      highlights: [
        "Pantry and Purchases shelves with search, plus a unified \"Expiring Soon\" feed.",
        "Recipe suggestions that use the food closest to expiring.",
        "Insights screen and item detail pages for food and purchases.",
        "Sign-in with Firebase Authentication; items sync to Cloud Firestore.",
        "Designed first as a seven-screen clickable HTML prototype, including a scan-to-add flow, then built in SwiftUI."
      ],
      tags: ["Swift", "SwiftUI", "Firebase Auth", "Cloud Firestore", "Combine"],
      links: [{ label: "View code on GitHub", url: "https://github.com/lmagjb/ShelfLife" }]
    },
    {
      id: "agritrend",
      name: "AGRITrend",
      subtitle: "Marketplace for farmers and vendors in Quezon Province",
      type: "Research",
      year: "2026",
      featured: true,
      role: "UX researcher and developer (HCI paper co-author)",
      summary: "A farmer-to-vendor marketplace I researched, prototyped and tested with real users for my HCI paper.",
      description: "AGRITrend connects farmers in Quezon Province with vendors who buy their harvest. I co-authored the HCI research paper behind it, using Design Thinking, and built both a web prototype and an Android admin app.",
      highlights: [
        "Ran 8 user interviews and measured usability with the System Usability Scale (SUS).",
        "Built a 12-screen web prototype: farmer dashboard, harvest listings, price explorer, buyer requests, chat, sales history and more.",
        "Built an Android admin app in Kotlin and Jetpack Compose for managing products, prices and an activity log.",
        "Wrote a Node.js script to bulk-import product data into Firebase Firestore."
      ],
      tags: ["Design Thinking", "Usability testing", "HTML", "CSS", "JavaScript", "Kotlin", "Jetpack Compose", "Firebase Firestore"],
      links: [{ label: "View prototype code", url: "https://github.com/lmagjb/HTML" }]
    },
    {
      id: "cropmart",
      name: "CropMart",
      subtitle: "Android marketplace app",
      type: "Mobile",
      year: "",
      role: "Android developer",
      summary: "The Android marketplace app that later became AGRITrend.",
      description: "CropMart was the first version of the farmer marketplace that grew into AGRITrend.",
      highlights: [
        "Redesigned the UI from a Figma mockup.",
        "Split the code into files by feature to make it easier to work on."
      ],
      tags: ["Kotlin", "Jetpack Compose", "Figma"],
      links: []
    },
    {
      id: "freelancerhub",
      name: "FreelancerHub",
      subtitle: "Full-stack web app",
      type: "Web",
      year: "",
      role: "Full-stack developer",
      summary: "A five-page React app with sign-up and login, backed by Express and MongoDB.",
      description: "FreelancerHub is a full-stack MERN project: a React front end that talks to an Express API with a MongoDB database.",
      highlights: [
        "Five-page React front end with sign-up and login.",
        "Express and MongoDB back end handling accounts and data."
      ],
      tags: ["React", "Node.js", "Express", "MongoDB"],
      links: []
    },
    {
      id: "hotel-billing",
      name: "Hotel Room Billing App",
      subtitle: "React app with a hand-built build setup",
      type: "Web",
      year: "",
      role: "Front-end developer",
      summary: "A React billing app with a custom Webpack and Babel build set up from scratch.",
      description: "The course required a specific folder structure, so instead of a starter template I set up the Webpack and Babel build myself.",
      highlights: [
        "Configured Webpack and Babel from scratch.",
        "Matched the course's required folder structure."
      ],
      tags: ["React", "Webpack", "Babel"],
      links: []
    },
    {
      id: "web-coursework",
      name: "Web Development coursework",
      subtitle: "Class projects in HTML, CSS and Bootstrap",
      type: "Coursework",
      year: "2025",
      role: "Student",
      summary: "A 100+ page fan wiki, a Bootstrap laptop store, a tax calculator and my first portfolio.",
      description: "Work from my web development class, from my first web page to multi-page sites.",
      highlights: [
        "Cookie Run: Kingdom fan wiki with over 100 linked pages for characters, skills, builds and stories.",
        "NovaLaptops, a Bootstrap store with home, product, login, about and privacy pages.",
        "A tax calculator in JavaScript and my first portfolio site."
      ],
      tags: ["HTML", "CSS", "Bootstrap", "JavaScript"],
      links: []
    },
    {
      id: "swiftui-practice",
      name: "SwiftUI practice apps",
      subtitle: "Small iOS apps written while learning SwiftUI",
      type: "Coursework",
      year: "2026",
      role: "Student",
      summary: "From Hello World to the first version of ShelfLife.",
      description: "A set of small apps I built while learning Swift and SwiftUI in Xcode.",
      highlights: [
        "Hello World, greeting and activity apps to learn layout and state.",
        "A portfolio screen and the first version of ShelfLife's onboarding."
      ],
      tags: ["Swift", "SwiftUI", "Xcode"],
      links: []
    },
    {
      id: "cpp-dsa",
      name: "Data Structures in C++",
      subtitle: "Exercises from my data structures class",
      type: "Coursework",
      year: "2024",
      role: "Student",
      summary: "A CRUD program for a ranked anime list, a calculator and an order-processing exercise.",
      description: "C++ exercises written for my data structures and algorithms class.",
      highlights: [
        "CRUD program that stores a ranked anime list in vectors and sorts it.",
        "Calculator and an order-processing exercise."
      ],
      tags: ["C++", "Vectors", "Sorting", "CRUD"],
      links: [{ label: "View code on GitHub", url: "https://github.com/lmagjb/Data-Structure-and-Algorithm" }]
    }
  ],

  education: [
    {
      degree: "BS Information Technology",
      school: "Manuel S. Enverga University Foundation",
      period: "Currently enrolled"
    },
    {
      degree: "Basic Education",
      school: "Quezon National High School · East VII Elementary School",
      period: "High school & elementary"
    }
  ]
};
