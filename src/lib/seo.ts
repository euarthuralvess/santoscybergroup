export interface Crumb {
  name: string;
  href: string;
}

export interface PageService {
  name: string;
  description: string;
  url: string;
}

export interface PageArticle {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
}

/** Previews and proposals stay out of search engines until launch day. */
export const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
