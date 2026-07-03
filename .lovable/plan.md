# Full build plan — TruHub Solutions expansion

You picked "all", so I'll ship in 3 focused phases so each is verifiable before the next.

## Phase 1 — Content & lead capture (fastest wins)
1. **Blog CMS**
   - New table `blog_posts` (title, slug, excerpt, cover_url, body_md, tags[], published, published_at, seo_title, seo_description).
   - Public routes: `/blog` (list) + `/blog/$slug` (post) with per-post `head()` (title, description, og:image, canonical, Article JSON-LD).
   - Admin tab: list, create, edit (markdown editor), publish toggle, delete. Cover image via existing `media` bucket.
   - Sitemap includes published posts.

2. **AI chatbot** (Lovable AI Gateway, no key needed)
   - Floating widget bottom-right on public site.
   - Server route `/api/chat` streams via `google/gemini-2.5-flash`.
   - System prompt built from live CMS content (services, pricing, FAQs, about) — always current.
   - Admin toggle to enable/disable + edit extra "knowledge base" text.

3. **WhatsApp CTA + Email notifications**
   - Floating WhatsApp button (wa.me link, number from `contact_info`).
   - Lovable Emails: on new `contact_submissions` insert → email admin. Same for inquiries & bookings later.
   - Admin field: notification email address.

## Phase 2 — Estimator & Client auth
4. **Cost estimator**
   - Public `/estimate` page: multi-step form (project type, scope, timeline, addons).
   - Configurable rules table `estimator_rules` editable from admin.
   - Result: price range + "Book a call" CTA that prefills contact form.

5. **Client login (email + password self-signup)**
   - Enable email auth, disable auto-confirm off (recommended on), no anonymous.
   - `profiles` table + trigger, `user_roles` already exists (add `client` role).
   - `/auth` public route (sign in / sign up / reset).
   - `_authenticated/portal` layout gated to authenticated clients.

## Phase 3 — Client portal (biggest lift)
6. **Projects & progress tracker**
   - Tables: `projects` (client_id, name, status, progress %, start/end), `project_milestones` (title, status, due_date, order).
   - Portal shows client's projects with progress bar + milestone timeline.
   - Admin: create projects, assign to client, update milestones.

7. **File uploads / inquiry attachments**
   - Private `project-files` storage bucket, RLS scoped to project members + admin.
   - Portal: upload/download files per project.
   - Public inquiry form gains optional file upload.

8. **Custom branded meeting booking**
   - Tables: `availability_rules` (weekday, start, end), `bookings` (client_id, starts_at, duration, status, notes).
   - Public `/book`: pick date → shows free 30-min slots → confirms.
   - Email confirmation to both parties. Admin manages availability + views bookings.

## Cross-cutting (added throughout)
- **SEO**: each new public route gets `head()` with title/description/canonical/og; sitemap regenerated.
- **Analytics dashboard**: already available in Lovable's More panel; I'll add an admin summary card that links to it (native provider = fine).
- **Security**: RLS + GRANTs on every new table; role checks via `has_role`; file bucket private with owner + admin policies.

## Technical notes
- Storage: `blog-covers` (public) and `project-files` (private) buckets.
- Chatbot uses `LOVABLE_API_KEY` (already set) via `@/lib/ai-gateway.server`.
- Emails via built-in Lovable Emails — I'll scaffold transactional templates for: new inquiry, new booking, file uploaded, milestone updated.
- No new secrets required for Phase 1.

## Deliverable now
I'll build **Phase 1 in full** this turn (Blog CMS + Chatbot + WhatsApp + Email alerts), then wait for your go-ahead before Phase 2 & 3 — otherwise this becomes one giant unreviewable change.

Approve to start Phase 1.