import React, { useEffect, useState } from 'react';
import Head from 'next/head';
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

  return (
    <>
      <Head>
        <title>{blog.title} | Liquidata Insights</title>
        <meta name="description" content={blog.excerpt} />
      </Head>

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
              className="max-w-3xl mx-auto prose prose-invert prose-lg prose-zinc
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-blue-400 prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
                prose-ul:list-disc prose-ul:pl-6 prose-ul:text-zinc-300
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-zinc-300
                prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-400
                prose-img:rounded-2xl prose-img:my-8"
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
                  href="mailto:hello@liquidata.com"
                  className="text-zinc-300 hover:text-white transition-colors text-lg underline"
                >
                  hello@liquidata.com
                </a>
              </motion.div>
            </div>
          </MaxWidthWrapper>
        </section>
      </main>
    </>
  );
}
