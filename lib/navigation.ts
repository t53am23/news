import {
  BadgeCheck,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  Building2,
  Contact,
  FileText,
  FlaskConical,
  Globe2,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  MapPin,
  Newspaper,
  PlaySquare,
  Scale,
  Search,
  Shield,
  Star,
  TrendingUp
} from "lucide-react";
import type { SectionConfig } from "@/lib/types";

export const primaryNav = [
  { title: "Home", href: "/", icon: Home },
  { title: "World", href: "/world-news", icon: Globe2 },
  { title: "Local", href: "/local-news", icon: MapPin },
  { title: "Visa Watch", href: "/visa-immigration-watch", icon: FileText },
  { title: "Students", href: "/students-study-abroad", icon: GraduationCap },
  { title: "Policy", href: "/politics-policy", icon: Building2 },
  { title: "AI & Tech", href: "/ai-technology", icon: Bot },
  { title: "Cybersecurity", href: "/cybersecurity", icon: Shield },
  { title: "GitHub Trends", href: "/github-trends", icon: Laptop },
  { title: "Video Briefs", href: "/video-briefs", icon: PlaySquare },
  { title: "Saved", href: "/saved-items", icon: Bookmark }
];

export const mobileNav = [
  { title: "Home", href: "/", icon: Home },
  { title: "Explore", href: "/world-news", icon: Search },
  { title: "Saved", href: "/saved-items", icon: Bookmark },
  { title: "Sources", href: "/source-directory", icon: BadgeCheck }
];

export const coreSections: SectionConfig[] = [
  { title: "World News", slug: "world-news", category: "World", icon: "Globe2", description: "Global headlines, conflicts, diplomacy, markets, climate, and cultural shifts." },
  { title: "Local News", slug: "local-news", category: "Local", icon: "MapPin", description: "Location-aware local headlines and regional developments." },
  { title: "Visa & Immigration Watch", slug: "visa-immigration-watch", category: "Visa & Immigration", icon: "FileText", description: "Official and sourced visa, immigration, ETA, eVisa, fees, and route updates.", featuredTags: ["UK", "USA", "Canada", "Australia", "Student visa", "Skilled worker"] },
  { title: "Students & Study Abroad", slug: "students-study-abroad", category: "Students", icon: "GraduationCap", description: "Study abroad policy, funding, admissions, post-study work, and student migration updates." },
  { title: "Work, COS & Sponsorship", slug: "work-cos-sponsorship", category: "Work & Sponsorship", icon: "BriefcaseBusiness", description: "Employer sponsorship, COS, sponsor licence, right-to-work, and compliance briefings." },
  { title: "Politics & Policy", slug: "politics-policy", category: "Politics & Policy", icon: "Scale", description: "Government announcements, elections, regulation changes, and business-impacting policy." },
  { title: "AI & Technology", slug: "ai-technology", category: "AI & Technology", icon: "Bot", description: "AI, platforms, chips, product launches, regulation, and emerging technology." },
  { title: "Cybersecurity", slug: "cybersecurity", category: "Cybersecurity", icon: "Shield", description: "Vulnerabilities, threat intelligence, incidents, patches, and security operations." },
  { title: "Startups & Business", slug: "startups-business", category: "Startups & Business", icon: "TrendingUp", description: "Startups, funding, markets, operators, consumer shifts, and business intelligence." },
  { title: "Developer Trends", slug: "developer-trends", category: "Developer Trends", icon: "Laptop", description: "Frameworks, tooling, open source movement, and software engineering trend signals." },
  { title: "GitHub Trends", slug: "github-trends", category: "GitHub Trends", icon: "Star", description: "Repository trends derived from GitHub Search API signals, stars, activity, and recency." },
  { title: "Video Briefs", slug: "video-briefs", category: "Video Briefs", icon: "PlaySquare", description: "Creator and publisher explainers with internal brief pages and source attribution." },
  { title: "Podcast Briefs", slug: "podcasts", category: "Podcasts", icon: "PlaySquare", description: "Podcast discovery from open metadata and publisher-linked episode briefings." },
  { title: "Product Reviews", slug: "product-reviews", category: "Product Reviews", icon: "Newspaper", description: "Product discovery and review signals from licensed feeds or directory-only sources." },
  { title: "Research & Science", slug: "research-science", category: "Research & Science", icon: "FlaskConical", description: "Research, science, public datasets, preprints, and evidence-led discoveries." },
  { title: "Health & Lifestyle Updates", slug: "health-lifestyle-updates", category: "Health & Lifestyle", icon: "HeartPulse", description: "Public health, wellbeing, family planning, social issues, and lifestyle policy signals." },
  { title: "Human Rights", slug: "human-rights", category: "Human Rights", icon: "Contact", description: "Rights-related official updates, public-interest reporting, and sourced human-rights developments." }
];

export const footerLinks = [
  { title: "Contact/Support", href: "/contact-support" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms of Use", href: "/terms-of-use" },
  { title: "Disclaimer", href: "/disclaimer" },
  { title: "Source Directory", href: "/source-directory" }
];

export const visaCountries = ["UK", "USA", "Canada", "Australia", "Germany", "India", "China", "Malaysia", "Europe", "Africa"];

export const visaCategories = [
  "Student visa",
  "Graduate/post-study route",
  "Skilled worker",
  "COS/sponsorship",
  "Sponsor licence",
  "Family/dependant rules",
  "Visitor visa",
  "eVisa/ETA",
  "Work permit",
  "Permanent residence",
  "Citizenship",
  "Immigration fees",
  "Healthcare charges",
  "Right-to-work checks",
  "Employer compliance"
];
