import { createFileRoute } from "@tanstack/react-router";
import { siteContentQuery, useSiteContent } from "@/hooks/use-cms";
import { SiteLoader } from "@/components/site/loader";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Founder } from "@/components/site/founder";
import { Services, WhyChooseUs } from "@/components/site/services";
import { Pricing } from "@/components/site/pricing";
import { Portfolio } from "@/components/site/portfolio";
import { Process } from "@/components/site/process";
import { FAQ } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp } from "@/components/site/whatsapp";
import { WHY_CHOOSE_US, PROCESS_STEPS } from "@/lib/site-data";


export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  component: Index,
});

const FALLBACK = {
  hero: {
    headline: "We Build Digital Experiences That Grow Businesses.",
    subtitle:
      "Premium websites, branding, AI automation and digital solutions crafted to help businesses grow online.",
    cta_primary_label: "Start Your Project",
    cta_secondary_label: "Explore Portfolio",
  },
  about: {
    heading: "A luxury technology studio for ambitious brands.",
    body: "TruHub Solutions crafts premium digital experiences that convert.",
    stat_projects: 120,
    stat_clients: 80,
    stat_satisfaction: 99,
    stat_support: "24/7",
  },
  founder: {
    name: "Jayanth Gone",
    title: "Founder & Chairman",
    vision:
      "To turn every business we touch into a category-defining digital brand — with design that inspires, technology that scales, and craft that lasts.",
    skills: ["Web Development", "UI/UX Design", "Branding", "Digital Solutions"],
    photo_url: null,
  },
  contact: { email: "truhub.solutions@gmail.com", phone: "+91 7989367882", whatsapp: "917989367882" },
};

function Index() {
  const { data } = useSiteContent();
  const hero = data?.hero ?? FALLBACK.hero;
  const about = data?.about ?? FALLBACK.about;
  const founder = data?.founder ?? FALLBACK.founder;
  const contact = data?.contact ?? FALLBACK.contact;

  return (
    <div className="relative min-h-screen bg-background text-white">
      <SiteLoader />
      <Navbar />
      <main>
        <Hero
          headline={hero.headline}
          subtitle={hero.subtitle}
          ctaPrimary={hero.cta_primary_label}
          ctaSecondary={hero.cta_secondary_label}
        />
        <About
          heading={about.heading}
          body={about.body}
          stats={{
            projects: about.stat_projects,
            clients: about.stat_clients,
            satisfaction: about.stat_satisfaction,
            support: about.stat_support,
          }}
        />
        <Founder
          name={founder.name}
          title={founder.title}
          vision={founder.vision}
          skills={founder.skills}
          photoUrl={founder.photo_url}
        />
        <Services items={data?.services ?? []} />
        <WhyChooseUs items={WHY_CHOOSE_US} />
        <Pricing plans={data?.plans ?? []} addons={data?.addons ?? []} />
        <Portfolio items={data?.portfolio ?? []} />
        <Process steps={PROCESS_STEPS} />
        <Testimonials items={data?.testimonials ?? []} />
        <FAQ items={data?.faqs ?? []} />
        <Contact email={contact.email} phone={contact.phone} />
      </main>
      <Footer email={contact.email} phone={contact.phone} />
      <FloatingWhatsApp number={contact.whatsapp} />
    </div>
  );
}
