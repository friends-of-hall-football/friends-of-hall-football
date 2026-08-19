# Friends of Hall Football — website

Static site built with [Eleventy](https://www.11ty.dev/), deployed on Netlify,
edited through [Sveltia CMS](https://sveltiacms.app/) at `/admin/`.

Running cost: the domain only (~$12/yr at Porkbun). Everything else is free tier.

---

## Part 1 — One-time setup

You only do this once. Budget an evening.

### 1. Buy the domain

Porkbun is fine. Something like `friendsofhallfootball.org`. Don't buy their
extra services — Netlify handles DNS, SSL, and email forwarding needs separately.

### 2. Create the GitHub organization

Use an **organization**, not a personal account. The org is the durable owner —
people join and leave it over the years without the repo ever moving.

1. GitHub → **`+` dropdown (top right) → New organization → Free plan**
2. Organization account name: `friends-of-hall-football`
3. Contact email: the booster club address, not a personal one
4. "This organization belongs to": **My personal account** (correct on the free
   plan; it's a billing question and doesn't tie the org to you permanently)

### 3. Create the repo inside the org

1. **`+` dropdown → New repository**
2. **Owner:** change this from your username to `friends-of-hall-football`
3. **Name:** `friends-of-hall-football`, set to **Private**
4. Do **not** add a README, .gitignore, or license — this folder already has
   them and an auto-created README will collide on your first push.

Then, from this folder:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/friends-of-hall-football/friends-of-hall-football.git
git push -u origin main
```

### 4. Connect Netlify

1. Sign up at netlify.com with your GitHub account, then create a **team**
   (not a personal deploy) and connect it to the GitHub organization. Free tier
   includes teams, and it hands off the same way the org does.
2. **Add new site → Import an existing project → GitHub →** pick the repo.
3. Netlify reads `netlify.toml` and fills in the build settings. Just click deploy.
4. It gives you a URL like `random-name-123.netlify.app`. Confirm the site loads.

### 5. Point the domain at it

In Netlify: **Domain management → Add a domain →** enter your domain. It shows
you two or four nameservers. In Porkbun, under your domain's **Authoritative
Nameservers**, replace what's there with Netlify's.

Wait a few hours for DNS. Netlify then issues a free Let's Encrypt SSL
certificate automatically and renews it forever. Set your preferred domain
(apex or `www`) as primary — Netlify 301-redirects the other one.

### 6. Turn on the CMS

Sveltia commits to GitHub on your behalf, so it needs a GitHub OAuth app.

**a.** Create the OAuth app **under the organization, not your personal account** —
a personal OAuth app dies with your account. Go to
**github.com/organizations/friends-of-hall-football/settings/applications →
New OAuth App**
- Application name: `Hall Football Site Editor`
- Homepage URL: `https://yourdomain.org`
- Authorization callback URL: `https://yourdomain.org/oauth/callback`

Save the **Client ID** and generate a **Client Secret**.

**b.** Netlify → your site → **Site configuration → Access & security →
OAuth → Install provider → GitHub**. Paste the Client ID and Secret.

**c.** Visit `https://yourdomain.org/admin/`. Log in with GitHub. You should see
News Posts and Site Content in the sidebar.

### 7. Set up Stripe

1. Stripe dashboard → **Payment Links → New**. Create four links: $25, $50,
   $100, and one with **"Let customers choose what they pay"** for custom amounts.
2. For each link, under **After payment**, set redirect to
   `https://yourdomain.org/thank-you.html`.
3. Upload your logo and set brand colors under **Settings → Branding** so
   checkout doesn't look like a stranger's page.
4. Apply for the nonprofit rate (2.2% + 30¢ instead of 2.9% + 30¢) — Stripe
   support, with your 501(c)(3) determination letter.
5. In the CMS under **Site Content → Donation Buttons**, paste the four URLs.

### 8. Fill in the placeholders

In the CMS under **Site Content → Site Settings**, replace everything that
says `REPLACE`: contact email, EIN, mailing address, newsletter URL.

---

## Part 2 — Day-to-day editing

Go to `https://yourdomain.org/admin/`. Everything below is a form. Save, and
the site rebuilds itself in about a minute.

| To do this | Go to |
| --- | --- |
| Post team news | **News Posts → New** |
| Change a game time or add a playoff game | **Site Content → Game Schedule** |
| Add a sponsor logo | **Site Content → Sponsors** |
| Change sponsorship tiers | **Site Content → Sponsorship Levels** |
| Swap a donation amount or Stripe link | **Site Content → Donation Buttons** |
| Change email, EIN, newsletter link | **Site Content → Site Settings** |

**The "Next Up" panel updates itself.** It reads the schedule and shows the
next game that hasn't happened yet. You never edit it directly.

Photos: drag into any image field. They land in `src/images/` automatically.

---

## Part 3 — What lives where (for whoever inherits this)

```
src/
  _data/           Content the CMS edits. Plain JSON.
    schedule.json      the games
    sponsors.json      sponsor logos + links
    sponsorLevels.json sponsorship tiers
    donation.json      Stripe Payment Link URLs
    site.json          email, EIN, external links
    nextGame.js        computes the "Next Up" panel from schedule.json
  _includes/
    base.njk         nav + footer, shared by every page
    post.njk         layout for a single news post
  posts/           One markdown file per news post
  admin/           The CMS itself (index.html + config.yml)
  index.njk        Homepage
  donate.njk       Donation page
  sponsors.njk     Sponsors page
  newsletter.njk   Newsletter page
  thank-you.njk    Post-donation landing page
  styles.css       Every style. Colors/fonts are CSS variables at the top.
  images/          Photos and logos
```

Nothing is duplicated. The schedule exists in exactly one place; the homepage
table and the Next Up panel both read from it. Same for sponsors.

To run it locally:

```bash
npm install
npm start          # then open http://localhost:8080
```

To add a new editor: invite them to the GitHub **organization** as a member.
They log into `/admin/` with their own GitHub account. No other setup.

To hand the whole thing off: add the successor as a second org **Owner**, have
them accept, then remove yourself. The repo, the site, and the CMS all keep
working — nothing moves and no links change. Do the same on the Netlify team.

---

## Notes

- **Forms** (volunteer sign-up, sponsor inquiry) use Netlify Forms — free up to
  100 submissions/month. Submissions appear in the Netlify dashboard. Turn on
  email notifications under **Forms → Settings**.
- **The CMS is Sveltia, not Decap.** Decap is the better-known project but has
  unpatched security issues and an unresponsive maintainer. Sveltia is a drop-in
  rewrite and reads Decap-format config files, so Decap tutorials still apply.
- **Sponsor logos** in `src/images/sponsors/` are placeholders. Replace them.
- **Backups** are automatic — every edit is a Git commit. Nothing can be lost.
