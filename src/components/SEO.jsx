/**
 * SEO Component - Dinamički postavlja meta tagove za svaku stranicu
 * Koristi useEffect i Helmet pattern za SEO optimizaciju
 *
 * Primer upotrebe:
 * import SEO from '@/components/SEO';
 * import { SEO_CONFIGS } from '@/configs/seoConfigs';
 *
 * <SEO {...SEO_CONFIGS.home} />
 */

import { useEffect } from "react";
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
}) => {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set or update meta tags
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

    // Basic meta tags
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag("author", author);

    // Robots meta
    const robotsContent = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;
    setMetaTag("robots", robotsContent);

    // Open Graph tags
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:url", url, true);
    setMetaTag("og:type", type, true);
    setMetaTag("og:site_name", "Vaga Beta", true);
    setMetaTag("og:locale", "sr_RS", true);

    // Article specific OG tags
    if (type === "article") {
      if (publishedTime)
        setMetaTag("article:published_time", publishedTime, true);
      if (modifiedTime) setMetaTag("article:modified_time", modifiedTime, true);
      if (section) setMetaTag("article:section", section, true);
      if (author) setMetaTag("article:author", author, true);

      // Tags
      tags.forEach((tag) => {
        setMetaTag("article:tag", tag, true);
      });
    }

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);
    setMetaTag("twitter:url", url);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", canonicalUrl || url);
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("href", canonicalUrl || url);
      document.head.appendChild(canonicalLink);
    }

    // Cleanup function (opciono, vraća default vrednosti)
    return () => {
      // Opciono: resetuj na default vrednosti kada se komponenta unmount-uje
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
  ]);

  // Ova komponenta ne renderuje ništa vizuelno
  return null;
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
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
};

export default SEO;
