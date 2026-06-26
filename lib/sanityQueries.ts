import { groq } from "next-sanity";

export const allPostsQuery = groq`
  *[_type == "blog"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    author,
    categories,
    publishedAt,
    coverImage { asset, alt }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    author,
    categories,
    publishedAt,
    coverImage { asset, alt },
    body,
    seo { metaTitle, metaDescription, ogImage }
  }
`;

export const allPostSlugsQuery = groq`
  *[_type == "blog"] { "slug": slug.current }
`;