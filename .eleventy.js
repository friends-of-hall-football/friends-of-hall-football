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
