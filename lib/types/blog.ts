export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  author?: string;
  categories?: string[];
  publishedAt: string;
  coverImage?: {
    asset: any;
    alt?: string;
  };
  body?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
  };
}