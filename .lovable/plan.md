
# TruHub Solutions — Premium Website + Admin CMS

A luxury, highly-animated agency site with a hidden admin panel that drives all content from Lovable Cloud.

## 1. Foundation

- Enable **Lovable Cloud** (Supabase under the hood) for auth, database, storage.
- Install fonts (Space Grotesk + Inter via Google Fonts `<link>` in `__root.tsx`).
- Rebuild `src/styles.css` design system with the exact palette:
  - `--background #030712`, `--surface #0B1220`, `--card #111827`
  - `--primary #1EA7FF`, `--primary-2 #2563EB`, `--primary-hover #38BDF8`
  - `--text #FFFFFF`, `--muted #94A3B8`, `--border rgba(255,255,255,.08)`, `--glow rgba(30,167,255,.45)`
- Global tokens: gradients, blue glow shadows, glass blur, radii, transitions.
- Root head metadata: title, description, OG, Twitter, JSON-LD Organization schema.
- `public/robots.txt` + `/sitemap.xml` server route.
- Founder photo + logo uploaded via Lovable Assets (no binary in repo).

## 2. Public site (single `/` route with sections + separate `/admin`)

Sections in order, all animated (Framer Motion / CSS + IntersectionObserver):

1. **Loader** — TruHub logo reveal, fades out.
2. **Navbar** — transparent → glass on scroll; links: Home, About, Services, Pricing, Portfolio, Contact + "Start Your Project" CTA.
3. **Hero** — aurora gradient, floating particles, mouse parallax, headline, sub, 2 CTAs, scroll indicator, abstract tech visual.
4. **About** — copy + 4 animated counters (Projects, Clients, Satisfaction %, Support).
5. **Meet the Founder** — photo left, name/title/vision/skills right (replaces testimonials-as-reviews per your instruction; testimonials carousel kept lower).
6. **Services** — 12 cards with 3D tilt + glow hover.
7. **Why Choose Us** — 8 feature cards.
8. **Pricing** — 3 tiers, middle highlighted, glow border, feature lists exactly as specified.
9. **Additional Services** — compact grid of add-ons with prices.
10. **Portfolio** — CMS-driven cards (image, name, category, tech, description, live URL) with hover zoom + tilt.
11. **Process** — 6-step animated vertical timeline.
12. **Testimonials** — auto-sliding glass carousel, 5-star (CMS-driven).
13. **FAQ** — animated accordion (CMS-driven).
14. **Contact** — form (Name, Email, Phone, Business, Project Details) → writes to `contact_submissions`; email + phone displayed.
15. **Footer** — logo, quick links, socials, © 2026.
- **Floating WhatsApp button** persistent.

## 3. Backend schema (Lovable Cloud)

Tables (all with RLS):

- `hero_content` (single row) — headline, subtitle, cta labels
- `about_content` — copy + counter values
- `founder` — name, title, photo_url, vision, skills[]
- `services` — icon, title, description, order
- `pricing_plans` + `pricing_features` — plan, price, highlighted, features, cta
- `additional_services` — name, price
- `portfolio_items` — name, category, tech, description, image_url, live_url, order
- `testimonials` — name, role, avatar_url, quote, rating
- `faqs` — question, answer, order
- `contact_info` — email, phone, whatsapp
- `contact_submissions` — form data (insert-only from public)
- `user_roles` + `app_role` enum + `has_role()` security-definer function
- Storage bucket: `media` (public read, admin write)

**RLS pattern:**
- Public tables: `SELECT` open to `anon` + `authenticated`; `INSERT/UPDATE/DELETE` restricted to `has_role(auth.uid(), 'admin')`.
- `contact_submissions`: `INSERT` open to anon; `SELECT` admin-only.
- `user_roles`: managed via `has_role()`.

## 4. Admin (hidden)

- Route: `/admin` (protected under `_authenticated/`).
- No login/signup links anywhere on public site.
- Sign-in via **secret code gate** at `/admin`: shows a code input; on correct code (env `ADMIN_ACCESS_CODE` checked by a server function) reveals the Supabase email/password sign-in. First admin bootstrapped via seed (I'll ask you for a starting email + code).
- Admin dashboard tabs: Portfolio · Services · Pricing · Testimonials · FAQs · Hero · About · Founder · Contact Info · Submissions · Media Library.
- CRUD forms + image uploads to Storage; changes are live instantly (TanStack Query invalidation).

## 5. SEO & performance

- Per-section semantic HTML, single H1, alt text.
- JSON-LD Organization + Service schema in `__root.tsx`.
- Lazy-loaded images, preloaded hero visual.
- Meta title/description; OG + Twitter cards.

## Two things I need from you before building admin

1. **Admin email** to bootstrap (I'll grant it the `admin` role in a migration).
2. **Secret access code** for `/admin` gate (I'll store as a server secret — you can rotate anytime).

If you'd rather I pick sensible defaults (`your email` prompt at first launch + a generated code shown once), say "use defaults" and I'll proceed. Otherwise reply with the two values and I'll start.

## Technical notes

- TanStack Start + TanStack Query + Framer Motion + Tailwind v4.
- All CMS reads via public server functions using the publishable key + `TO anon` SELECT policies.
- Admin writes via `requireSupabaseAuth` server functions with `has_role` checks.
- No hardcoded colors in components — all via semantic tokens.
