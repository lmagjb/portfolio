/*
  Loads certificates LIVE from a GitHub repo every time the page opens.

  - Lists the files in the repo with the GitHub API (public repos need no key).
  - Each file is shown straight from GitHub (raw.githubusercontent.com),
    so nothing is copied into this site.
  - Details come from, in order:
      1. certificates.json in the repo (optional)
      2. data/certificate-details.js in this site (optional)
      3. the text inside the PDF itself (title, issuer, date, verify link)
      4. the file name
  - PDF previews are drawn in the browser with pdf.js (assets/vendor).

  Settings live in data/resume.js -> certificateSource.
*/
(function () {
  const SRC = Object.assign(
    { owner: "lmagjb", repo: "certificates", branch: "main", folder: "" },
    (window.RESUME || {}).certificateSource || {}
  );
  const LOCAL_DETAILS = window.CERTIFICATE_DETAILS || {};
  const FILE_RE = /\.(pdf|png|jpe?g|webp|gif)$/i;
  const CACHE_KEY = `certs:${SRC.owner}/${SRC.repo}@${SRC.branch}/${SRC.folder}`;
  const CACHE_MS = 5 * 60 * 1000; // re-list the repo at most every 5 minutes per visitor

  const rawUrl = (path) =>
    `https://raw.githubusercontent.com/${SRC.owner}/${SRC.repo}/${SRC.branch}/` +
    path.split("/").map(encodeURIComponent).join("/");

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* full or blocked */ } }
  };

  /* ---------- 1. List the repo ---------- */
  async function listRepo() {
    const cached = store.get(CACHE_KEY);
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.files;

    const api = `https://api.github.com/repos/${SRC.owner}/${SRC.repo}/contents/${SRC.folder}?ref=${encodeURIComponent(SRC.branch)}`;
    try {
      const res = await fetch(api, { headers: { Accept: "application/vnd.github+json" } });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const items = await res.json();
      const files = items
        .filter((it) => it.type === "file" && FILE_RE.test(it.name))
        .map((it) => ({ name: it.name, path: it.path, sha: it.sha }));
      store.set(CACHE_KEY, { at: Date.now(), files });
      return files;
    } catch (err) {
      console.warn("Could not list the certificates repo, using the last known list.", err);
      if (cached) return cached.files;
      // Last resort: files we know about from certificate-details.js
      return Object.keys(LOCAL_DETAILS).map((name) => ({
        name, path: SRC.folder ? `${SRC.folder}/${name}` : name, sha: name
      }));
    }
  }

  /* ---------- 2. Optional certificates.json in the repo ---------- */
  async function repoDetails() {
    try {
      const path = SRC.folder ? `${SRC.folder}/certificates.json` : "certificates.json";
      const res = await fetch(rawUrl(path));
      return res.ok ? await res.json() : {};
    } catch { return {}; }
  }

  /* ---------- 3. pdf.js helpers ---------- */
  let pdfjsReady;
  function pdfjs() {
    if (!pdfjsReady) {
      pdfjsReady = new Promise((resolve, reject) => {
        const base = document.querySelector('script[src*="certificates-live.js"]').src.replace(/certificates-live\.js.*$/, "vendor/");
        const load = (src) => new Promise((ok, bad) => {
          const s = document.createElement("script");
          s.src = src; s.onload = ok; s.onerror = bad;
          document.head.appendChild(s);
        });
        const steps = [load(base + "pdf.min.js")];
        // Opened straight from disk: browsers block web workers, so run pdf.js on the page
        if (location.protocol === "file:") steps.push(load(base + "pdf.worker.min.js"));
        Promise.all(steps).then(() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "pdf.worker.min.js";
          resolve(window.pdfjsLib);
        }, reject);
      });
    }
    return pdfjsReady;
  }

  const docs = new Map();
  async function openPdf(url) {
    if (!docs.has(url)) {
      docs.set(url, pdfjs().then((lib) => lib.getDocument({ url }).promise));
    }
    return docs.get(url);
  }

  // Draw page 1 and return it as an image URL
  async function renderPreview(url, width) {
    const doc = await openPdf(url);
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: width / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

  // Pull title / issuer / date / verify link out of the PDF text
  async function readPdfDetails(url) {
    const doc = await openPdf(url);
    const page = await doc.getPage(1);
    const content = await page.getTextContent();
    const items = content.items
      .filter((it) => it.str && it.str.trim())
      .map((it) => ({ str: it.str.trim(), x: it.transform[4], y: it.transform[5] }));
    const text = items.map((it) => it.str).join("\n");
    const flat = text.replace(/\s+/g, "");     // some PDFs space out letters: "O c t 3 1"
    const out = {};

    const verify = flat.match(/coursera\.org\/(?:verify|share)\/((?:specialization\/|professional-cert\/)?[A-Z0-9]{8,})/i);
    if (verify) {
      out.verifyUrl = `https://coursera.org/verify/${verify[1]}`;
      out.credentialId = verify[1].split("/").pop();
    }

    const date = flat.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?(\d{1,2}),(\d{4})/i);
    if (date) out.date = `${date[3]}-${String(MONTHS[date[1].toLowerCase().slice(0, 3)]).padStart(2, "0")}`;

    const by = text.replace(/\n/g, " ").match(/authorized by (.+?) and offered through Coursera/i);
    if (by) out.issuer = by[1].trim() === "Coursera" ? "Coursera" : `${by[1].trim()} (Coursera)`;
    else if (/coursera/i.test(text)) out.issuer = "Coursera";
    else if (/cisco/i.test(text)) out.issuer = "Cisco Networking Academy";

    // Title: the text printed between "has successfully completed" and "an online ... authorized by"
    const hs = items.find((it) => /successfully completed/i.test(it.str));
    if (hs) {
      const end = items.find((it) => /^an online|^a \d+-course|^this certificate/i.test(it.str) && it.y < hs.y);
      const floor = end ? end.y : hs.y - 80;
      const titleItems = items
        .filter((it) => it.y < hs.y - 1 && it.y > floor + 1 && Math.abs(it.x - hs.x) < 60)
        .sort((a, b) => b.y - a.y);
      if (titleItems.length) out.title = titleItems.map((it) => it.str).join(" ").replace(/\s+/g, " ")
        .split(/\s*(?:Congratulations|This certificate)/i)[0].trim();
    }
    return out;
  }

  /* ---------- 4. Guess a category from the title ---------- */
  const CATEGORY_RULES = [
    [/secur|cyber|hack|threat/i, "Security"],
    [/network|cisco|ccna|tcp|routing/i, "Networking"],
    [/linux|shell|server|cloud|aws|azure|devops|docker/i, "Systems"],
    [/sql|database|mongo|data model/i, "Databases"],
    [/flutter|android|ios|mobile|kotlin|react native|swift/i, "Mobile"],
    [/\bai\b|machine learning|generative|deep learning/i, "AI"],
    [/canva|productivity|design|office|excel/i, "Productivity"],
    [/front|back|web|react|node|django|laravel|php|javascript|html|css|mern|api/i, "Web Development"],
    [/java|python|programming|c\+\+|object-oriented/i, "Programming"]
  ];
  const guessCategory = (title) => (CATEGORY_RULES.find(([re]) => re.test(title)) || [, "Other"])[1];

  const prettyName = (name) => name.replace(FILE_RE, "").replace(/[_-]+/g, " ").trim();

  /* ---------- Main ---------- */
  async function loadCertificates() {
    const [files, fromRepo] = await Promise.all([listRepo(), repoDetails()]);

    const certs = await Promise.all(files.map(async (f) => {
      const url = rawUrl(f.path);
      const known = Object.assign({}, LOCAL_DETAILS[f.name] || {}, fromRepo[f.name] || {});
      let auto = {};
      const isPdf = /\.pdf$/i.test(f.name);
      if (isPdf && !known.title) {
        // New file: read details from the PDF (cached per file version)
        const key = `certinfo:${f.sha}`;
        auto = store.get(key) || {};
        if (!auto.title) {
          try { auto = await readPdfDetails(url); store.set(key, auto); }
          catch (e) { console.warn("Could not read", f.name, e); }
        }
      }
      const c = Object.assign({ title: prettyName(f.name) }, auto, known);
      c.category = c.category || guessCategory(c.title);
      c.file = f.name;
      c.url = url;
      c.sha = f.sha;
      c.isPdf = isPdf;
      return c;
    }));

    return certs.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  }

  // Preview image for a card (cached per file version)
  async function previewFor(cert, width) {
    if (!cert.isPdf) return cert.url;
    const key = `certthumb:${width}:${cert.sha}`;
    const hit = store.get(key);
    if (hit) return hit;
    const img = await renderPreview(cert.url, width);
    if (width <= 600) store.set(key, img);
    return img;
  }

  window.CertificatesLive = { load: loadCertificates, preview: previewFor, source: SRC };
})();
