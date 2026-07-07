import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sacramento } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import MegaHeader from "@/components/shared/mega-header";
import { blogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] dark:bg-bg-vanilla-cream transition-colors duration-500 overflow-x-hidden font-sans">
      <MegaHeader />
      
      <main className="w-full pt-[120px] px-4 sm:px-6 md:px-12 flex flex-col items-center">
        <article className="relative w-full max-w-3xl py-16 flex flex-col gap-8 text-left">
          
          <Link 
            href="/blog" 
            className="text-xs font-bold uppercase tracking-widest text-accent-chocolate-light dark:text-bg-vanilla/60 hover:text-primary-pink transition-colors inline-flex items-center gap-2 min-h-[48px] py-2 px-4 border border-accent-chocolate/10 dark:border-white/10 rounded-full w-fit bg-white/40 dark:bg-white/5 backdrop-blur-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="space-y-4">
            <span className="text-xs font-bold text-primary-pink-deep dark:text-primary-pink uppercase tracking-widest">
              {post.date}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-accent-chocolate dark:text-white uppercase leading-tight">
              {post.title}
            </h1>
            <div className="w-16 h-0.5 bg-primary-pink/40 mt-4" />
          </div>

          <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-white/20 shadow-lg">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover" 
              priority
              quality={80}
            />
          </div>

          <div className="space-y-6 text-sm sm:text-base text-accent-chocolate-light dark:text-bg-vanilla-cream/90 leading-relaxed font-normal">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

        </article>
      </main>
    </div>
  );
}
