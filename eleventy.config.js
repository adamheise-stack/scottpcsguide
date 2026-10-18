import { HtmlBasePlugin } from "@11ty/eleventy";
import { sponsorBanner, categorySponsor, featuredListings, sponsoredArticleLabel, SPONSORED_REL } from "./src/_includes/sponsor.js";

// Force rel="sponsored noopener" on an <a ...> tag string.
function forceSponsoredRel(tag) {
  const cleaned = tag.replace(/\srel\s*=\s*("[^"]*"|'[^']*')/i, "");
  return cleaned.replace(/^<a\b/i, `<a rel="${SPONSORED_REL}"`);
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Sponsor placements (see README "Sponsor slots").
  eleventyConfig.addShortcode("sponsorBanner", sponsorBanner);
  eleventyConfig.addShortcode("categorySponsor", categorySponsor);
  eleventyConfig.addShortcode("featuredListings", featuredListings);
  eleventyConfig.addShortcode("sponsoredArticleLabel", sponsoredArticleLabel);

  // Safety net: paid links can never ship without rel="sponsored noopener".
  //  1) any <a data-sponsored ...> anywhere on the site
  //  2) every external link inside <div data-sponsored-content> (sponsored articles)
  eleventyConfig.addTransform("sponsored-rel", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    let out = content.replace(/<a\b[^>]*\bdata-sponsored\b[^>]*>/gi, forceSponsoredRel);
    out = out.replace(/(<div[^>]*data-sponsored-content[^>]*>)([\s\S]*?)(<!--\/sponsored-content-->)/gi, (m, open, body, close) =>
      open + body.replace(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/gi, forceSponsoredRel) + close
    );
    return out;
  });

  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("absUrl", (path, base) => base.replace(/\/$/, "") + path);
  eleventyConfig.addFilter("breadcrumbLd", (crumbs, base) =>
    crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: base.replace(/\/$/, "") + c.url }))
  );
  eleventyConfig.addFilter("faqLd", (faq) =>
    faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  );

  eleventyConfig.addCollection("guides", (api) =>
    api.getFilteredByGlob("src/guides/*.md").sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || b.date - a.date)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // GitHub Pages project site lives at /scottpcsguide/. Override with PATH_PREFIX=/ for a
    // custom domain or Cloudflare Pages (CLI --pathprefix also overrides).
    pathPrefix: process.env.PATH_PREFIX || "/scottpcsguide/",
  };
}
