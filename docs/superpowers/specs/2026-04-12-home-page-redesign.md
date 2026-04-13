# Home Page Redesign — Design Spec
**Date:** 2026-04-12  
**Ticket:** [Home Page Implementation](https://www.notion.so/335631ffd455805fbb05f2a499915d05)  
**Figma:** https://www.figma.com/design/KDYlTmVUxhdwh5m6hHL328/Website-Redesign-2026?node-id=1-6  
**Assignee:** Fadi Ismail  
**Due:** 2026-04-20

---

## Scope

Full replacement of the home route (`/`). Rewrites `Home.js` and removes the inline `<About_us />` render from it. The `/about-us` route and `About_us.js` file remain untouched. The "Who We Are" CTA links to `/leadership`.

---

## Architecture

**Approach:** Section components (Approach B). `Home.js` becomes a thin assembler. Each section is its own component with its own CSS file — matching existing project conventions.

### Files Created

```
src/
  pages/
    Home.js                          (rewritten — thin assembler)
  components/
    home/
      HeroSection.js
      MissionSection.js
      SponsorsCarousel.js
      PillarsSection.js
      HappeningsSection.js
  styles/
    home.css                         (rewritten — page-level only)
    hero.css
    mission.css
    sponsors.css
    pillars.css
    happenings.css
  images/
    homes/
      hero-photo.jpg                 (downloaded from Figma asset)
      sponsor-accenture.png
      sponsor-bloomberg.png
      sponsor-capitalone.png
      sponsor-datadog.png
      sponsor-ey.png
      sponsor-figma.png
      sponsor-hrt.png
      sponsor-janestreet.png
      sponsor-linkedin.png
      sponsor-roblox.png
      sponsor-visa.png
      pillar-academic.jpg
      pillar-profdev.jpg
      pillar-community.jpg
      mission-banner.jpg             (TODO: extract Figma node 107:149 when rate limit resets)
      event-1.jpg                    (TODO: extract from Figma when rate limit resets)
      event-2.jpg                    (TODO: extract from Figma when rate limit resets)
      event-3.jpg                    (TODO: extract from Figma when rate limit resets)
      event-4.jpg                    (TODO: extract from Figma when rate limit resets)
```

---

## Sections

### 1. HeroSection
- **Background:** `#1f1f1f` (dark)
- **Layout:** two-column flex row; left = text + CTAs, right = hero photo
- **Content:**
  - H1: "Underrepresented Minorities in Computing" (Montserrat ExtraBold, 64px, white)
  - Subtitle: "Building a supportive community for **Black**, **Latinx**, and **Indigenous** students since 2016" — highlighted words in `#eeb50c`
  - CTA 1: "Get Involved" → `/getting-involved` — filled button, `#eeb50c` bg, dark text, `border-radius: 20px`
  - CTA 2: "Who We Are" → `/leadership` — outline button, white border, white text
- **Image:** `images/homes/hero-photo.jpg` (right side, ~718×478px)
- **Responsive:** stack vertically on mobile, photo below text

### 2. MissionSection
- **Layout:** full-width banner, photo as background with text overlay
- **Content:** "The purpose of URMC is to advance diversity in computing by supporting and empowering Black, Latinx, and Indigenous students pursuing careers in technology."
- **Image:** `images/homes/mission-banner.jpg` (TODO placeholder until Figma rate limit resets — node `107:149`)
- **Text:** white, Montserrat, centered, overlaid on photo

### 3. SponsorsCarousel
- **Background:** `#f5f5f5` (light gray)
- **Heading:** "Our Sponsors" (Montserrat SemiBold, 48px, centered, black)
- **Carousel:** auto-scrolling infinite loop using `react-slick` (already in `package.json`); component imports `slick-carousel/slick/slick.css` and `slick-carousel/slick/slick-theme.css`
- **Logos (11):** Accenture, Bloomberg, Capital One, Datadog, EY, Figma, HRT, Jane Street, LinkedIn, Roblox, Visa — all downloaded to `images/homes/`
- **Settings:** `autoplay: true`, `autoplaySpeed: 0`, `cssEase: 'linear'`, `speed: 5000`, `slidesToShow: 6`, responsive breakpoints for mobile

### 4. PillarsSection
- **Background:** `#1f1f1f` (dark)
- **Heading:** "Our 3 Pillars" (Montserrat SemiBold, 48px, white, centered)
- **Cards:** 3 equal square cards side by side, each 486×486px, `overflow: hidden`
- **Default state:** photo fills card, pillar title text (Montserrat ExtraBold, 28px, white) bottom-left, slight dark gradient overlay at bottom
- **Hover state:** dark overlay fades in over photo (`transition: opacity 0.3s ease`), description text + bullet list appears (from Figma content)
- **Pillar content:**
  - **Academic Support** — "We support academic success in computing courses through collaborative resources and structured guidance." Bullets: Slack channels for academic help · Office hours and peer support · Prelim review sessions · TA connections and resource database
  - **Professional Development** — "We prepare members to succeed in the tech industry with hands-on career support and opportunities." Bullets: Company-sponsored recruitment events · Technical and behavioral mock interviews · Resume reviews and curated resume book · Semesterly professional headshots
  - **Community Building** — "We foster a strong, supportive community where members connect, grow, and belong." Bullets: M&M Mentorship Program · Social events and general body meetings · Peer connection and community spaces · Partnerships with organizations like NSBE and SHPE
- **Responsive:** stack cards vertically on mobile

### 5. HappeningsSection
- **Background:** white
- **Heading:** "URMC Happenings" (Montserrat SemiBold, 48px) + "View all events" link → `/events`
- **Event:** "10-Year Anniversary Celebration" (static hardcoded content)
- **Photo grid:** 4 images in a row — 1 tall image (far left), 2 stacked images (center), 1 tall image (far right) — matching Figma layout (placeholders until Figma rate limit resets — nodes `135:47`, `141:142`, `135:49`, `135:50`)
- **Description:** "Our 10-Year Anniversary in March 2026 brought together students, alumni, and faculty to celebrate a decade of impact in computing. From alumni panels to performances and reconnecting, it was a day to remember."
- **CTA:** "See the Recap" → `https://www.instagram.com/p/DW9YIMwkQWi/?img_index=2&igsh=MWkya2Z2c2l1ZWtuMw==` (opens in new tab)

---

## Home.js (thin assembler)

```jsx
import { useScale } from "../hooks/useScale";
import Navbar from "../components/Navbar";
import HeroSection from "../components/home/HeroSection";
import MissionSection from "../components/home/MissionSection";
import SponsorsCarousel from "../components/home/SponsorsCarousel";
import PillarsSection from "../components/home/PillarsSection";
import HappeningsSection from "../components/home/HappeningsSection";
import "../styles/home.css";

export default function Home() {
  useScale();
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <SponsorsCarousel />
      <PillarsSection />
      <HappeningsSection />
    </div>
  );
}
```

Footer continues to be rendered by `App.js` — no change needed there.

---

## Styling Conventions

- Plain CSS files per section, imported directly in the component
- No Tailwind, no CSS-in-JS
- Font: `Montserrat` from `@fontsource/montserrat` (already installed)
- Colors: `#1f1f1f` (dark bg), `#eeb50c` (gold/yellow), `#f5f5f5` (light gray), `#ffffff`
- Responsive via `@media (max-width: 768px)` breakpoints, matching existing convention

---

## Testing

Tests use `@testing-library/react` (already installed). Written before implementation (TDD).

| Test file | What it covers |
|-----------|---------------|
| `HeroSection.test.js` | Renders heading, subtitle, both CTA links with correct hrefs |
| `SponsorsCarousel.test.js` | Renders all 11 sponsor images with alt text |
| `PillarsSection.test.js` | Renders 3 pillar titles; hover reveals description text |
| `HappeningsSection.test.js` | Renders event title, description, Instagram link (correct href, target=_blank) |
| `MissionSection.test.js` | Renders mission statement text |
| `Home.test.js` | All 5 section components render without crashing |

---

## Out of Scope

- Updating `Navbar.js` styles to match Figma nav redesign (separate ticket)
- `About_us.js` changes — route `/about-us` stays untouched
- Dynamic event content from Supabase — happenings section is static
- Extracting `mission-banner.jpg` and 4 event photos — blocked by Figma rate limit, TODO placeholders left with clear comments
