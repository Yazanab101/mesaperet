import { useEffect } from "react";
import { pageMeta } from "../data/content";

type MetaKey = keyof typeof pageMeta;

function setMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePageMeta(key: MetaKey) {
  useEffect(() => {
    const meta = pageMeta[key];
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", `https://www.me-saperet.com${meta.path}`);
    setMeta(
      "property",
      "og:image",
      "https://www.me-saperet.com/assets/images/44c6b1_b2cda2c5e1a04c41b82f23798b40eb4c-mv2.png",
    );

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://www.me-saperet.com${meta.path}`;
  }, [key]);
}
