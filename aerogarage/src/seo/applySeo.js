import { getSeoForPath, SITE_URL } from "./seoConfig";

function upsertMetaByName(name, content) {
  let tag = document.head.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  let tag = document.head.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export function applySeo(path) {
  const seo = getSeoForPath(path);
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = seo.image?.startsWith("http") ? seo.image : `${SITE_URL}${seo.image}`;

  document.title = seo.title;

  upsertMetaByName("description", seo.description);
  upsertMetaByName("robots", "index,follow");
  upsertMetaByProperty("og:type", "website");
  upsertMetaByProperty("og:title", seo.title);
  upsertMetaByProperty("og:description", seo.description);
  upsertMetaByProperty("og:url", canonicalUrl);
  upsertMetaByProperty("og:image", ogImage);
  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", seo.title);
  upsertMetaByName("twitter:description", seo.description);
  upsertMetaByName("twitter:image", ogImage);

  upsertCanonical(canonicalUrl);
}
