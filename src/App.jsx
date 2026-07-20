import { useEffect, useRef, useState } from 'react'
import './App.css'

const TERMINAL_LINES = [
  { cmd: 'whoami', out: 'lmagjb — developer & CS student' },
  { cmd: 'cat location.txt', out: 'Quezon Province, Philippines' },
  { cmd: 'cat focus.txt', out: 'mobile  ·  web  ·  HCI research' },
]

const STACK = [
  {
    dir: 'mobile/',
    items: ['Kotlin', 'Jetpack Compose', 'Android Studio'],
  },
  {
    dir: 'web/',
    items: ['React', 'Node.js', 'Express', 'MongoDB', 'Webpack'],
  },
  {
    dir: 'research/',
    items: ['Design Thinking', 'SUS evaluation', 'IEEE-format papers'],
  },
]

const PROJECTS = [
  {
    hash: 'a7f3c2d',
    name: 'AGRITrend',
    desc: 'B2B agricultural marketplace app for farmers, vendors, and admins in Quezon Province — built alongside an HCI research paper using the Design Thinking framework.',
    tags: ['Mobile prototype', 'Firebase', 'UX research'],
  },
  {
    hash: 'e19b6f0',
    name: 'FreelancerHub',
    desc: 'Full-stack freelance marketplace with a five-page React SPA and an authentication flow, backed by Express and MongoDB.',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    hash: '5d8a41c',
    name: 'Hotel Room Billing',
    desc: 'React app for hotel room billing, built and shipped as an academic submission with a custom Webpack/Babel setup.',
    tags: ['React', 'Webpack'],
  },
  {
    hash: '2c9f7ab',
    name: 'NavApp',
    desc: 'Android app demonstrating multi-screen navigation, built with Jetpack Compose.',
    tags: ['Kotlin', 'Jetpack Compose'],
  },
]

function useTypedLines(lines, active) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    if (!active || done >= lines.length) return
    const t = setTimeout(() => setDone((d) => d + 1), 420)
    return () => clearTimeout(t)
  }, [active, done, lines.length])

  return done
}

function Terminal() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const shown = useTypedLines(TERMINAL_LINES, active)

  return (
    <div className="terminal" ref={ref}>
      <div className="terminal__bar">
        <span className="terminal__dot" />
        <span className="terminal__dot" />
        <span className="terminal__dot" />
        <span className="terminal__title">guest@lmagjb — ~</span>
      </div>
      <div className="terminal__body">
        {TERMINAL_LINES.slice(0, shown).map((line, i) => (
          <div className="terminal__block" key={line.cmd}>
            <p className="terminal__line">
              <span className="terminal__prompt">$</span> {line.cmd}
            </p>
            <p className="terminal__out">{line.out}</p>
            {i === shown - 1 && shown < TERMINAL_LINES.length && (
              <span className="terminal__cursor" aria-hidden="true" />
            )}
          </div>
        ))}
        {shown >= TERMINAL_LINES.length && (
          <span className="terminal__cursor terminal__cursor--idle" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}

function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" href="#top">
        lmagjb<span className="nav__brand-blink">_</span>
      </a>
      <nav className="nav__links">
        <a href="#about">about</a>
        <a href="#stack">stack</a>
        <a href="#projects">projects</a>
        <a href="#contact">contact</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__copy">
        <p className="eyebrow">// build log</p>
        <h1>
          I build things for
          <br />
          <span className="hero__accent">mobile, web, and people.</span>
        </h1>
        <p className="hero__sub">
          A CS student shipping practical software — marketplaces, billing
          systems, navigation flows — and documenting the research behind
          them along the way.
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#projects">
            view projects
          </a>
          <a className="btn btn--ghost" href="#contact">
            get in touch
          </a>
        </div>
      </div>
      <Terminal />
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <p className="eyebrow">// about</p>
      <p className="about__text">
        I'm a computer science student based in Quezon Province, Philippines,
        working across three registers at once: native mobile with Kotlin and
        Jetpack Compose, full-stack web with React and Node, and the
        human-computer interaction research that explains why any of it
        matters. Most of what I build starts as coursework and ends up as
        something I'd actually hand to a real user — farmers, vendors,
        freelancers, front-desk staff.
      </p>
    </section>
  )
}

function Stack() {
  return (
    <section id="stack" className="section">
      <p className="eyebrow">// stack</p>
      <p className="section__cmd">
        <span className="terminal__prompt">$</span> ls stack/
      </p>
      <div className="stack-grid">
        {STACK.map((group) => (
          <div className="stack-card" key={group.dir}>
            <p className="stack-card__dir">{group.dir}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <p className="eyebrow">// projects</p>
      <p className="section__cmd">
        <span className="terminal__prompt">$</span> git log --oneline
      </p>
      <ol className="log">
        {PROJECTS.map((p) => (
          <li className="log__entry" key={p.hash}>
            <div className="log__meta">
              <span className="log__hash">{p.hash}</span>
              <span className="log__rule" aria-hidden="true" />
            </div>
            <div className="log__content">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="log__tags">
                {p.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section section--contact">
      <p className="eyebrow">// contact</p>
      <p className="section__cmd">
        <span className="terminal__prompt">$</span> cat contact.txt
      </p>
      <div className="contact-card">
        <a className="contact-row" href="mailto:you@example.com">
          <span>email</span>
          <span>you@example.com</span>
        </a>
        <a
          className="contact-row"
          href="https://github.com/yourusername"
          target="_blank"
          rel="noreferrer"
        >
          <span>github</span>
          <span>github.com/yourusername</span>
        </a>
        <a
          className="contact-row"
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noreferrer"
        >
          <span>linkedin</span>
          <span>linkedin.com/in/yourusername</span>
        </a>
      </div>
      <p className="contact-note">
        (edit these in <code>src/App.jsx</code> before you deploy)
      </p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} lmagjb</span>
      <span>built with React + Vite · deployed on Vercel</span>
    </footer>
  )
}

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
