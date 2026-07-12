import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import Footer from "@/app/components/Footer";
import { client, urlFor } from "@/lib/sanityClient";
import { postBySlugQuery, allPostSlugsQuery } from "@/lib/sanityQueries";
import { portableTextComponents } from "@/app/components/blog/PortableTextComponents";
import { BlogPost } from "@/lib/types/blog";

const BASE_URL = "https://vyra.vercel.app";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allPostSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post: BlogPost = await client.fetch(postBySlugQuery, {
    slug: params.slug,
  });

  if (!post) return { title: "Post Not Found – VYRA" };

  const metaTitle = post.seo?.metaTitle || `${post.title} – VYRA Blog`;
  const metaDescription = post.seo?.metaDescription || post.excerpt || "";
  const ogImageUrl = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${BASE_URL}/blog/${params.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : ["VYRA"],
      url: `${BASE_URL}/blog/${params.slug}`,
      siteName: "VYRA",
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: "@vyrastore",
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post: BlogPost = await client.fetch(
    postBySlugQuery,
    { slug: params.slug },
    { next: { revalidate: 60 } }
  );

  if (!post) notFound();

  const ogImageUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : null;

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    author: {
      "@type": "Person",
      name: post.author || "VYRA",
    },
    publisher: {
      "@type": "Organization",
      name: "VYRA",
      url: BASE_URL,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${BASE_URL}/blog/${post.slug.current}`,
    ...(ogImageUrl && {
      image: {
        "@type": "ImageObject",
        url: ogImageUrl,
        width: 1200,
        height: 630,
      },
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug.current}`,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back */}
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <Link
          href="/blog"
          className="text-xs tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
        >
          ← Back to Journal
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-10">
        <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-gray-500 mb-6">
          {post.categories?.[0] && (
            <>
              <span className="text-white">{post.categories[0]}</span>
              <span>·</span>
            </>
          )}
          <span>{formatDate(post.publishedAt)}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-exo2)] tracking-tight text-white leading-tight mb-6">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-gray-700 pl-5">
            {post.excerpt}
          </p>
        )}

        {post.author && (
          <div className="flex items-center gap-3 mt-8 pt-8 border-t border-gray-800">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{post.author}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest">
                Author
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.coverImage?.asset && (
        <div className="max-w-5xl mx-auto px-6 mb-14">
          <div className="relative w-full aspect-[16/7] overflow-hidden bg-gray-900">
            <Image
              src={urlFor(post.coverImage).width(1400).height(600).url()}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        {post.body && (
          <PortableText value={post.body} components={portableTextComponents} />
        )}

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-gray-800">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs tracking-widest uppercase border border-gray-700 text-gray-400 px-3 py-1.5"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/blog"
            className="text-xs tracking-widest uppercase text-white border-b border-white pb-0.5 hover:text-gray-400 hover:border-gray-400 transition-colors"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
