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

  // Projects, most important first. Read from github.com/lmagjb repos on 2026-11-01.
  // featured: true highlights a card. links: live demo / public code (private repos have no code link).
  projects: [
    {
      name: "HAKBANG (formerly EvalPro)",
      featured: true,
      year: "2026",
      description: "Teacher promotion scoring system built on DepEd Order No. 024, s. 2025. It takes a reclassification application through an eight-stage approval workflow (principal, AO II, PSDS, HR, Secretariat, SDS) and scores it out of 100 using the Order's rubrics. Checked against seven real Form 2-A submissions: all 14 Education/Training/Experience values and all 11 COI/NCOI values matched. Has a web app and a mobile app that share one API.",
      tags: ["Next.js", "TypeScript", "MySQL", "NextAuth", "Tailwind", "Expo / React Native", "Tesseract OCR"],
      links: [{ label: "Live site", url: "https://evalpro2.vercel.app" }],
      note: "Earlier versions: a Figma prototype and the first Next.js build made with team 6bitLite."
    },
    {
      name: "ShelfLife",
      featured: true,
      year: "2026",
      description: "iOS app that tracks food expiry dates, return windows and warranties in one place. Items go to a Pantry or Purchases shelf, an \"Expiring Soon\" feed shows what needs attention, and it suggests recipes that use food about to expire. Sign-in and data sync use Firebase.",
      tags: ["Swift", "SwiftUI", "Firebase Auth", "Firestore"],
      links: [{ label: "Code", url: "https://github.com/lmagjb/ShelfLife" }],
      note: "Started as a clickable HTML prototype with seven screens, including a scan-to-add flow."
    },
    {
      name: "AGRITrend",
      featured: true,
      year: "2026",
      description: "Marketplace for farmers and vendors in Quezon Province and the subject of my HCI research paper. I built a 12-screen web prototype (farmer dashboard, harvest listings, price explorer, buyer requests, chat, sales history) and an Android admin app for managing products, prices and activity logs.",
      tags: ["HTML", "CSS", "JavaScript", "Kotlin", "Jetpack Compose", "Firebase Firestore"],
      links: [{ label: "Prototype code", url: "https://github.com/lmagjb/HTML" }]
    },
    {
      name: "CropMart",
      year: "",
      description: "The Android marketplace app that later became AGRITrend. Redesigned the UI from a Figma mockup and split the code into files by feature.",
      tags: ["Kotlin", "Jetpack Compose", "Figma"],
      links: []
    },
    {
      name: "FreelancerHub",
      year: "",
      description: "Full-stack web app: a five-page React front end with sign-up and login, connected to an Express and MongoDB back end.",
      tags: ["React", "Node.js", "Express", "MongoDB"],
      links: []
    },
    {
      name: "Hotel Room Billing App",
      year: "",
      description: "React app with a custom Webpack and Babel build set up from scratch to meet the course's required folder structure.",
      tags: ["React", "Webpack", "Babel"],
      links: []
    },
    {
      name: "Web Development coursework",
      year: "2025",
      description: "Projects from my web development class: a Cookie Run: Kingdom fan wiki with over 100 linked pages, NovaLaptops (a Bootstrap laptop store with product, login and about pages), a tax calculator, and my first portfolio site.",
      tags: ["HTML", "CSS", "Bootstrap", "JavaScript"],
      links: []
    },
    {
      name: "SwiftUI practice apps",
      year: "2026",
      description: "A set of small iOS apps written while learning SwiftUI, from Hello World and a greeting app to a portfolio screen and the first version of ShelfLife.",
      tags: ["Swift", "SwiftUI", "Xcode"],
      links: []
    },
    {
      name: "Data Structures in C++",
      year: "2024",
      description: "C++ exercises for my data structures class, including a CRUD program that manages a ranked anime list with vectors and sorting, and a calculator.",
      tags: ["C++", "Vectors", "Sorting", "CRUD"],
      links: [{ label: "Code", url: "https://github.com/lmagjb/Data-Structure-and-Algorithm" }]
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
