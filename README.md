# Portfolio site

A static resume and certificates site. No build step and no server code.

## How certificates work
The site does **not** store any certificate files. Every time someone opens the page, it:

1. Lists the files in your GitHub repo `lmagjb/certificates` (PDF, PNG, JPG).
2. Shows each one straight from GitHub, with a preview of the first page.
3. Fills in the title, issuer, date and verify link by reading the PDF itself.

So to add a certificate, upload it to the `certificates` repo. The site shows it within about 5 minutes. You don't need to redeploy or change this folder.

Change which repo, branch or folder it reads in `data/resume.js` under `certificateSource`.

### Optional: nicer details
New files get their details from the PDF text. Category is guessed from the title, and there are no skill tags. To set those yourself, use either:
- `data/certificate-details.js` in this site, keyed by file name, or
- a `certificates.json` file in the certificates repo with the same shape, for example:

```json
{
  "Coursera 2BE43OUHQ6LU.pdf": {
    "title": "Laravel From Scratch",
    "category": "Web Development",
    "skills": ["PHP", "Laravel", "MVC"]
  }
}
```
Anything in `certificates.json` in the repo wins over this site's file.

## View it locally
Double-click `index.html`. It needs an internet connection to reach GitHub.

## Deploy with GitHub Pages (free)
1. Create a new repo on GitHub, for example `portfolio` (or `lmagjb.github.io` for the shorter address).
2. Upload everything in this folder to that repo (Add file > Upload files, drag the folder contents in, Commit).
3. In that repo go to Settings > Pages. Under "Build and deployment", pick "Deploy from a branch", choose `main` and `/ (root)`, then Save.
4. After a minute the site is live at `https://lmagjb.github.io/portfolio/` (or `https://lmagjb.github.io/`).

Keep the `certificates` repo **public**, because visitors' browsers read from it directly.

## Other content
- **Your details:** `data/resume.js`.
- **Resume PDF:** in Canva, Share > Download > PDF, then save it as `assets/resume.pdf`.
- **Photo:** save a square photo as `assets/photo.jpg`. It appears above your name once the file is there.
- **Colors:** the variables at the top of `assets/style.css`.

## Folder layout
```
index.html                     page structure
assets/style.css               look and feel
assets/main.js                 builds the page
assets/certificates-live.js    reads certificates from GitHub
assets/vendor/                 pdf.js (draws PDF previews in the browser)
data/resume.js                 your resume text + certificate repo settings
data/certificate-details.js    optional extra details per certificate
```

## Limits worth knowing
- GitHub allows each visitor 60 repo listings per hour without a key. The site saves the list for 5 minutes, so normal visitors never reach that. If it ever fails, the page falls back to the last list it saw.
- Details read from a PDF work well for Coursera certificates. Other formats may only get the file name as the title. Add an entry to `certificates.json` for those.
