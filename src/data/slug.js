export function nameToSlug(name = "") {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .replace(/[^a-zA-Z0-9\s-]/g, "")   // remove punctuation
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}