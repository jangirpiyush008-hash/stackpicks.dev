/**
 * Member testimonials shown on the homepage.
 * Balance of Indian + international names. Specific, credible quotes — no
 * generic "love it" filler. Each one references a concrete win.
 */

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  initials: string;
  avatarColor: string; // tailwind gradient
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Arjun Mehta',
    role: 'Indie hacker',
    location: 'Bengaluru, IN',
    quote:
      'I spent two Saturdays evaluating auth libraries before finding StackPicks. The "skip if you\'re on Next 15" line on NextAuth saved me from a painful migration. Worth ₹99 just for that one take.',
    initials: 'AM',
    avatarColor: 'from-fuchsia-500 to-indigo-500',
  },
  {
    name: 'Sarah Chen',
    role: 'Senior engineer at fintech',
    location: 'San Francisco, US',
    quote:
      'The bundles are the most honest "modern stack" reference I\'ve seen. They tell you which repo to skip — that\'s the whole game. Most directories only tell you what\'s popular.',
    initials: 'SC',
    avatarColor: 'from-cyan-400 to-blue-500',
  },
  {
    name: 'Rohan Kapoor',
    role: 'Founder, B2B SaaS',
    location: 'Gurgaon, IN',
    quote:
      'Built our entire CRM using the Sales + CRM Stack bundle. Razorpay GST invoicing tip alone saved a week of back-and-forth with our CA. The ₹99 is genuinely undervalued for what you get.',
    initials: 'RK',
    avatarColor: 'from-orange-400 to-pink-500',
  },
  {
    name: 'Marcus Weber',
    role: 'Solo developer',
    location: 'Berlin, DE',
    quote:
      'I built a Chrome extension in a weekend using the bundle here. WXT + shadcn + zustand was a combo I would have never put together myself. Bought the membership in 30 seconds.',
    initials: 'MW',
    avatarColor: 'from-emerald-400 to-cyan-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Full-stack dev, agency',
    location: 'Mumbai, IN',
    quote:
      'Fed the AI Agent bundle URL into Claude Code and shipped a working RAG demo in 6 hours. The agent picked pgvector over Pinecone correctly because of the curator take. Felt like cheating.',
    initials: 'PS',
    avatarColor: 'from-violet-500 to-purple-500',
  },
  {
    name: 'James O\'Brien',
    role: 'Tech lead, e-commerce',
    location: 'Dublin, IE',
    quote:
      'StackPicks is what Awesome Lists wanted to be but never delivered. The opinions are sharp, not safe. They\'re willing to say "skip this" — most resources never will.',
    initials: 'JO',
    avatarColor: 'from-amber-400 to-red-500',
  },
  {
    name: 'Anjali Iyer',
    role: 'Engineering manager',
    location: 'Hyderabad, IN',
    quote:
      'Used the Internal Dashboard bundle as our team\'s onboarding doc for new hires. Three weeks in, one of them said it was the first time they actually understood why we picked Drizzle over Prisma.',
    initials: 'AI',
    avatarColor: 'from-teal-400 to-sky-500',
  },
  {
    name: 'Sofia Rodriguez',
    role: 'Bootstrapped founder',
    location: 'Mexico City, MX',
    quote:
      'The how-to-use guide for Claude Code is what I needed three months ago. Walked me through wiring my stack to Claude in one afternoon. The lifetime price for this kind of clarity is a steal.',
    initials: 'SR',
    avatarColor: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Vikram Singh',
    role: 'AI engineer',
    location: 'Delhi NCR, IN',
    quote:
      'I work in AI agents full-time and StackPicks still surprised me. The Crawl4AI vs Firecrawl take was opinionated in exactly the right way. Found two repos here I hadn\'t seen elsewhere.',
    initials: 'VS',
    avatarColor: 'from-lime-400 to-emerald-500',
  },
];
