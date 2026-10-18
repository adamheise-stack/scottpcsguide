// Sponsor / paid placement components. Placements mirror ads/rate-card.md.
// SAFETY RULES BUILT IN (do not remove):
//   - Every paid placement renders a visible "Sponsored"/"Sponsor" label.
//   - Every link these components emit uses rel="sponsored noopener" (see sponsoredLink()).
//   - The site-wide transform in eleventy.config.js also forces rel="sponsored noopener" on
//     any <a data-sponsored> and on every external link inside a sponsored article.
import { readFileSync } from "node:fs";

export const SPONSORED_REL = "sponsored noopener";
const loadSponsors = () => JSON.parse(readFileSync(new URL("../_data/sponsors.json", import.meta.url), "utf8"));
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const active = (s) => !!(s && s.name && s.url) && !(s.start && today() < s.start) && !(s.end && today() > s.end);

// The ONLY way a component renders a paid link.
export function sponsoredLink(url, text, extraClass = "") {
  return `<a class="sponsor__cta ${extraClass}" href="${esc(url)}" rel="${SPONSORED_REL}" target="_blank" data-sponsored>${esc(text)}<span class="visually-hidden"> (sponsored link, opens in new tab)</span></a>`;
}
const telLink = (phone) =>
  phone ? `<a class="sponsor__tel" href="tel:${esc(phone.replace(/[^0-9+]/g, ""))}" rel="${SPONSORED_REL}" data-sponsored>Call ${esc(phone)}</a>` : "";
const logo = (s, w = 120, h = 48) =>
  s.logo ? `<img class="sponsor__logo" src="${esc(s.logo)}" alt="${esc(s.name)} logo" width="${w}" height="${h}" loading="lazy" decoding="async">` : "";
const available = (what, note = "") => `<p class="sponsor__label">Sponsor slot - available</p>
  <p class="sponsor__text"><strong>${esc(what)}</strong>${note ? ` · ${esc(note)}` : ""}</p>
  <a class="sponsor__house" href="/about/#sponsorship">How sponsorship works</a>`;

// Rate card #3: homepage banner, max 3 rotating. {% sponsorBanner %}
// No-JS: first active sponsor shows (order rotated by build week so it varies between builds).
// JS: a tiny inline script picks one at random. All items share one grid cell, so no layout shift.
export function sponsorBanner() {
  const cfg = loadSponsors().homepageBanner;
  const list = (cfg.sponsors || []).filter(active).slice(0, cfg.max || 3);
  if (!list.length) {
    return `<aside class="sponsor sponsor--banner sponsor--empty" aria-label="Sponsor slot" data-slot="home-banner">${available("Homepage sponsor banner", "up to 3 rotating sponsors")}</aside>`;
  }
  const week = Math.floor(Date.now() / 6048e5);
  const ordered = list.map((_, i) => list[(i + week) % list.length]);
  const items = ordered
    .map((s, i) => `<div class="banner__item${i === 0 ? " is-on" : ""}"${i === 0 ? "" : ' aria-hidden="true"'}>
    <p class="sponsor__label">${s.founding ? "Founding Sponsor" : "Sponsor"}</p>
    ${logo(s, 160, 64)}<p class="sponsor__name">${esc(s.name)}</p>${s.text ? `<p class="sponsor__text">${esc(s.text)}</p>` : ""}
    ${sponsoredLink(s.url, s.cta || "Visit website")}
  </div>`).join("\n");
  const js = ordered.length > 1
    ? `<script>(function(){var b=document.currentScript.parentNode,it=b.querySelectorAll('.banner__item'),n=Math.floor(Math.random()*it.length);for(var i=0;i<it.length;i++){var on=i===n;it[i].classList.toggle('is-on',on);on?it[i].removeAttribute('aria-hidden'):it[i].setAttribute('aria-hidden','true');}})();</script>`
    : "";
  return `<aside class="sponsor sponsor--banner" aria-label="Sponsored" data-slot="home-banner"><div class="banner__stack">${items}</div>${js}</aside>`;
}

// Rate card #2: exclusive category sponsor, "Sponsored by [Business]" at the top of the
// category page and its related guides. {% categorySponsor section %}
export function categorySponsor(section) {
  const cat = loadSponsors().categories?.[section];
  if (!cat) return "";
  const s = cat.exclusiveSponsor;
  if (active(s)) {
    return `<aside class="sponsor sponsor--category" aria-label="Category sponsor" data-slot="category-sponsor:${esc(section)}">
  <p class="sponsor__label">Sponsored</p><p class="sponsor__text">${esc(cat.label)} section sponsored by <strong>${esc(s.name)}</strong>. ${sponsoredLink(s.url, s.cta || "Visit website", "sponsor__inline")}</p>
</aside>`;
  }
  return `<aside class="sponsor sponsor--category sponsor--empty" aria-label="Sponsor slot" data-slot="category-sponsor:${esc(section)}">${available(`Exclusive ${cat.label} sponsor`, "one per category")}</aside>`;
}

// Rate card #1: featured listings on each category landing page, max 2. {% featuredListings section %}
export function featuredListings(section) {
  const cat = loadSponsors().categories?.[section];
  if (!cat) return "";
  const list = (cat.featured || []).filter(active).slice(0, 2);
  // The exclusive sponsor also gets a featured listing ("everything in #1").
  if (active(cat.exclusiveSponsor) && !list.some((s) => s.name === cat.exclusiveSponsor.name)) list.unshift(cat.exclusiveSponsor);
  const cards = list.map((s) => `<li class="sponsor sponsor--featured" data-slot="featured:${esc(section)}">
    <p class="sponsor__label">Sponsored</p>${logo(s)}
    <p class="sponsor__name">${esc(s.name)}</p>
    ${s.text ? `<p class="sponsor__text">${esc(s.text)}</p>` : ""}${s.offer ? `<p class="sponsor__offer">${esc(s.offer)}</p>` : ""}
    <p class="sponsor__actions">${sponsoredLink(s.url, s.cta || "Visit website")} ${telLink(s.phone)}</p>
  </li>`);
  while (cards.length < 2) {
    cards.push(`<li class="sponsor sponsor--featured sponsor--empty" data-slot="featured:${esc(section)}">${available(`Featured listing: ${cat.label}`)}</li>`);
  }
  return `<section class="featured" aria-label="Featured listings (sponsored)"><h2 class="featured__title">Featured listings</h2><ul class="featured__list">${cards.join("\n")}</ul></section>`;
}

// Rate card #4: label for sponsored articles. Used by layouts/guide.njk when front matter has
// sponsoredBy: { name, url }.  {% sponsoredArticleLabel sponsoredBy %}
export function sponsoredArticleLabel(by) {
  if (!by || !by.name) return "";
  return `<aside class="sponsor sponsor--article" aria-label="Sponsored article" data-slot="sponsored-article">
  <p class="sponsor__label">Sponsored</p><p class="sponsor__text">This article is <strong>sponsored by ${esc(by.name)}</strong>${by.url ? ` (${sponsoredLink(by.url, "visit sponsor", "sponsor__inline")})` : ""}. It was written or edited to our editorial standards. Sponsorship does not change our free listings or other guides.</p>
</aside>`;
}
