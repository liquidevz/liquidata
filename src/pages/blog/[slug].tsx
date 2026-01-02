import React, { useEffect, useState } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import { breadcrumbStructuredData } from '../../seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { publicFetch } from '../../utils/adminApi';
import { MaxWidthWrapper } from '../../components/utils/MaxWidthWrapper';
import { Barlow } from "next/font/google";
import { FiArrowLeft, FiClock, FiCalendar, FiEye, FiArrowUpRight } from 'react-icons/fi';

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  readingTime?: number;
  views: number;
  publishedAt?: string;
  author?: {
    name: string;
  };
}

interface RelatedBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  publishedAt?: string;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await publicFetch(`/api/blogs/${slug}`);
      setBlog(response);
      
      // Fetch related blogs
      if (response.category) {
        const blogsResponse = await publicFetch(`/api/blogs?category=${response.category}&limit=3`);
        setRelatedBlogs((blogsResponse.blogs || []).filter((b: RelatedBlog) => b.slug !== slug).slice(0, 3));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className={barlowFont.className}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-zinc-400 text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className={barlowFont.className}>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-zinc-300">Article not found</h1>
          <Link href="/blog">
            <button className="px-8 py-3 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors">
              Back to Insights
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage || 'https://liquidata.com/og-image.jpg',
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'Liquidata Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Liquidata',
      logo: {
        '@type': 'ImageObject',
        url: 'https://liquidata.com/liquidata.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://liquidata.com/blog/${blog.slug}`
    },
    keywords: blog.tags?.join(', '),
    articleSection: blog.category,
    wordCount: blog.content?.split(' ').length || 0
  };

  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: 'https://liquidata.com' },
    { name: 'Blog', url: 'https://liquidata.com/blog' },
    { name: blog.title, url: `https://liquidata.com/blog/${blog.slug}` }
  ]);

  const combinedStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [articleStructuredData, breadcrumbs]
  };

  return (
    <>
      <SEOHead
        title={`${blog.title} | Liquidata Blog`}
        description={blog.excerpt}
        keywords={`liquidata, ${blog.category}, ${blog.tags?.join(', ')}, software development, tech article`}
        canonical={`https://liquidata.com/blog/${blog.slug}`}
        ogImage={blog.featuredImage || 'https://liquidata.com/og-image.jpg'}
        ogType="article"
        publishedTime={blog.publishedAt}
        modifiedTime={blog.publishedAt}
        structuredData={combinedStructuredData}
      />

      <main className={barlowFont.className}>
        {/* Back Navigation */}
        <section className="pt-24 pb-6">
          <MaxWidthWrapper>
            <Link href="/blog">
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
                <span className="text-sm uppercase tracking-wider">Back to Insights</span>
              </motion.button>
            </Link>
          </MaxWidthWrapper>
        </section>

        {/* Article Header */}
        <section className="pb-12">
          <MaxWidthWrapper>
            <div className="max-w-4xl">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <span className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs uppercase tracking-wider rounded-full">
                  {blog.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8"
              >
                {blog.title}
              </motion.h1>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-12"
              >
                {blog.author?.name && (
                  <span>By {blog.author.name}</span>
                )}
                {blog.publishedAt && (
                  <>
                    {blog.author?.name && <span>•</span>}
                    <span className="flex items-center gap-2">
                      <FiCalendar size={14} />
                      {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </>
                )}
                {blog.readingTime && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <FiClock size={14} />
                      {blog.readingTime} min read
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-2">
                  <FiEye size={14} />
                  {blog.views || 0} views
                </span>
              </motion.div>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* Featured Image */}
        {blog.featuredImage && (
          <section className="pb-12 md:pb-16">
            <MaxWidthWrapper>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-900"
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </MaxWidthWrapper>
          </section>
        )}

        {/* Article Content */}
        <section className="pb-16">
          <MaxWidthWrapper>
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto px-4 sm:px-6
                [&>*]:text-zinc-200
                [&_h1]:text-4xl sm:[&_h1]:text-5xl md:[&_h1]:text-6xl [&_h1]:font-bold [&_h1]:mt-16 [&_h1]:mb-10 [&_h1]:leading-[1.15] [&_h1]:text-white
                [&_h2]:text-3xl sm:[&_h2]:text-4xl md:[&_h2]:text-5xl [&_h2]:font-bold [&_h2]:mt-20 [&_h2]:mb-8 [&_h2]:leading-[1.2] [&_h2]:bg-gradient-to-r [&_h2]:from-white [&_h2]:to-zinc-400 [&_h2]:bg-clip-text [&_h2]:text-transparent
                [&_h3]:text-2xl sm:[&_h3]:text-3xl md:[&_h3]:text-4xl [&_h3]:font-bold [&_h3]:mt-16 [&_h3]:mb-6 [&_h3]:text-zinc-100
                [&_h4]:text-xl sm:[&_h4]:text-2xl md:[&_h4]:text-3xl [&_h4]:font-semibold [&_h4]:mt-12 [&_h4]:mb-5 [&_h4]:text-zinc-200
                [&_p]:text-lg sm:[&_p]:text-xl md:[&_p]:text-2xl [&_p]:leading-[1.75] sm:[&_p]:leading-[1.8] [&_p]:mb-8 sm:[&_p]:mb-10 [&_p]:text-zinc-300 [&_p]:font-light
                [&_a]:text-emerald-400 [&_a]:no-underline [&_a]:font-medium [&_a]:border-b-2 [&_a]:border-emerald-400/30 hover:[&_a]:border-emerald-400 [&_a]:transition-all [&_a]:pb-0.5
                [&_strong]:text-white [&_strong]:font-bold
                [&_em]:text-zinc-400 [&_em]:italic [&_em]:font-light
                [&_code]:text-emerald-400 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-base sm:[&_code]:text-lg [&_code]:font-mono
                [&_pre]:p-0 [&_pre]:my-8 sm:[&_pre]:my-10 [&_pre]:overflow-x-auto [&_pre]:bg-transparent
                [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-4 sm:[&_ul]:space-y-5 [&_ul]:my-10 sm:[&_ul]:my-12
                [&_ol]:list-none [&_ol]:pl-0 [&_ol]:space-y-4 sm:[&_ol]:space-y-5 [&_ol]:my-10 sm:[&_ol]:my-12 [&_ol]:counter-reset-[item]
                [&_li]:text-lg sm:[&_li]:text-xl md:[&_li]:text-2xl [&_li]:leading-relaxed [&_li]:pl-10 sm:[&_li]:pl-12 [&_li]:relative [&_li]:text-zinc-300 [&_li]:font-light
                [&_ul_li]:before:content-['✓'] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:text-emerald-400 [&_ul_li]:before:font-bold [&_ul_li]:before:text-2xl [&_ul_li]:before:top-0
                [&_ol_li]:before:content-[counter(item)'.'] [&_ol_li]:before:counter-increment-[item] [&_ol_li]:before:absolute [&_ol_li]:before:left-0 [&_ol_li]:before:text-emerald-400 [&_ol_li]:before:text-lg sm:[&_ol_li]:before:text-xl [&_ol_li]:before:font-bold
                [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-6 sm:[&_blockquote]:pl-8 [&_blockquote]:italic [&_blockquote]:text-xl sm:[&_blockquote]:text-2xl [&_blockquote]:text-zinc-400 [&_blockquote]:my-10 sm:[&_blockquote]:my-12 [&_blockquote]:font-light
                [&_img]:rounded-2xl [&_img]:my-12 sm:[&_img]:my-16 [&_img]:w-full
                [&_hr]:border-0 [&_hr]:my-16 sm:[&_hr]:my-20 [&_hr]:h-0
                [&_table]:border-collapse [&_table]:w-full [&_table]:my-10 sm:[&_table]:my-12 [&_table]:overflow-x-auto [&_table]:block sm:[&_table]:table
                [&_th]:text-white [&_th]:font-bold [&_th]:p-3 sm:[&_th]:p-4 [&_th]:text-left [&_th]:border-b-2 [&_th]:border-zinc-700 [&_th]:text-base sm:[&_th]:text-lg
                [&_td]:p-3 sm:[&_td]:p-4 [&_td]:border-b [&_td]:border-zinc-800 [&_td]:text-zinc-300 [&_td]:text-base sm:[&_td]:text-lg
                [&>*:first-child]:mt-0
                [&_*]:selection:bg-emerald-500/30 [&_*]:selection:text-white"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-3xl mx-auto mt-12 pt-8 border-t border-zinc-800"
              >
                <p className="text-sm text-zinc-500 mb-4 uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded-full hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </MaxWidthWrapper>
        </section>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="py-20 border-t border-zinc-800">
            <MaxWidthWrapper>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">Related Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog, index) => (
                  <motion.div
                    key={relatedBlog._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${relatedBlog.slug}`}>
                      <motion.article
                        className="group cursor-pointer"
                        whileHover="hover"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 mb-4">
                          {relatedBlog.featuredImage ? (
                            <motion.img
                              src={relatedBlog.featuredImage}
                              alt={relatedBlog.title}
                              className="w-full h-full object-cover"
                              variants={{
                                hover: { scale: 1.05 }
                              }}
                              transition={{ duration: 0.6 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-bold text-zinc-700">
                                {relatedBlog.title.charAt(0)}
                              </span>
                            </div>
                          )}

                          {/* Hover Arrow */}
                          <motion.div
                            className="absolute inset-0 bg-black/60 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            variants={{
                              hover: { opacity: 1 }
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                              <FiArrowUpRight className="text-zinc-900" size={20} />
                            </div>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">{relatedBlog.category}</p>
                          <h3 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-zinc-400 text-sm line-clamp-2">
                            {relatedBlog.excerpt}
                          </p>
                        </div>
                      </motion.article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </MaxWidthWrapper>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-32 border-t border-zinc-800">
          <MaxWidthWrapper>
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-12"
              >
                Ready
                <br />
                to start
                <br />
                the project?
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-zinc-100 text-zinc-900 rounded-full text-lg font-semibold hover:bg-white transition-colors"
                  >
                    Get in touch
                  </motion.button>
                </Link>
                
                <span className="text-zinc-400 text-sm uppercase tracking-widest">OR</span>
                
                <a
                  href="mailto:hello@liquidata.dev"
                  className="text-zinc-300 hover:text-white transition-colors text-lg underline"
                >
                  hello@liquidata.dev
                </a>
              </motion.div>
            </div>
          </MaxWidthWrapper>
        </section>
      </main>
    </>
  );
}
