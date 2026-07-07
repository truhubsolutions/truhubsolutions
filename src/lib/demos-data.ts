export type DemoFeature = string;

export type DemoSection = {
  id: string;
  title: string;
  kind: "hero" | "grid" | "list" | "cta" | "gallery" | "table" | "form" | "text";
  items?: Array<{ title: string; description?: string; image?: string; meta?: string }>;
  body?: string;
};

export type Demo = {
  slug: string;
  industry: string;
  icon: string; // emoji fallback
  tagline: string;
  description: string;
  thumbnail: string;
  accent: string; // hex
  startingPrice: number; // INR
  features: DemoFeature[];
  pages: string[];
  sections: DemoSection[];
  enabled?: boolean;
};

const COMMON_FEATURES = [
  "Responsive",
  "WhatsApp Integration",
  "Booking System",
  "SEO Optimized",
  "Modern UI",
  "Mobile Friendly",
];

const img = (q: string, sig: number) =>
  `https://images.unsplash.com/photo-${sig}?auto=format&fit=crop&w=1200&q=70&ixlib=rb-4.0.3&${q}`;

export const DEMOS: Demo[] = [
  {
    slug: "restaurant",
    industry: "Restaurant",
    icon: "🍽️",
    tagline: "Premium Restaurant Website",
    description: "Elegant restaurant site with digital menu, online reservations and gallery.",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=70",
    accent: "#F59E0B",
    startingPrice: 14999,
    features: [...COMMON_FEATURES, "Digital Menu", "Table Reservation"],
    pages: ["Home", "About", "Menu", "Gallery", "Offers", "Reservation", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "A Taste Beyond Ordinary", body: "Farm-fresh ingredients, chef-crafted flavors, unforgettable moments." },
      { id: "menu", kind: "grid", title: "Signature Menu", items: [
        { title: "Truffle Risotto", meta: "₹649", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=70" },
        { title: "Wagyu Steak", meta: "₹1499", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=70" },
        { title: "Wood-fired Pizza", meta: "₹499", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=70" },
        { title: "Chocolate Lava", meta: "₹299", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=70" },
      ]},
      { id: "gallery", kind: "gallery", title: "Ambience Gallery", items: [
        { title: "", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=70" },
        { title: "", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=70" },
        { title: "", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=70" },
      ]},
      { id: "chef", kind: "text", title: "Meet the Chef", body: "Chef Marco brings 20 years of Michelin-star experience from Milan to your table." },
      { id: "hours", kind: "list", title: "Opening Hours", items: [
        { title: "Mon – Thu", meta: "12:00 – 23:00" },
        { title: "Fri – Sat", meta: "12:00 – 01:00" },
        { title: "Sunday", meta: "13:00 – 22:00" },
      ]},
      { id: "reserve", kind: "form", title: "Book Your Table" },
    ],
  },
  {
    slug: "cafe-bakery",
    industry: "Cafe & Bakery",
    icon: "☕",
    tagline: "Warm Cafe & Artisan Bakery",
    description: "Cozy cafe website with product catalog, order-ahead and loyalty program.",
    thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=70",
    accent: "#D97706",
    startingPrice: 12999,
    features: [...COMMON_FEATURES, "Online Ordering", "Loyalty Program"],
    pages: ["Home", "Menu", "Story", "Order Online", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Freshly Brewed. Freshly Baked.", body: "Small-batch coffee and handcrafted pastries daily." },
      { id: "menu", kind: "grid", title: "Today's Specials", items: [
        { title: "Cappuccino", meta: "₹180", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=70" },
        { title: "Croissant", meta: "₹120", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=70" },
        { title: "Sourdough Loaf", meta: "₹220", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "corporate",
    industry: "Corporate Company",
    icon: "🏢",
    tagline: "Modern Corporate Website",
    description: "Professional corporate site with services, portfolio, team and testimonials.",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=70",
    accent: "#2563EB",
    startingPrice: 24999,
    features: [...COMMON_FEATURES, "Case Studies", "Team Profiles"],
    pages: ["Home", "Services", "Portfolio", "Team", "Testimonials", "Pricing", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Enterprise Solutions, Delivered.", body: "We help Fortune 500s scale with modern technology and design." },
      { id: "services", kind: "grid", title: "Our Services", items: [
        { title: "Consulting", description: "Digital transformation strategy" },
        { title: "Engineering", description: "Custom software development" },
        { title: "Analytics", description: "Data-driven decisions" },
        { title: "Cloud", description: "Migration & DevOps" },
      ]},
      { id: "team", kind: "grid", title: "Leadership Team", items: [
        { title: "Sarah Kim", meta: "CEO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=70" },
        { title: "David Chen", meta: "CTO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=70" },
        { title: "Priya Rao", meta: "COO", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=70" },
      ]},
    ],
  },
  {
    slug: "school",
    industry: "School / Coaching",
    icon: "🎓",
    tagline: "Modern School & Coaching Website",
    description: "Beautiful school website with admissions, courses, faculty and notice board.",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=70",
    accent: "#7C3AED",
    startingPrice: 17999,
    features: [...COMMON_FEATURES, "Online Admissions", "Notice Board"],
    pages: ["Home", "Admissions", "Courses", "Faculty", "Gallery", "Notice Board", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Shaping Tomorrow's Leaders", body: "Rigorous academics, holistic development, personalized mentorship." },
      { id: "courses", kind: "grid", title: "Popular Courses", items: [
        { title: "JEE Advanced", description: "2-year residential program", meta: "₹1.2L/yr" },
        { title: "NEET Elite", description: "Medical entrance mastery", meta: "₹1.4L/yr" },
        { title: "Foundation", description: "Class 8–10 accelerator", meta: "₹60K/yr" },
      ]},
      { id: "notice", kind: "list", title: "Notice Board", items: [
        { title: "Admissions Open for 2026-27", meta: "Jul 08" },
        { title: "Annual Sports Meet on Aug 12", meta: "Jul 05" },
        { title: "Parent-Teacher Meet", meta: "Jul 01" },
      ]},
    ],
  },
  {
    slug: "ecommerce",
    industry: "E-Commerce Store",
    icon: "🛒",
    tagline: "Premium E-Commerce Storefront",
    description: "High-converting online store with product catalog, cart and checkout.",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=70",
    accent: "#EC4899",
    startingPrice: 29999,
    features: [...COMMON_FEATURES, "Shopping Cart", "Secure Checkout", "Product Search"],
    pages: ["Homepage", "Categories", "Product Details", "Shopping Cart", "Checkout"],
    sections: [
      { id: "hero", kind: "hero", title: "Shop the Season's Best", body: "Free shipping on orders over ₹999. Easy returns." },
      { id: "products", kind: "grid", title: "Trending Now", items: [
        { title: "Leather Jacket", meta: "₹4,999", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=70" },
        { title: "Sneakers", meta: "₹3,499", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=70" },
        { title: "Sunglasses", meta: "₹1,299", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=70" },
        { title: "Backpack", meta: "₹2,199", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "salon-spa",
    industry: "Salon & Spa",
    icon: "💇",
    tagline: "Luxury Salon & Spa Website",
    description: "Elegant salon site with service pricing, appointment booking and reviews.",
    thumbnail: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=70",
    accent: "#F472B6",
    startingPrice: 13999,
    features: [...COMMON_FEATURES, "Appointment Booking", "Stylist Selection"],
    pages: ["Home", "Services", "Pricing", "Book Appointment", "Gallery", "Reviews"],
    sections: [
      { id: "hero", kind: "hero", title: "Beauty. Redefined.", body: "Award-winning stylists. Premium products. Unforgettable experience." },
      { id: "services", kind: "list", title: "Services & Pricing", items: [
        { title: "Signature Haircut", meta: "₹1,500" },
        { title: "Hair Color", meta: "₹3,500" },
        { title: "Deep Tissue Massage", meta: "₹2,800" },
        { title: "Facial + Cleanup", meta: "₹2,200" },
      ]},
    ],
  },
  {
    slug: "gym-fitness",
    industry: "Gym & Fitness",
    icon: "💪",
    tagline: "High-Energy Gym Website",
    description: "Bold gym website with membership plans, trainers and class timetable.",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=70",
    accent: "#EF4444",
    startingPrice: 15999,
    features: [...COMMON_FEATURES, "Membership Signup", "Class Timetable"],
    pages: ["Home", "Membership Plans", "Trainers", "Timetable", "Gallery", "Join Now"],
    sections: [
      { id: "hero", kind: "hero", title: "Train Hard. Live Strong.", body: "Elite trainers, world-class equipment, results-driven programs." },
      { id: "plans", kind: "grid", title: "Membership Plans", items: [
        { title: "Basic", meta: "₹1,499/mo", description: "Gym access + locker" },
        { title: "Pro", meta: "₹2,499/mo", description: "+ Group classes + trainer" },
        { title: "Elite", meta: "₹4,999/mo", description: "+ Nutrition + PT sessions" },
      ]},
      { id: "timetable", kind: "table", title: "Class Timetable", items: [
        { title: "HIIT", meta: "Mon 7am · Wed 7pm · Fri 6am" },
        { title: "Yoga", meta: "Tue 8am · Thu 6pm · Sat 9am" },
        { title: "CrossFit", meta: "Mon 6pm · Wed 6am · Fri 7pm" },
      ]},
    ],
  },
  {
    slug: "clinic-hospital",
    industry: "Clinic / Hospital",
    icon: "🏥",
    tagline: "Modern Clinic & Hospital Website",
    description: "Trustworthy medical website with doctors, departments and appointment booking.",
    thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=70",
    accent: "#10B981",
    startingPrice: 19999,
    features: [...COMMON_FEATURES, "Doctor Profiles", "Appointment Booking", "Emergency Contact"],
    pages: ["Home", "Doctors", "Departments", "Book Appointment", "Testimonials", "Emergency"],
    sections: [
      { id: "hero", kind: "hero", title: "Care You Can Trust", body: "150+ specialists, 24/7 emergency, world-class facilities." },
      { id: "departments", kind: "grid", title: "Departments", items: [
        { title: "Cardiology", description: "Heart care specialists" },
        { title: "Neurology", description: "Brain & nervous system" },
        { title: "Orthopedics", description: "Bones & joints" },
        { title: "Pediatrics", description: "Child healthcare" },
      ]},
      { id: "doctors", kind: "grid", title: "Meet Our Doctors", items: [
        { title: "Dr. Anita Sharma", meta: "Cardiologist · 20yr", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=70" },
        { title: "Dr. Rohan Verma", meta: "Neurologist · 15yr", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=70" },
        { title: "Dr. Meera Iyer", meta: "Pediatrician · 12yr", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=70" },
      ]},
    ],
  },
  {
    slug: "real-estate",
    industry: "Real Estate",
    icon: "🏘️",
    tagline: "Premium Real Estate Website",
    description: "Modern property listings with search, agent profiles and site visit booking.",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70",
    accent: "#0EA5E9",
    startingPrice: 22999,
    features: [...COMMON_FEATURES, "Property Listings", "Agent Profiles", "Site Visit Booking"],
    pages: ["Home", "Listings", "Property Details", "Agents", "Book Visit", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Find Your Dream Home", body: "Handpicked luxury properties across India's top cities." },
      { id: "listings", kind: "grid", title: "Featured Properties", items: [
        { title: "3BHK Sky Villa · Bangalore", meta: "₹2.4 Cr", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=70" },
        { title: "4BHK Penthouse · Mumbai", meta: "₹8.9 Cr", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=70" },
        { title: "Farm House · Hyderabad", meta: "₹3.6 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "travel-tourism",
    industry: "Travel & Tourism",
    icon: "✈️",
    tagline: "Immersive Travel Website",
    description: "Wanderlust-inducing travel site with tour packages, itineraries and booking.",
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=70",
    accent: "#06B6D4",
    startingPrice: 18999,
    features: [...COMMON_FEATURES, "Tour Packages", "Itinerary Builder"],
    pages: ["Home", "Destinations", "Packages", "Book Trip", "Reviews", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Adventures Await", body: "Curated experiences across 40+ countries." },
      { id: "packages", kind: "grid", title: "Popular Packages", items: [
        { title: "Bali Escape · 6D5N", meta: "₹54,999", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=70" },
        { title: "Swiss Alps · 8D7N", meta: "₹1,89,000", image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=70" },
        { title: "Kerala Backwaters · 5D4N", meta: "₹32,499", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "hotel-resort",
    industry: "Hotel & Resort",
    icon: "🏨",
    tagline: "Luxury Hotel & Resort Website",
    description: "Elegant hotel site with room booking, amenities, restaurant and reviews.",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70",
    accent: "#A78BFA",
    startingPrice: 21999,
    features: [...COMMON_FEATURES, "Room Booking", "Amenity Showcase"],
    pages: ["Home", "Rooms", "Amenities", "Gallery", "Restaurant", "Book Now", "Reviews"],
    sections: [
      { id: "hero", kind: "hero", title: "Escape into Elegance", body: "5-star hospitality where every detail is designed to delight." },
      { id: "rooms", kind: "grid", title: "Our Rooms", items: [
        { title: "Deluxe Suite", meta: "₹12,000/night", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=70" },
        { title: "Ocean View", meta: "₹18,500/night", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=70" },
        { title: "Presidential", meta: "₹42,000/night", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "law-firm",
    industry: "Law Firm",
    icon: "⚖️",
    tagline: "Distinguished Law Firm Website",
    description: "Authoritative law firm site with practice areas, attorneys and consultation.",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=70",
    accent: "#F59E0B",
    startingPrice: 19999,
    features: [...COMMON_FEATURES, "Consultation Booking", "Case Studies"],
    pages: ["Home", "Practice Areas", "Attorneys", "Cases", "Consultation", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Legal Expertise. Trusted Results.", body: "Three decades defending India's most complex cases." },
      { id: "areas", kind: "grid", title: "Practice Areas", items: [
        { title: "Corporate Law", description: "M&A, compliance, contracts" },
        { title: "Criminal Defense", description: "White-collar & civil rights" },
        { title: "Family Law", description: "Divorce, custody, estate" },
        { title: "IP & Patents", description: "Trademark & tech disputes" },
      ]},
    ],
  },
  {
    slug: "automobile",
    industry: "Automobile",
    icon: "🚗",
    tagline: "Sleek Automobile Website",
    description: "Modern auto showroom site with car catalog, test drive booking and finance.",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=70",
    accent: "#DC2626",
    startingPrice: 17999,
    features: [...COMMON_FEATURES, "Test Drive Booking", "Vehicle Catalog"],
    pages: ["Home", "Models", "Test Drive", "Finance", "Service", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Engineered to Excite", body: "Performance, luxury and technology — redefined." },
      { id: "models", kind: "grid", title: "Latest Models", items: [
        { title: "GT Coupe", meta: "₹42.5 L", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=70" },
        { title: "Electric SUV", meta: "₹58.9 L", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=70" },
        { title: "Sport Sedan", meta: "₹34.9 L", image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "boutique",
    industry: "Boutique",
    icon: "👗",
    tagline: "Chic Boutique Website",
    description: "Stylish boutique store with lookbook, product catalog and appointment.",
    thumbnail: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=70",
    accent: "#E11D48",
    startingPrice: 13999,
    features: [...COMMON_FEATURES, "Lookbook", "Personal Styling"],
    pages: ["Home", "Collections", "Lookbook", "Book Stylist", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Fashion, Curated.", body: "Handpicked pieces from India's finest designers." },
      { id: "collections", kind: "grid", title: "New Arrivals", items: [
        { title: "Silk Saree", meta: "₹18,500", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=70" },
        { title: "Bridal Lehenga", meta: "₹85,000", image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=70" },
        { title: "Designer Kurti", meta: "₹4,200", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=70" },
      ]},
    ],
  },
  {
    slug: "event-management",
    industry: "Event Management",
    icon: "🎉",
    tagline: "Vibrant Event Management Website",
    description: "Dynamic event site with services, portfolio, booking and vendor showcase.",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=70",
    accent: "#8B5CF6",
    startingPrice: 16999,
    features: [...COMMON_FEATURES, "Event Booking", "Portfolio Gallery"],
    pages: ["Home", "Services", "Portfolio", "Book Event", "Vendors", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Unforgettable Events, Effortlessly Planned", body: "Weddings, corporate galas, launches — we handle every detail." },
      { id: "services", kind: "grid", title: "What We Do", items: [
        { title: "Weddings", description: "End-to-end wedding planning" },
        { title: "Corporate", description: "Product launches & conferences" },
        { title: "Birthdays", description: "Milestone celebrations" },
        { title: "Concerts", description: "Live shows & festivals" },
      ]},
    ],
  },
  {
    slug: "ngo",
    industry: "NGO",
    icon: "🤝",
    tagline: "Impactful NGO Website",
    description: "Purposeful NGO site with campaigns, donations, volunteer signup and impact.",
    thumbnail: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=70",
    accent: "#059669",
    startingPrice: 12999,
    features: [...COMMON_FEATURES, "Donation Integration", "Volunteer Signup"],
    pages: ["Home", "Causes", "Donate", "Volunteer", "Impact", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Small Acts. Big Change.", body: "Join 50,000+ changemakers building a better tomorrow." },
      { id: "causes", kind: "grid", title: "Our Causes", items: [
        { title: "Child Education", description: "Sponsoring 10,000+ students" },
        { title: "Clean Water", description: "Wells across rural India" },
        { title: "Women Empowerment", description: "Skill-building programs" },
      ]},
    ],
  },
  {
    slug: "health-wellness",
    industry: "Health & Wellness",
    icon: "🧘",
    tagline: "Serene Health & Wellness Website",
    description: "Calming wellness site with programs, therapists, blog and booking.",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=70",
    accent: "#14B8A6",
    startingPrice: 14999,
    features: [...COMMON_FEATURES, "Session Booking", "Program Catalog"],
    pages: ["Home", "Programs", "Therapists", "Blog", "Book Session", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Mind. Body. Balance.", body: "Holistic wellness programs tailored to you." },
      { id: "programs", kind: "grid", title: "Programs", items: [
        { title: "Yoga Therapy", meta: "8 weeks · ₹8,000" },
        { title: "Meditation Retreat", meta: "3 days · ₹15,000" },
        { title: "Nutrition Coaching", meta: "1:1 · ₹5,000/mo" },
      ]},
    ],
  },
  {
    slug: "tuition-classes",
    industry: "Tuition Classes",
    icon: "📚",
    tagline: "Focused Tuition Center Website",
    description: "Clean tuition center site with courses, schedules, faculty and enrollment.",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=70",
    accent: "#6366F1",
    startingPrice: 11999,
    features: [...COMMON_FEATURES, "Course Enrollment", "Batch Schedules"],
    pages: ["Home", "Courses", "Faculty", "Schedule", "Enroll", "Contact"],
    sections: [
      { id: "hero", kind: "hero", title: "Personalized Coaching That Works", body: "Small batches. Expert faculty. Proven results." },
      { id: "courses", kind: "grid", title: "Our Courses", items: [
        { title: "Class 10 CBSE", meta: "All subjects · ₹18K/yr" },
        { title: "Class 12 Science", meta: "PCM · ₹32K/yr" },
        { title: "IIT-JEE Foundation", meta: "Class 9-10 · ₹40K/yr" },
      ]},
    ],
  },
];

export function getDemo(slug: string): Demo | undefined {
  return DEMOS.find(d => d.slug === slug);
}
