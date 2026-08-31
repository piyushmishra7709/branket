# Branket Solutions — Website

Static site for **Branket Solutions** (branketsolutions.website), built with plain HTML/CSS/JS — no build step required.

## What was fixed in this pass

**Round 1:**
- Added the real LinkedIn (`linkedin.com/company/108156509`) and Facebook links to the footer of **every** page (previously only `contact/` had them — the rest still had `#` placeholders).
- Added LinkedIn + Facebook to the `sameAs` structured data (JSON-LD) on every page, alongside Instagram, so Google can link them to your business profile.
- Fixed two broken image paths in `work/index.html` (`ibase_logo.png` → `iBase_logo.png`, `abbott_logo.png` → `ABBOTT_logo.png`). These worked locally on Windows/Mac but would have 404'd on GitHub Pages, which is case-sensitive.
- Validated every page with HTML Tidy (0 errors), checked every `href`/`src` on every page for broken links (0 broken), validated all JSON-LD blocks as valid JSON, and spell-checked all visible text (no genuine misspellings — only proper nouns/brand names flagged).
- Added `.nojekyll` so GitHub Pages serves the site as-is.

**Round 2 (mobile responsiveness):**
- **Mobile menu had two "Start a Project" buttons** — one in the top bar, one inside the dropdown. The top bar now only shows the logo, dark-mode toggle, and hamburger on mobile; the single CTA button lives at the bottom of the dropdown menu.
- **Logo text wrapping** — "Branket Solutions" could wrap onto two cramped lines next to the toggle/hamburger on narrow phones. Fixed with tighter sizing at small breakpoints.
- **"Beyond the Deliverable" section (About page)** was hand-built with fixed inline pixel styles and a non-wrapping flex row, so the right-hand badge column squeezed the text on mobile instead of stacking below it. Rebuilt with proper responsive CSS classes that stack cleanly on small screens, and now follows dark mode correctly (it didn't before).
- **Same bug on the homepage** — the "Why Choose Us" section (4-column cards + stats bar) had the identical hardcoded, non-responsive grid, plus invalid HTML (a `<div>` nested inside a `<span>`). Rebuilt the same way: proper breakpoints (4→2→1 columns) and dark-mode support.
- **Contact form was double-submitting.** The form had two separate submit handlers attached — an inline script with a real, working Google Apps Script endpoint, and the shared `script.js` with a placeholder endpoint — both firing on every submit. Consolidated to one handler in `script.js`, using the real working endpoint, and removed the duplicate inline script.
- Re-validated everything after these changes: 0 HTML errors, 0 broken links/images, all JSON-LD still valid.

## File structure

**Round 3 (restructured, flat & simple):**
- Replaced the "one folder per page, each holding an `index.html`" layout with plain, distinctly-named `.html` files at the root — no more juggling a dozen editor tabs all called `index.html`.
- Flattened `assets/` and `assets/clients/` into images living directly at the root — no `images/` folder, no `clients/` folder.

**Round 4 (fully flat — every file at the repo root):**
- After Round 3, images and blog posts still lived one level down (`images/`, `blog/`), and uploading through GitHub's web interface (rather than `git push`) repeatedly dropped their *contents* straight into the repo root instead of preserving those folders — so `/images/logo.png` and `/blog/about.html`-style links pointed at files that weren't actually there, and everything 404'd.
- Fixed for good by removing those two folders entirely: every image and every blog post now sits as its own file directly at the repo root, exactly like the rest of the site. There is nothing left to "preserve" on upload — every single file can be dragged into GitHub's upload box at once, with zero folder structure to get right.

**Round 5 (clean URLs — no `.html` in the address bar, still zero folders):**
- GitHub Pages has a built-in (documented, non-Jekyll) behavior: a request for `/contact` is automatically served from `contact.html` if no literal file named `contact` exists. This works for **every** file sitting at the repo root — no folders, no `index.html` renaming, no GitHub Actions build step required.
- So every internal link, canonical tag, Open Graph URL, JSON-LD field, and `sitemap.xml` entry across the whole site now points to `/contact` instead of `/contact.html` (same for every other page). The actual files on disk are **unchanged** — `contact.html`, `blog.html`, etc. still exist with those exact names; only the links pointing *at* them changed.
- Result: visiting `branketsolutions.website/contact` (clean) now works, and the address bar shows the clean URL when navigating via the site's own menu — with the same fully-flat, zero-folder file layout from Round 4.
- Updated every internal link, image path, canonical tag, Open Graph URL, JSON-LD `url`/`mainEntityOfPage` field, and `sitemap.xml` entry to match — re-validated afterwards: 0 broken links/images, 0 HTML errors, all JSON-LD still valid.

```
branket/
├── index.html                    → /
├── about.html                    → /about.html
├── services.html                 → /services.html
├── work.html                     → /work.html
├── contact.html                  → /contact.html
├── blog.html                     → /blog.html   (listing page)
├── social-media-101.html         → /social-media-101.html   (9 blog posts, all at root)
├── design-trends.html
├── branding-basics.html
├── website-2026.html
├── cost-of-bad-website.html
├── custom-software.html
├── seo-basics.html
├── local-seo.html
├── web-project-lifecycle.html
├── logo.png, logo-mark.png, favicon.png, <client>_logo.png/jpg   (every image, flat at root)
├── style.css
├── script.js
├── backend/                      → OPTIONAL server-side form handlers (not needed for GitHub Pages, not linked from any page — see note below)
├── CNAME                         → custom domain: branketsolutions.website
├── robots.txt
├── sitemap.xml
└── .nojekyll                     → tells GitHub Pages not to run Jekyll processing
```

**Uploading this to GitHub:** select every file shown above (everything except the `backend/` folder, which the live site doesn't use) and drag them all into GitHub's "Add file → Upload files" box in one go. There are no subfolders to worry about landing in the wrong place — every file simply sits at the repo root.

Note: pages are served at `/about.html` instead of `/about/` — if you'd shared any old-style link anywhere off-site (Google Business Profile, social bios, business cards), update it to the `.html` version.

## Deploy to GitHub Pages — step by step

1. **Create a new GitHub repository** (public or private — Pages works with both on paid plans; public repos get Pages free).
2. **Push these files to the repo root** (not into a subfolder):
   ```bash
   cd branket
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **"Deploy from a branch"**.
5. Set **Branch** to `main` and folder to **`/ (root)`**, then **Save**.
6. Under **Custom domain**, enter `branketsolutions.website` and save (the `CNAME` file already in this repo does this automatically too — GitHub will detect it).
7. Wait 1–2 minutes, then GitHub gives you a live URL (`https://<username>.github.io/<repo>/` first, then your custom domain once DNS propagates).

### Pointing your domain (branketsolutions.website) at GitHub Pages
At your domain registrar (GoDaddy, Namecheap, etc.), add these DNS records:
- **A records** for the apex domain (`branketsolutions.website`) pointing to GitHub's IPs:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
- **CNAME record** for `www` pointing to `<your-username>.github.io`.

DNS changes can take a few minutes to 24 hours to propagate. Once it does, tick **"Enforce HTTPS"** in the Pages settings — GitHub issues a free SSL certificate automatically.

## Images and other assets — do they need special handling?

No extra steps — this is the main thing people get confused about with GitHub Pages, so to be clear:

- Every image, font link, and script in this project is referenced with a normal absolute path (e.g. `/logo.png`, `/style.css`) — no folder prefix. As long as every file lands at the **root** of the repo (never inside a nested folder GitHub happened to create during upload), all images/CSS/JS will load correctly.
- If you ever use `git push` instead of the web upload, just make sure you're inside the `branket/` folder itself when you run `git add .` (so `index.html`, `logo.png`, `style.css` etc. sit at the repo root) — not inside a `branket/branket/...` nested folder.
- `.nojekyll` is included so GitHub's Jekyll processor doesn't try to interfere with any folder/file names.

## Contact form — already wired up

The contact form (`contact/index.html`) posts to a Google Apps Script Web App so enquiries log into a Google Sheet. There used to be a duplicate, conflicting setup here (see "Round 2" above) — that's now fixed, and `script.js` uses the real, working deployment endpoint that was already live on the site:

```js
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwbodOlNh0Zk0VvA3QYhW7lpIHGB8EwTgJL9o7pnNZYfkqShK4oLOClMGrfIw-w-hbm8g/exec";
```

If you ever need to point it at a **different** Apps Script deployment (new Google account, new sheet, etc.), follow `backend/GOOGLE-SHEETS-SETUP.md` to deploy your own (using `backend/Code.gs`) and swap the URL above in `script.js` — that's the only file that needs it now. Email + WhatsApp fallback are always shown to the visitor regardless of whether the sheet logging succeeds.

There's also an alternative Node.js/Nodemailer backend under `backend/option-b-node-nodemailer/` if you'd rather run your own server instead of Apps Script — that one is entirely optional and unrelated to the GitHub Pages deployment above.
