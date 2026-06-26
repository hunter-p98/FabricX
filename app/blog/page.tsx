import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import Footer from "@/app/components/Footer";
import { client, urlFor } from "@/lib/sanityClient";
import { allPostsQuery } from "@/lib/sanityQueries";
import { BlogPost } from "@/types/blog";

export const metadata: Metadata = {
  title: "Blog – VYRA",
  description:
    "Style drops, culture, and the ideas behind every VYRA piece. Read the VYRA journal.",
  openGraph: {
    title: "Blog – VYRA",
    description: "Style drops, culture, and the ideas behind every VYRA piece.",
    type: "website",
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4 animate-pulse">
          <div className="w-full aspect-[3/2] bg-gray-900" />
          <div className="h-3 bg-gray-800 rounded w-1/3" />
          <div className="h-5 bg-gray-800 rounded w-3/4" />
          <div className="h-3 bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-800 rounded w-5/6" />
          <div className="h-3 bg-gray-800 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}

async function BlogPosts() {
  const posts: BlogPost[] = await client.fetch(
    allPostsQuery,
    {},
    { next: { revalidate: 60 } }
  );

  if (posts.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-600 text-sm tracking-widest uppercase">
          No posts yet
        </p>
        <p className="text-gray-700 text-xs mt-2">First drop coming soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/blog/${post.slug.current}`}
          className="group flex flex-col gap-4"
        >
          {post.coverImage?.asset ? (
            <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-900">
              <Image
                src={urlFor(post.coverImage).width(720).height(480).url()}
                alt={post.coverImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full aspect-[3/2] bg-gray-900 flex items-center justify-center">
              <span className="text-gray-700 text-4xl font-[family-name:var(--font-exo2)]">
                VYRA
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-gray-500">
            {post.categories?.[0] && (
              <>
                <span className="text-white">{post.categories[0]}</span>
                <span>·</span>
              </>
            )}
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <h2 className="text-lg font-semibold text-white leading-snug tracking-tight group-hover:text-gray-300 transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <span className="text-xs tracking-widest uppercase text-white border-b border-white pb-0.5 w-fit group-hover:text-gray-400 group-hover:border-gray-400 transition-colors">
            Read →
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12 border-b border-gray-800">
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
          VYRA Journal
        </p>
        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-exo2)] tracking-tight text-white">
          The Drop
        </h1>
        <p className="text-gray-400 mt-4 text-sm max-w-md">
          Stories, style drops, and the thinking behind every piece we make.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <Suspense fallback={<BlogSkeleton />}>
          <BlogPosts />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}