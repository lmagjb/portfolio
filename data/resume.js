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
    "IT student who builds web and mobile apps with React, Node.js, Laravel, React Native, and Jetpack Compose. " +
    "Co-authored an HCI research paper on AGRITrend, a marketplace app for farmers and vendors in Quezon Province, " +
    "covering user interviews, prototyping, and usability testing.",

  stats: [
    { value: "{certs}", label: "Certificates" },
    { value: "{issuers}", label: "Issuers (Meta, IBM, Google, Cisco...)" },
    { value: "4", label: "Projects built" },
    { value: "1", label: "HCI research paper" }
  ],

  // Skill groups. Add level: 0-100 to every item in a group to show progress bars instead of tags.
  skills: [
    { group: "Web Development", items: [
      { name: "React" }, { name: "Node.js & Express" }, { name: "Laravel & PHP" },
      { name: "Django & Python" }, { name: "HTML / CSS / JavaScript" }, { name: "Webpack & Babel" }
    ]},
    { group: "Mobile Development", items: [
      { name: "React Native" }, { name: "Kotlin / Jetpack Compose" }, { name: "Flutter & Dart" }, { name: "Android Studio" }
    ]},
    { group: "Databases", items: [
      { name: "MySQL" }, { name: "MongoDB" }, { name: "Firebase Firestore" }, { name: "SQL" }
    ]},
    { group: "Tools, Systems & Languages", items: [
      { name: "Linux shell" }, { name: "Cisco networking (CCNAv7)" }, { name: "Java (OOP)" },
      { name: "Figma" }, { name: "Canva" }, { name: "XAMPP" },
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

  projects: [
    {
      name: "AGRITrend",
      description: "Mobile marketplace app connecting farmers and vendors in Quezon Province. Started as CropMart and became the subject of an HCI research paper.",
      tags: ["Firebase Firestore", "Node.js", "Design Thinking", "Usability testing"],
      link: ""
    },
    {
      name: "CropMart",
      description: "The Android marketplace app that later became AGRITrend. Redesigned the UI from a Figma mockup and split the code into files by feature.",
      tags: ["Kotlin", "Jetpack Compose", "Figma"],
      link: ""
    },
    {
      name: "FreelancerHub",
      description: "Full-stack web app: a five-page React front end with sign-up and login, connected to an Express and MongoDB back end.",
      tags: ["React", "Node.js", "Express", "MongoDB"],
      link: ""
    },
    {
      name: "Hotel Room Billing App",
      description: "React app with a custom Webpack and Babel build set up from scratch to meet the course's required folder structure.",
      tags: ["React", "Webpack", "Babel"],
      link: ""
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
