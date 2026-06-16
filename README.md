# 📁 Indian Startup Files

### *Every Startup Has a Story. We Write The Full File.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222222?style=flat&logo=github)

Indian Startup Files is a free, no-fluff home for deep-dive case studies on Indian startups — their rise, fall, pivots, and the lessons in between — paired with a live community "Debate Room" where readers vote on the decisions that shaped these companies.

Built solo. Zero budget. Runs entirely on free-tier infra.

🔗 **Live Site:** [https://your-username.github.io/IndianStartupFiles/](#)

---

## ✨ Features

- **Brand-themed case studies** — every individual post (Byju's, Zepto, Mamaearth, and growing) is styled in that startup's own brand colors for an immersive, distinct read
- **Searchable case study library** — real-time search, category filters, and sort by Latest / Most Viewed / Most Liked
- **Live engagement, no backend server** — views, likes, and dislikes are tracked in real time via Supabase, with zero server cost
- **Audio Debate Room** — a custom-built HTML5 podcast-style player with episode navigation, speed control, and live community voting bars
- **Reading experience extras** — sticky table of contents, scroll progress bar, animated stat counters, fade-in transitions
- **Fully responsive** — clean breakpoints down to mobile, no layout shift, no frameworks bloating load time

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (custom properties, Grid/Flexbox) — vanilla, no framework, no build step
- **Backend:** [Supabase](https://supabase.com) (Postgres + RPC functions) for views, likes, dislikes, and debate votes
- **Fonts:** Space Grotesk · DM Sans · Playfair Display (Google Fonts)
- **Hosting:** GitHub Pages

## 📂 Project Structure

```
IndianStartupFiles/
├── index.html                              # Homepage
├── blogs.html                              # Case studies listing + search/filter/sort
├── supabase-stats.js                       # Shared Supabase client (views/likes/votes)
├── blogspost/
│   ├── byjus_collapse_blog_page.html
│   ├── zepto_blog_page.html
│   └── mamaearth_blog_page.html
└── debates/
    └── indian_startup_files_debates_page.html   # Audio Debate Room
```

> Paths are absolute (`/IndianStartupFiles/...`) in nested pages. If your repo name differs, update those paths or switch to relative ones.

## 🗄️ Backend Contract (Supabase)

The frontend expects this schema. Set it up in your own Supabase project before deploying:

**Table — `article_stats`**

| column | type | notes |
|---|---|---|
| slug | text | primary key |
| views | int4 | default 0 |
| likes | int4 | default 0 |
| dislikes | int4 | default 0 |

**RPC functions (Postgres functions, exposed via PostgREST):**

- `increment_view(p_slug text)`
- `add_like(p_slug text)` / `remove_like(p_slug text)`
- `add_dislike(p_slug text)` / `remove_dislike(p_slug text)`
- `cast_debate_vote(p_debate_id int, p_side text)` → `{ a, b, total }`
- `get_debate_votes(p_debate_id int)` → `{ a, b, total }`
- `get_total_votes()` → `int`

Enable Row Level Security on `article_stats` with policies allowing anon `select`/`update` through the RPCs only — don't expose raw table writes to the anon key.

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/IndianStartupFiles.git
cd IndianStartupFiles
npx serve .
```

1. Create a free [Supabase](https://supabase.com) project, set up the schema above
2. Drop your Project URL + anon key into `supabase-stats.js`
3. Serve locally with a static server (opening via `file://` breaks the Supabase `fetch` calls — use `npx serve`, VS Code Live Server, or similar)
4. Push to GitHub → Settings → Pages → deploy from branch

## ✍️ Adding a New Case Study

1. Duplicate an existing file in `blogspost/`, rename it to match your new startup's slug
2. Update the `SLUG` constant inside the file's `<script>` so stats track correctly
3. Re-theme the CSS variables (`--p`, `--g`, etc.) to the startup's brand colors
4. Add a matching entry to the `BLOGS` array in `blogs.html` — `slug` must match the filename
5. Commit, push, done

## 🗺️ Roadmap

- [ ] Comment system per article
- [ ] More sectors / case studies (Paytm, OYO, CRED, Nykaa already stubbed in)
- [ ] Newsletter signup
- [ ] Dark mode

## 📜 License

No license attached yet. Add a `LICENSE` file (MIT recommended) if you want others to fork or reuse the code.

## 🙌 Author

Built solo by **Divyansh** — zero budget, hosted free, forever.

Connect: [LinkedIn] · [Twitter/X] · [Email]
