module.exports = function (eleventyConfig) {
  // Copy these straight through, untouched.
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Normalizes an image path to exactly one leading slash. The CMS stores
  // paths as "/images/x.jpg" while hand-written data may use "images/x.jpg";
  // without this, one of the two produces a broken "//images/x.jpg" URL.
  eleventyConfig.addFilter("asset", (p) => {
    if (!p) return "";
    return "/" + String(p).trim().replace(/^\/+/, "");
  });

  // Make a CMS-entered link work from any folder. Editors may type
  // "sponsors.html" or "/sponsors.html"; both must work from /news/a-post/,
  // where a bare "sponsors.html" would resolve to /news/a-post/sponsors.html.
  // Full addresses and mailto:/tel: links are left alone.
  eleventyConfig.addFilter("siteLink", (url) => {
    const u = String(url || "").trim();
    if (!u) return u;
    if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(u)) return u;
    if (u.startsWith("/") || u.startsWith("#")) return u;
    return "/" + u;
  });

  // Lottery weight for a sponsor, used to bias the shuffled order.
  // Levels are ranked by their position in Sponsorship Levels: the first
  // level gets the most tickets, the last gets one. A sponsor with no tier
  // set (or an unrecognised one) gets a single ticket, so it still appears
  // and can still land near the top, just less often.
  eleventyConfig.addFilter("tierWeight", (tier, levels) => {
    const list = Array.isArray(levels) ? levels : [];
    const name = String(tier || "").trim().toLowerCase();
    if (!name) return 1;
    const i = list.findIndex(
      (l) => String(l.name || "").trim().toLowerCase() === name
    );
    return i === -1 ? 1 : list.length - i;
  });

  // Date in the YYYY-MM-DD form sitemap.xml expects.
  eleventyConfig.addFilter("isoDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d) ? "" : d.toISOString().slice(0, 10);
  });

  // Turn a page URL into a full absolute address, e.g. "/donate.html" ->
  // "https://friendsofhallfootball.org/donate.html". Used for canonical links
  // and social sharing tags, which both require absolute URLs.
  eleventyConfig.addFilter("absoluteUrl", (pageUrl, base) => {
    const b = String(base || "").replace(/\/+$/, "");
    let u = String(pageUrl || "/");
    if (u.endsWith("/index.html")) u = u.slice(0, -"index.html".length);
    if (!u.startsWith("/")) u = "/" + u;
    return b + u;
  });

  // Season keys (e.g. "2026", "2025") sorted newest first, for the roster tabs.
  eleventyConfig.addFilter("seasonKeys", (obj) => {
    if (!obj || typeof obj !== "object") return [];
    return Object.keys(obj).sort().reverse();
  });

  // "2026-08-13" -> "August 13, 2026"
  eleventyConfig.addFilter("postDate", (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
    });
  });

  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/*.md").sort((a, b) => a.date - b.date)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
