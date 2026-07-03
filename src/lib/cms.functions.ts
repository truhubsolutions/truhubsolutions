import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- public server-side client (anon, RLS enforced) ----------
function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

// ---------- Public reads (used by public routes) ----------
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [hero, about, founder, services, plans, addons, portfolio, testimonials, faqs, contact, sectionMeta, whyChooseUs, processSteps] =
    await Promise.all([
      sb.from("hero_content").select("*").limit(1).maybeSingle(),
      sb.from("about_content").select("*").limit(1).maybeSingle(),
      sb.from("founder").select("*").limit(1).maybeSingle(),
      sb.from("services").select("*").order("sort_order"),
      sb.from("pricing_plans").select("*").order("sort_order"),
      sb.from("additional_services").select("*").order("sort_order"),
      sb.from("portfolio_items").select("*").order("sort_order"),
      sb.from("testimonials").select("*").order("sort_order"),
      sb.from("faqs").select("*").order("sort_order"),
      sb.from("contact_info").select("*").limit(1).maybeSingle(),
      sb.from("section_meta").select("*"),
      sb.from("why_choose_us").select("*").order("sort_order"),
      sb.from("process_steps").select("*").order("sort_order"),
    ]);
  const meta: Record<string, { eyebrow: string | null; heading: string | null; subheading: string | null; extra: string | null }> = {};
  for (const r of sectionMeta.data ?? []) {
    meta[r.section] = { eyebrow: r.eyebrow, heading: r.heading, subheading: r.subheading, extra: r.extra };
  }
  return {
    hero: hero.data,
    about: about.data,
    founder: founder.data,
    services: services.data ?? [],
    plans: plans.data ?? [],
    addons: addons.data ?? [],
    portfolio: portfolio.data ?? [],
    testimonials: testimonials.data ?? [],
    faqs: faqs.data ?? [],
    contact: contact.data,
    meta,
    whyChooseUs: whyChooseUs.data ?? [],
    processSteps: processSteps.data ?? [],
  };
});

const submissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  business_name: z.string().max(160).optional().nullable(),
  project_details: z.string().min(5).max(4000),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submissionSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { error } = await sb.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      business_name: data.business_name ?? null,
      project_details: data.project_details,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Admin secret code gate ----------
export const verifyAdminCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_ACCESS_CODE;
    if (!expected) return { ok: false as const };
    // constant-time-ish compare
    const a = data.code;
    const b = expected;
    if (a.length !== b.length) return { ok: false as const };
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return { ok: diff === 0 };
  });

// ---------- Admin: check current role ----------
export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role);
    return { userId: context.userId, roles, isAdmin: roles.includes("admin") };
  });

// ---------- Bootstrap: promote a signed-in user to admin (requires secret code) ----------
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ code: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const expected = process.env.ADMIN_ACCESS_CODE;
    if (!expected || data.code !== expected) throw new Error("Invalid access code");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Admin helpers ----------
async function requireAdmin(context: { supabase: ReturnType<typeof publicClient>; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------- Admin: generic upsert / delete over CMS tables ----------
const ADMIN_TABLES = [
  "hero_content",
  "about_content",
  "founder",
  "services",
  "pricing_plans",
  "additional_services",
  "portfolio_items",
  "testimonials",
  "faqs",
  "contact_info",
  "section_meta",
  "why_choose_us",
  "process_steps",
] as const;
type AdminTable = (typeof ADMIN_TABLES)[number];
const tableSchema = z.enum(ADMIN_TABLES);

export const adminUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: tableSchema, row: z.record(z.string(), z.any()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context as never);
    const { error, data: rows } = await context.supabase
      .from(data.table as AdminTable)
      .upsert(data.row as never)
      .select();
    if (error) throw new Error(error.message);
    return { rows };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ table: tableSchema, id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context as never);
    const { error } = await context.supabase.from(data.table as AdminTable).delete().eq("id" as never, data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Admin: list submissions ----------
export const adminListSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context as never);
    const { data, error } = await context.supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminDeleteSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await requireAdmin(context as never);
    const { error } = await context.supabase.from("contact_submissions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Admin: upload to storage, return long-lived signed URL ----------
export const adminUploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      filename: z.string().min(1),
      contentType: z.string().min(1),
      base64: z.string().min(1),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const path = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const up = await supabaseAdmin.storage.from("media").upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
    });
    if (up.error) throw new Error(up.error.message);
    // Long-lived signed URL (1 year). Refreshed on next upload.
    const signed = await supabaseAdmin.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signed.error) throw new Error(signed.error.message);
    return { url: signed.data.signedUrl, path };
  });

export const adminListMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const list = await supabaseAdmin.storage.from("media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (list.error) throw new Error(list.error.message);
    const items = await Promise.all(
      (list.data ?? []).filter((f) => f.name && !f.name.endsWith("/")).map(async (f) => {
        const s = await supabaseAdmin.storage.from("media").createSignedUrl(f.name, 60 * 60 * 24 * 30);
        return { name: f.name, url: s.data?.signedUrl ?? "" };
      }),
    );
    return items;
  });
