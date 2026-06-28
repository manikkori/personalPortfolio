# Manik — Personal Portfolio Website

A dark-themed, animated personal portfolio website for a MERN Stack Developer. Inspired by editorial design aesthetics with orange/amber accents, smooth GSAP animations, and a fully responsive layout.

---

## Live Demo

> the-manik.vercel.app

---

## Preview

| Section | Description |
|---|---|
| Hero | Bold title + animated circular photo with spinning border |
| About | Bio, tags, animated metric cards with tilt effect |
| Skills | SVG icon cards with animated progress bars |
| Education | Timeline-style cards with status badges |
| Projects | Horizontal drag-scroll with 5 project cards |
| Contact | Form + social links |
| Footer | Big wordmark footer |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript | Interactivity, scroll logic |
| GSAP 3 | Scroll-triggered animations, entrance effects |
| ScrollTrigger | Parallax and reveal on scroll |
| Google Fonts | Syne (display) + Space Grotesk (body) |

> Zero build step. Zero dependencies to install. Pure HTML/CSS/JS.

---

## Features

### Design
- Dark editorial theme — black background, orange/amber accents
- Custom animated cursor with ring tracker
- Spinning conic-gradient border around hero photo
- Hover on photo → turns black & white
- Floating bob animation on hero circle
- Big wordmark footer (Charlotte-style)

### Animations (GSAP)
- Hero entrance — staggered fade-in on page load
- Scroll reveal — every section fades up on scroll
- Skill bars — animate width when scrolled into view
- Stat counters — count up from 0 on scroll
- Metric cards — 3D tilt on mouse hover
- Parallax — hero content scrolls at offset speed

### Projects Section
- Horizontal scroll (left → right)
- Mouse wheel → horizontal scroll (desktop)
- Click + drag → scroll (desktop)
- Touch swipe → scroll (mobile/tablet)
- No scrollbar visible, no glitches

### Responsive
- Mobile first CSS with `clamp()` for fluid typography
- Hamburger menu with overlay on mobile
- All sections reflow correctly on small screens
- Tested from 320px to 1920px+

---

## Project Structure

```
manik-portfolio/
│
├── index.html          # Complete single-file portfolio
│                       # (HTML + CSS + JS all in one)
│
└── README.md           # This file
```

> The entire portfolio is one self-contained `index.html` file with the hero photo embedded as base64. No external files needed except Google Fonts and GSAP (loaded via CDN).

---

## Getting Started

### Option 1 — Open locally
Just double-click `index.html` in your browser. That's it.

### Option 2 — Deploy to Vercel (Recommended)

**Drag & Drop (Fastest):**
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Drag and drop the folder containing `index.html`
4. Click **Deploy**
5. Your site is live in ~30 seconds

**Via GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Manik Portfolio"
git remote add origin https://github.com/YOUR_USERNAME/manik-portfolio.git
git push -u origin main
```
Then connect the repo on Vercel → Deploy.

**Vercel Settings (leave all as default):**
```
Framework Preset  : Other
Build Command     : (leave empty)
Output Directory  : (leave empty)
Install Command   : (leave empty)
```

---

## Customization

### Personal Info
Open `index.html` and search for these strings to update:

| What to change | Search for |
|---|---|
| Email address | `manik@email.com` |
| University name | `Your University Name` |
| GitHub link | `soc" title="GitHub"` |
| LinkedIn link | `soc" title="LinkedIn"` |
| Twitter/X link | `soc" title="Twitter/X"` |
| Hero subtitle | `Building fast, scalable` |
| About paragraphs | `// About Me` section |
| Stats numbers | `data-count="10"` / `data-count="100"` / `data-count="2"` |

### Projects
Each project card looks like this — duplicate or edit as needed:

```html
<div class="proj-c">
  <a href="YOUR_LINK" class="plink">↗</a>
  <div class="proj-thumb">
    <div class="proj-thumb-lbl">LABEL</div>
    <span class="ptag">Tag</span>
  </div>
  <div class="proj-info">
    <div class="proj-name">Project Name</div>
    <div class="proj-desc">Short description here.</div>
    <div class="proj-tech">
      <span>React</span><span>Node.js</span><span>MongoDB</span>
    </div>
  </div>
</div>
```

### Colors
All color variables are at the top of the `<style>` tag:

```css
:root {
  --orange:    #e8622a;   /* Main accent */
  --orange-lt: #ff7a3d;   /* Hover state */
  --amber:     #f59e0b;   /* Secondary accent */
  --white:     #f3ede6;   /* Text color */
  --black:     #080808;   /* Background */
  --deep:      #0f0f0f;   /* Alt section background */
  --card:      #141414;   /* Card background */
  --muted:     #666;      /* Muted text */
}
```

---

## Contact Form

The form currently shows a success message after 1.8s (no backend). To make it actually send emails, connect one of these:

- **Formspree** (easiest — no backend needed): [formspree.io](https://formspree.io)
- **EmailJS** (client-side email): [emailjs.com](https://emailjs.com)
- **Own backend**: Node.js + Nodemailer + Express endpoint

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | Full |
| Firefox 90+ | Full |
| Safari 15+ | Full |
| Edge 90+ | Full |
| Mobile Chrome | Full |
| Mobile Safari | Full |

---

## Performance

- Single file = 1 network request for HTML
- Google Fonts + GSAP loaded via CDN (cached after first visit)
- Hero photo embedded as base64 (no separate image request)
- No frameworks, no build step, instant load

---

## License

MIT — free to use, modify, and deploy.

---

## Author

**Manik**
MERN Stack Developer · India

- GitHub: [github.com/yourhandle](https://github.com/yourhandle)
- LinkedIn: [linkedin.com/in/yourhandle](https://linkedin.com/in/yourhandle)

---

> Built with HTML, CSS, Vanilla JS, and GSAP. Deployed on Vercel.
