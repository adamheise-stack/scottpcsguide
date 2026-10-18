// Site-wide settings. SITE_URL must be the full public base URL INCLUDING any
// GitHub Pages path prefix, with no trailing slash, e.g.
//   https://adamheise-stack.github.io/pcstoscott   (default, live)
//   https://pcstoscott.pages.dev                   (if moved to Cloudflare Pages)
export default {
  name: "PCS to Scott",
  tagline: "A neighborly, independent guide for military families moving to Scott AFB, Illinois",
  url: (process.env.SITE_URL || "https://adamheise-stack.github.io/pcstoscott").replace(/\/$/, ""),
  locale: "en_US",
  owner: "Adam",
  ogImage: "/assets/img/og-default.png",
  buildDate: new Date().toISOString(),
  // Optional: Cloudflare Web Analytics token (free, cookie-free). Empty = no script.
  cfAnalyticsToken: process.env.CF_ANALYTICS_TOKEN || "",
};
