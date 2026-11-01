/*
  Renders the page from data/resume.js. Certificates are loaded live from
  GitHub by assets/certificates-live.js.
  You should not need to edit this file to change content.
*/
(function () {
  const R = window.RESUME || {};
  let CERTS = [];
  const certsLoaded = window.CertificatesLive
    ? window.CertificatesLive.load().catch((e) => { console.error(e); return []; })
    : Promise.resolve([]);
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Basic text ---------- */
  $("#name").textContent = R.name || "";
  $("#title").textContent = R.title || "";
  $("#nav-handle").textContent = R.handle || "me";
  $("#summary").textContent = R.summary || "";
  $("#footer-name").textContent = R.name || "";
  $("#year").textContent = new Date().getFullYear();
  $("#term-title").textContent = `${R.handle || "user"}@portfolio: ~`;
  document.title = `${R.name || "Portfolio"} | ${(R.title || "").split("|")[0].trim()}`;
  const resumeBtn = $("#resume-btn");
  // Show the resume button / photo only if the files actually exist
  if (R.resumePdf) {
    resumeBtn.href = R.resumePdf;
    if (location.protocol !== "file:") {   // can't check files when opened straight from disk
      resumeBtn.hidden = true;
      fetch(R.resumePdf, { method: "HEAD" }).then((r) => { if (r.ok) resumeBtn.hidden = false; }).catch(() => {});
    }
  } else resumeBtn.remove();
  const avatar = $("#avatar");
  if (R.photo) {
    avatar.onload = () => { avatar.hidden = false; };
    avatar.alt = `Photo of ${R.name || ""}`;
    avatar.src = R.photo;
  }

  /* ---------- Stats ---------- */
  // A stat value of "{certs}" or "{issuers}" is filled in once certificates load
  const renderStats = (counts) => {
    $("#stats").innerHTML = (R.stats || []).map((s) => {
      const v = String(s.value).replace(/\{(\w+)\}/g, (m, k) => counts ? (counts[k] ?? m) : "…");
      return `<div class="stat reveal visible"><div class="stat-value">${esc(v)}</div><div class="stat-label">${esc(s.label)}</div></div>`;
    }).join("");
  };
  renderStats(null);

  /* ---------- Skills ---------- */
  $("#skills-grid").innerHTML = (R.skills || []).map((g) => `
    <div class="skill-group reveal">
      <h3>&gt; ${esc(g.group)}</h3>
      ${g.items.every((s) => s.level == null)
        ? `<div class="tags">${g.items.map((s) => `<span class="tag">${esc(s.name)}</span>`).join("")}</div>`
        : g.items.map((s) => `
        <div class="skill">
          <div class="skill-head"><span>${esc(s.name)}</span><span>${Number(s.level) || 0}%</span></div>
          <div class="bar"><div class="bar-fill" data-level="${Number(s.level) || 0}"></div></div>
        </div>`).join("")}
      ${g.note ? `<p class="muted mono" style="font-size:12px;margin:14px 0 0">${esc(g.note)}</p>` : ""}
    </div>`).join("");

  /* ---------- Experience & education ---------- */
  $("#timeline").innerHTML = (R.experience || []).map((j) => `
    <div class="job reveal">
      <h3>${esc(j.role)} <span class="accent">@ ${esc(j.company)}</span></h3>
      <div class="meta">${esc(j.period)}</div>
      <ul>${(j.points || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
    </div>`).join("");
  if (!(R.experience || []).length) { $("#timeline").remove(); }
  $("#education").innerHTML = (R.education || []).map((e) => `
    <div class="edu reveal"><strong>${esc(e.degree)}</strong><span class="muted">${esc(e.school)} · ${esc(e.period)}</span></div>`
  ).join("");

  /* ---------- Projects ---------- */
  $("#project-cards").innerHTML = (R.projects || []).map((p) => `
    <article class="card reveal">
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      ${p.link ? `<a class="mono" href="${esc(p.link)}" target="_blank" rel="noopener">view →</a>` : ""}
      <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </article>`).join("");

  /* ---------- Certificates (live from GitHub) ---------- */
  const skillTags = (c, max) => {
    const s = c.skills || [];
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
  const src = window.CertificatesLive ? window.CertificatesLive.source : {};
  const repoUrl = `https://github.com/${src.owner}/${src.repo}`;

  let categories = ["All"];
  let activeCat = "All";

  function renderFilters() {
    $("#cert-filters").innerHTML = categories.map((c) =>
      `<button class="filter${c === activeCat ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`
    ).join("");
  }

  // Draw PDF previews only when a card scrolls near the screen
  const thumbIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      thumbIo.unobserve(en.target);
      const c = CERTS[Number(en.target.dataset.index)];
      const box = en.target.querySelector(".cert-thumb");
      window.CertificatesLive.preview(c, 520).then((url) => {
        const img = new Image();
        img.alt = `${c.title} certificate`;
        img.src = url;
        box.querySelector(".loading")?.replaceWith(img);
      }).catch(() => {
        const l = box.querySelector(".loading");
        if (l) l.textContent = c.isPdf ? "[ PDF ]" : "[ file ]";
      });
    });
  }, { rootMargin: "300px" });

  function renderCerts() {
    const list = activeCat === "All" ? CERTS : CERTS.filter((c) => c.category === activeCat);
    $("#cert-count").innerHTML = `$ git ls-files <a href="${esc(repoUrl)}" target="_blank" rel="noopener">${esc(src.owner)}/${esc(src.repo)}</a> | wc -l  →  ${CERTS.length} total`;
    $("#cert-grid").innerHTML = list.map((c) => `
        <button class="cert reveal visible" data-index="${CERTS.indexOf(c)}">
          <div class="cert-thumb"><span class="pdf loading">loading…</span><span class="cert-cat">${esc(c.category || "")}</span></div>
          <div class="cert-info">
            <h3>${esc(c.title)}</h3>
            <div class="meta">${esc([c.issuer, fmtDate(c.date)].filter(Boolean).join(" · "))}</div>
            ${skillTags(c, 3)}
          </div>
        </button>`).join("");
    document.querySelectorAll("#cert-grid .cert").forEach((el) => thumbIo.observe(el));
  }

  $("#cert-filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderFilters();
    renderCerts();
  });

  /* Modal viewer */
  const modal = $("#modal");
  function openCert(c) {
    $("#modal-content").innerHTML = `
      <div class="modal-media"><span class="pdf">loading…</span></div>
      <h3>${esc(c.title)}</h3>
      <div class="mono muted">${esc([c.issuer, fmtDate(c.date), c.credentialId ? `ID ${c.credentialId}` : ""].filter(Boolean).join(" · "))}</div>
      ${skillTags(c)}
      <p>
        <a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener">Open file</a>
        ${c.verifyUrl ? `<a class="btn primary" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener">Verify credential</a>` : ""}
      </p>`;
    window.CertificatesLive.preview(c, 1400).then((url) => {
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
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    $("#modal-content").innerHTML = "";
  }
  $("#cert-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".cert");
    if (card) openCert(CERTS[Number(card.dataset.index)]);
  });
  $(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  $("#cert-count").textContent = `$ fetching certificates from GitHub…`;
  certsLoaded.then((list) => {
    CERTS = list;
    categories = ["All", ...new Set(CERTS.map((c) => c.category).filter(Boolean))];
    renderFilters();
    renderCerts();
    const issuers = new Set(CERTS.map((c) => String(c.issuer || "").replace(/\s*\(.*\)$/, "")).filter(Boolean));
    renderStats({ certs: CERTS.length, issuers: issuers.size });
    if (!CERTS.length) $("#cert-count").textContent = "$ couldn't reach GitHub right now. Try refreshing.";
  });

  /* ---------- Contact ---------- */
  const links = [];
  if (R.email) links.push(`<a class="btn primary" href="mailto:${esc(R.email)}">${esc(R.email)}</a>`);
  if (R.links?.github) links.push(`<a class="btn" href="${esc(R.links.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (R.links?.linkedin) links.push(`<a class="btn" href="${esc(R.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (R.phone) links.push(`<span class="btn" style="cursor:default">${esc(R.phone)}</span>`);
  if (R.location) links.push(`<span class="btn" style="cursor:default">${esc(R.location)}</span>`);
  $("#contact-links").innerHTML = links.join("");

  /* ---------- Terminal typing ---------- */
  const term = $("#terminal");
  const prompt = `<span class="prompt">${esc(R.handle || "user")}@portfolio</span>:<span class="path">~</span>$ `;
  const outputs = {
    "whoami": `${R.name || ""}\n${R.title || ""}`,
    "cat summary.txt": R.summary || "",
  };
  const lines = R.terminalIntro || Object.keys(outputs);
  const certLine = `ls certificates/`;
  const certOut = () => CERTS.slice(0, 4).map((c) => `  ✔ ${c.title}`).join("\n") + (CERTS.length > 4 ? `\n  ... and ${CERTS.length - 4} more` : "");

  async function typeTerminal() {
    await certsLoaded;
    const all = [...lines.map((l) => [l, outputs[l] ?? ""]), [certLine, certOut()]];
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
        await wait(45 + Math.random() * 40);
      }
      await wait(250);
      html += `\n${esc(out)}\n\n`;
      term.innerHTML = html + `<span class="cursor"></span>`;
      await wait(500);
    }
    term.innerHTML = html + prompt + `<span class="cursor"></span>`;
  }
  typeTerminal();

  /* ---------- Reveal on scroll + skill bars ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("visible");
      en.target.querySelectorAll(".bar-fill").forEach((b) => { b.style.width = b.dataset.level + "%"; });
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll(".nav nav a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => s && navIo.observe(s));

  /* Mobile menu */
  const toggle = $(".nav-toggle"), nav = $(".nav nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

  /* ---------- Matrix rain background ---------- */
  const canvas = $("#matrix");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const chars = "01アイウエオカキクケコ<>/{}[]$#";
    const size = 16;
    let cols, drops;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / size);
      drops = Array(cols).fill(0).map(() => Math.random() * -50);
    }
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
})();
