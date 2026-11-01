/*
  Shared code for every page. Each page's <body data-page="..."> picks what to draw.
  Content comes from data/resume.js; certificates load live via certificates-live.js.
  You should not need to edit this file to change content.
*/
(function () {
  const R = window.RESUME || {};
  const PROJECTS = R.projects || [];
  const page = document.body.dataset.page;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tags = (list, max) => {
    const s = list || [];
    const shown = max ? s.slice(0, max) : s;
    const more = max && s.length > max ? `<span class="tag">+${s.length - max}</span>` : "";
    return s.length ? `<div class="tags">${shown.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${more}</div>` : "";
  };
  const fmtDate = (d) => {
    if (!d) return "";
    const [y, m] = String(d).split("-");
    if (!m) return y;
    return new Date(Number(y), Number(m) - 1).toLocaleString("en", { month: "short", year: "numeric" });
  };
  const projectUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;

  /* ---------- Header & footer (same on every page) ---------- */
  const NAV = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["projects.html", "Projects", "projects"],
    ["certificates.html", "Certificates", "certificates"],
    ["contact.html", "Contact", "contact"]
  ];
  const navPage = page === "project" ? "projects" : page;
  $("#site-header").innerHTML = `
    <header class="nav">
      <a href="index.html" class="logo">${esc(R.name || "Portfolio")}</a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
      <nav>${NAV.map(([href, label, key]) =>
        `<a href="${href}"${key === navPage ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    </header>`;
  $("#site-footer").innerHTML = `
    <footer class="footer">
      <span>&copy; ${new Date().getFullYear()} ${esc(R.name || "")}</span>
      <span class="footer-links">
        ${R.email ? `<a href="mailto:${esc(R.email)}">${esc(R.email)}</a>` : ""}
        ${R.links?.github ? `<a href="${esc(R.links.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
        ${R.links?.linkedin ? `<a href="${esc(R.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
      </span>
    </footer>`;
  const toggle = $(".nav-toggle"), nav = $(".nav nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  const resumeButton = (cls = "btn") => R.resumePdf
    ? `<a class="${cls} resume-btn" href="${esc(R.resumePdf)}" download>Download resume</a>` : "";
  // Hide resume buttons if the PDF isn't there (can't check when opened from disk)
  function checkResume() {
    if (!R.resumePdf || location.protocol === "file:") return;
    fetch(R.resumePdf, { method: "HEAD" }).then((r) => {
      if (!r.ok) document.querySelectorAll(".resume-btn").forEach((b) => b.remove());
    }).catch(() => {});
  }

  /* ---------- Project cards ---------- */
  const projectCard = (p) => `
    <a class="card project-card reveal${p.featured ? " featured" : ""}" href="${projectUrl(p)}">
      <div class="card-top"><span class="type">${esc(p.type || "")}</span>${p.year ? `<span class="muted card-year">${esc(p.year)}</span>` : ""}</div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.summary || p.description)}</p>
      ${tags(p.tags, 4)}
      <span class="card-more">View project →</span>
    </a>`;

  /* ---------- Certificates ---------- */
  const live = window.CertificatesLive;
  const certsLoaded = live ? live.load().catch((e) => { console.error(e); return []; }) : Promise.resolve([]);
  let CERTS = [];
  const thumbIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      thumbIo.unobserve(en.target);
      const c = CERTS[Number(en.target.dataset.index)];
      const box = $(".cert-thumb", en.target);
      live.preview(c, 520).then((url) => {
        const img = new Image();
        img.alt = `${c.title} certificate`;
        img.src = url;
        $(".loading", box)?.replaceWith(img);
      }).catch(() => {
        const l = $(".loading", box);
        if (l) l.textContent = c.isPdf ? "PDF" : "File";
      });
    });
  }, { rootMargin: "300px" });

  function drawCerts(grid, list) {
    grid.innerHTML = list.map((c) => `
      <button class="cert" data-index="${CERTS.indexOf(c)}">
        <div class="cert-thumb"><span class="pdf loading">Loading…</span><span class="cert-cat">${esc(c.category || "")}</span></div>
        <div class="cert-info">
          <h3>${esc(c.title)}</h3>
          <div class="meta">${esc([c.issuer, fmtDate(c.date)].filter(Boolean).join(" · "))}</div>
          ${tags(c.skills, 3)}
        </div>
      </button>`).join("");
    grid.querySelectorAll(".cert").forEach((el) => thumbIo.observe(el));
    grid.onclick = (e) => {
      const card = e.target.closest(".cert");
      if (card) openCert(CERTS[Number(card.dataset.index)]);
    };
  }

  function openCert(c) {
    const modal = $("#modal");
    $("#modal-content").innerHTML = `
      <div class="modal-media"><span class="pdf">Loading…</span></div>
      <h3>${esc(c.title)}</h3>
      <div class="muted">${esc([c.issuer, fmtDate(c.date), c.credentialId ? `ID ${c.credentialId}` : ""].filter(Boolean).join(" · "))}</div>
      ${tags(c.skills)}
      <p class="btn-row">
        <a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener">Open file</a>
        ${c.verifyUrl ? `<a class="btn primary" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener">Verify credential</a>` : ""}
      </p>`;
    live.preview(c, 1400).then((url) => {
      const box = $("#modal-content .modal-media");
      if (box) box.innerHTML = `<img src="${esc(url)}" alt="${esc(c.title)} certificate">`;
    }).catch(() => {
      const box = $("#modal-content .modal-media .pdf");
      if (box) box.textContent = "Preview unavailable. Use Open file.";
    });
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    $(".modal-close").focus();
  }
  function setupModal() {
    const modal = $("#modal");
    if (!modal) return;
    const close = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      $("#modal-content").innerHTML = "";
    };
    $(".modal-close").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- Pages ---------- */
  const pages = {};

  pages.home = function () {
    $("#hero-name").textContent = R.name || "";
    $("#hero-title").textContent = R.title || "";
    $("#hero-pitch").textContent = R.pitch || "";
    $("#hero-actions").innerHTML = `
      <a class="btn primary" href="projects.html">See my projects</a>
      <a class="btn" href="contact.html">Contact me</a>
      ${resumeButton("btn ghost")}`;
    const avatar = $("#avatar");
    if (R.photo) {
      avatar.onload = () => { avatar.hidden = false; };
      avatar.alt = `Photo of ${R.name || ""}`;
      avatar.src = R.photo;
    }

    // Stats
    const renderStats = (counts) => {
      $("#stats").innerHTML = (R.stats || []).map((s) => {
        const v = String(s.value).replace(/\{(\w+)\}/g, (m, k) => counts[k] ?? "…");
        return `<div class="stat"><div class="stat-value">${esc(v)}</div><div class="stat-label">${esc(s.label)}</div></div>`;
      }).join("");
    };
    renderStats({ projects: PROJECTS.length });

    // Core tech: the short list from resume.js
    $("#core-tech").innerHTML = tags(R.coreTech || []);

    // Featured projects only
    $("#featured-projects").innerHTML = PROJECTS.filter((p) => p.featured).slice(0, 3).map(projectCard).join("");

    // Latest certificates
    certsLoaded.then((list) => {
      CERTS = list;
      const issuers = new Set(list.map((c) => String(c.issuer || "").replace(/\s*\(.*\)$/, "")).filter(Boolean));
      renderStats({ projects: PROJECTS.length, certs: list.length, issuers: issuers.size });
      $("#cert-link").textContent = list.length ? `See all ${list.length} →` : "See all →";
      drawCerts($("#latest-certs"), list.slice(0, 3));
    });

    typeTerminal();
  };

  pages.about = function () {
    $("#about-summary").textContent = R.summary || "";
    const avatar = $("#avatar");
    if (R.photo) {
      avatar.onload = () => { avatar.hidden = false; };
      avatar.alt = `Photo of ${R.name || ""}`;
      avatar.src = R.photo;
    }
    $("#about-facts").innerHTML = [
      R.location && ["Based in", R.location],
      (R.education || [])[0] && ["Studying", `${R.education[0].degree}, ${R.education[0].school}`],
      R.languages && ["Languages", R.languages]
    ].filter(Boolean).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("#skills-grid").innerHTML = (R.skills || []).map((g) => `
      <div class="skill-group reveal">
        <h3>${esc(g.group)}</h3>
        ${tags(g.items.map((s) => s.name))}
      </div>`).join("");
    $("#timeline").innerHTML = (R.experience || []).map((j) => `
      <div class="job reveal">
        <h3>${esc(j.role)} <span class="accent">· ${esc(j.company)}</span></h3>
        <div class="meta">${esc(j.period)}</div>
        <ul>${(j.points || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>`).join("");
    $("#education").innerHTML = (R.education || []).map((e) => `
      <div class="edu reveal"><strong>${esc(e.degree)}</strong><span class="muted">${esc(e.school)} · ${esc(e.period)}</span></div>`).join("");
    $("#about-actions").innerHTML = `<a class="btn primary" href="projects.html">See my projects</a>${resumeButton()}`;
  };

  pages.projects = function () {
    const types = ["All", ...new Set(PROJECTS.map((p) => p.type).filter(Boolean))];
    let active = "All";
    const draw = () => {
      $("#project-filters").innerHTML = types.map((t) =>
        `<button class="filter${t === active ? " active" : ""}" data-type="${esc(t)}">${esc(t)}</button>`).join("");
      const list = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === active);
      $("#project-cards").innerHTML = list.map(projectCard).join("");
      observeReveal();
    };
    $("#project-filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      active = b.dataset.type;
      draw();
    });
    draw();
  };

  pages.project = function () {
    const id = new URLSearchParams(location.search).get("id");
    const i = PROJECTS.findIndex((p) => p.id === id);
    const p = PROJECTS[i];
    if (!p) {
      $("#project").innerHTML = `<h1>Project not found</h1><p><a href="projects.html">← Back to all projects</a></p>`;
      return;
    }
    document.title = `${p.name} | ${R.name || "Portfolio"}`;
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    const links = (p.links || []).map((l, n) =>
      `<a class="btn${n === 0 ? " primary" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
    $("#project").innerHTML = `
      <a class="back" href="projects.html">← All projects</a>
      <div class="project-head">
        <span class="type">${esc(p.type || "")}</span>
        <h1>${esc(p.name)}</h1>
        ${p.subtitle ? `<p class="lead">${esc(p.subtitle)}</p>` : ""}
        ${links ? `<div class="btn-row">${links}</div>` : ""}
      </div>
      <div class="project-body">
        <div class="project-main">
          <h2>Overview</h2>
          <p>${esc(p.description || p.summary)}</p>
          ${(p.highlights || []).length ? `<h2>What I built</h2><ul class="highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
          ${p.note ? `<p class="muted">${esc(p.note)}</p>` : ""}
        </div>
        <aside class="project-side">
          ${p.role ? `<div><dt>Role</dt><dd>${esc(p.role)}</dd></div>` : ""}
          ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ""}
          <div><dt>Tech</dt><dd>${tags(p.tags)}</dd></div>
          ${!links ? `<div><dt>Code</dt><dd class="muted">Private or class repo. Ask me for a walkthrough.</dd></div>` : ""}
        </aside>
      </div>
      <a class="next-project" href="${projectUrl(next)}"><span class="muted">Next project</span><strong>${esc(next.name)} →</strong></a>`;
  };

  pages.certificates = function () {
    let categories = ["All"], active = "All";
    const src = live ? live.source : {};
    const draw = () => {
      $("#cert-filters").innerHTML = categories.map((c) =>
        `<button class="filter${c === active ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
      drawCerts($("#cert-grid"), active === "All" ? CERTS : CERTS.filter((c) => c.category === active));
    };
    $("#cert-filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      active = b.dataset.cat;
      draw();
    });
    $("#cert-count").textContent = "Loading certificates…";
    certsLoaded.then((list) => {
      CERTS = list;
      categories = ["All", ...new Set(list.map((c) => c.category).filter(Boolean))];
      $("#cert-count").innerHTML = list.length
        ? `${list.length} certificates, loaded from <a href="https://github.com/${esc(src.owner)}/${esc(src.repo)}" target="_blank" rel="noopener">my GitHub</a>. Click one to view it or verify it.`
        : "Couldn't load certificates right now. Try refreshing the page.";
      draw();
    });
  };

  pages.contact = function () {
    const rows = [];
    if (R.email) rows.push(`
      <div class="contact-row"><dt>Email</dt>
        <dd><a href="mailto:${esc(R.email)}">${esc(R.email)}</a> <button class="copy" data-copy="${esc(R.email)}">Copy</button></dd></div>`);
    if (R.links?.github) rows.push(`<div class="contact-row"><dt>GitHub</dt><dd><a href="${esc(R.links.github)}" target="_blank" rel="noopener">${esc(R.links.github.replace(/^https?:\/\//, ""))}</a></dd></div>`);
    if (R.links?.linkedin) rows.push(`<div class="contact-row"><dt>LinkedIn</dt><dd><a href="${esc(R.links.linkedin)}" target="_blank" rel="noopener">${esc(R.links.linkedin.replace(/^https?:\/\//, ""))}</a></dd></div>`);
    if (R.phone) rows.push(`<div class="contact-row"><dt>Phone</dt><dd>${esc(R.phone)}</dd></div>`);
    if (R.location) rows.push(`<div class="contact-row"><dt>Location</dt><dd>${esc(R.location)}</dd></div>`);
    $("#contact-list").innerHTML = rows.join("");
    $("#contact-actions").innerHTML = `${R.email ? `<a class="btn primary" href="mailto:${esc(R.email)}">Send me an email</a>` : ""}${resumeButton()}`;
    $("#contact-list").addEventListener("click", (e) => {
      const b = e.target.closest(".copy");
      if (!b) return;
      navigator.clipboard?.writeText(b.dataset.copy).then(() => {
        b.textContent = "Copied";
        setTimeout(() => { b.textContent = "Copy"; }, 1500);
      });
    });
  };

  /* ---------- Terminal on the home page ---------- */
  async function typeTerminal() {
    const term = $("#terminal");
    if (!term) return;
    $("#term-title").textContent = `${R.handle || "user"}@portfolio: ~`;
    const prompt = `<span class="prompt">${esc(R.handle || "user")}@portfolio</span>:<span class="path">~</span>$ `;
    const featured = PROJECTS.filter((p) => p.featured).map((p) => `  ★ ${p.name}`).join("\n");
    await certsLoaded;
    const all = [
      ["whoami", `${R.name || ""}\n${R.title || ""}`],
      ["ls projects/ --featured", featured],
      ["ls certificates/ | wc -l", `${CERTS.length}`]
    ];
    if (reduceMotion) {
      term.innerHTML = all.map(([c, o]) => `${prompt}${esc(c)}\n${esc(o)}\n`).join("\n") + prompt + `<span class="cursor"></span>`;
      return;
    }
    let html = "";
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const [cmd, out] of all) {
      html += prompt;
      for (const ch of cmd) {
        html += esc(ch);
        term.innerHTML = html + `<span class="cursor"></span>`;
        await wait(40 + Math.random() * 35);
      }
      await wait(220);
      html += `\n${esc(out)}\n\n`;
      term.innerHTML = html + `<span class="cursor"></span>`;
      await wait(420);
    }
    term.innerHTML = html + prompt + `<span class="cursor"></span>`;
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("visible");
      io.unobserve(en.target);
    });
  }, { threshold: 0.1 });
  function observeReveal() {
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el));
  }

  /* ---------- Matrix rain background ---------- */
  function matrix() {
    const canvas = $("#matrix");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    const chars = "01アイウエオカキクケコ<>/{}[]$#";
    const size = 16;
    let drops;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array(Math.floor(canvas.width / size)).fill(0).map(() => Math.random() * -50);
    };
    resize();
    window.addEventListener("resize", resize);
    setInterval(() => {
      ctx.fillStyle = "rgba(11, 15, 20, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#39d98a";
      ctx.font = `${size}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
        drops[i] = y * size > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    }, 60);
  }

  (pages[page] || (() => {}))();
  setupModal();
  checkResume();
  observeReveal();
  matrix();
})();
