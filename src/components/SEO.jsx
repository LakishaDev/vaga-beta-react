/**
 * SEO Component - Dinamički postavlja meta tagove za svaku stranicu
 */

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const SEO = ({
  title = "Vaga Beta | Žigosanje, Overavanje i Servis Vaga",
  description = "Profesionalan servis za vage - žigosanje, overavanje, kalibrisanje i softverska rešenja. Ovlašćeni servis sa 20+ godina iskustva.",
  keywords = "vaga, vage, žigosanje vaga, overavanje vaga, servis vaga, digitalne vage",
  image = "https://vagabeta.rs/imgs/vaga-logo.png",
  url = "https://vagabeta.rs",
  type = "website",
  author = "Vaga Beta",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonicalUrl,
  structuredData,
}) => {
  const jsonLdRefs = useRef([]);

  useEffect(() => {
    document.title = title;

    const setMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    const keywordsStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;

    setMetaTag("description", description);
    setMetaTag("keywords", keywordsStr);
    setMetaTag("author", author);

    const robotsContent = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;
    setMetaTag("robots", robotsContent);

    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:url", url, true);
    setMetaTag("og:type", type, true);
    setMetaTag("og:site_name", "Vaga Beta", true);
    setMetaTag("og:locale", "sr_RS", true);
    setMetaTag("og:locale:alternate", "sr_Latn_RS", true);

    if (type === "article") {
      if (publishedTime) setMetaTag("article:published_time", publishedTime, true);
      if (modifiedTime) setMetaTag("article:modified_time", modifiedTime, true);
      if (section) setMetaTag("article:section", section, true);
      if (author) setMetaTag("article:author", author, true);
      tags.forEach((tag) => setMetaTag("article:tag", tag, true));
    }

    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);
    setMetaTag("twitter:url", url);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", canonicalUrl || url);
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("href", canonicalUrl || url);
      document.head.appendChild(canonicalLink);
    }

    // Inject JSON-LD structured data
    if (structuredData) {
      const items = Array.isArray(structuredData) ? structuredData : [structuredData];
      const scripts = items.map((data) => {
        const script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-seo-jsonld", "true");
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        return script;
      });
      jsonLdRefs.current = scripts;
    }

    return () => {
      // Cleanup JSON-LD scripts added by this instance
      jsonLdRefs.current.forEach((s) => s.parentNode?.removeChild(s));
      jsonLdRefs.current = [];
    };
  }, [
    title,
    description,
    keywords,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    noindex,
    nofollow,
    canonicalUrl,
    structuredData,
  ]);

  return null;
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf(["website", "article", "product"]),
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  section: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  noindex: PropTypes.bool,
  nofollow: PropTypes.bool,
  canonicalUrl: PropTypes.string,
  structuredData: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

export default SEO;
