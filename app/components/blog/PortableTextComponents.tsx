import { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(900).url()}
            alt={value.alt || ""}
            width={900}
            height={500}
            className="w-full object-cover"
          />
          {value.caption && (
            <figcaption className="text-center text-xs text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-white mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-gray-300 text-base leading-relaxed mb-5">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-white pl-5 my-6 text-gray-400 italic text-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");
      return (
        
          href={href}
          target={value?.blank || isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-white underline underline-offset-2 hover:text-gray-300 transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    strong: ({ children }) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="text-gray-300 italic">{children}</em>
    ),
  },
};