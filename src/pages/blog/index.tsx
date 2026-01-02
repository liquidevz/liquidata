import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { publicFetch } from '../../utils/adminApi';
import { MaxWidthWrapper } from '../../components/utils/MaxWidthWrapper';
import { HeaderGrid } from '../../components/utils/HeaderGrid';
import { Barlow } from "next/font/google";
import { FiArrowUpRight, FiClock, FiCalendar } from 'react-icons/fi';

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  readingTime?: number;
  views: number;
  status: string;
  featured: boolean;
  publishedAt?: string;
  author?: {
    name: string;
  };
}

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsResponse, categoriesResponse] = await Promise.all([
        publicFetch('/api/blogs'),
        publicFetch('/api/blog-categories')
      ]);
      
      setBlogs(blogsResponse.blogs || []);
      setFilteredBlogs(blogsResponse.blogs || []);
      setCategories(categoriesResponse || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === selectedCategory));
    }
  }, [selectedCategory, blogs]);

  return (
    <>
      <Head>
        <title>Insights - Blog & Articles | Liquidata</title>
        <meta name="description" content="Latest insights, tutorials, and industry trends from our team of experts." />
      </Head>

      <main className={barlowFont.className}>
        {/* Hero Section - Ochi Insights Style */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-20">
          <HeaderGrid />
          <MaxWidthWrapper className="relative z-10">
            {/* Large Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none mb-8 lg:mb-12"
            >
              Insights
            </motion.h1>

            {/* Latest Insights Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-zinc-400 text-lg mb-8"
            >
              Latest insights:
            </motion.p>

            {/* Category Filter Pills - Ochi Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </MaxWidthWrapper>
        </section>

        {/* Blog Grid - Ochi Insights Card Style */}
        <section className="pb-20 md:pb-32">
          <MaxWidthWrapper>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-zinc-400 text-lg">Loading insights...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredBlogs.map((blog, index) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      layout
                    >
                      <Link href={`/blog/${blog.slug}`}>
                        <motion.article
                          className="group cursor-pointer"
                          whileHover="hover"
                        >
                          {/* Image */}
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 mb-6">
                            {blog.featuredImage ? (
                              <motion.img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                                variants={{
                                  hover: { scale: 1.05 }
                                }}
                                transition={{ duration: 0.6 }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl font-bold text-zinc-700">
                                  {blog.title.charAt(0)}
                                </span>
                              </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-zinc-900/90 backdrop-blur-sm text-zinc-100 text-xs font-medium rounded-full border border-zinc-700">
                                {blog.category}
                              </span>
                            </div>

                            {/* Hover Arrow */}
                            <motion.div
                              className="absolute inset-0 bg-black/60 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              variants={{
                                hover: { opacity: 1 }
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                                <FiArrowUpRight className="text-zinc-900" size={24} />
                              </div>
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="space-y-3">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs text-zinc-400">
                              <span className="uppercase tracking-wider">{blog.category}</span>
                              {blog.publishedAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: '2-digit'
                                    })}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                              {blog.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-zinc-400 line-clamp-2">
                              {blog.excerpt}
                            </p>

                            {/* Author & Reading Time */}
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                              {blog.author?.name && (
                                <span>By {blog.author.name}</span>
                              )}
                              {blog.readingTime && (
                                <>
                                  {blog.author?.name && <span>•</span>}
                                  <span className="flex items-center gap-1">
                                    <FiClock size={12} />
                                    {blog.readingTime} min read
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.article>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {!loading && filteredBlogs.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-2xl text-zinc-400 mb-8">No articles found</p>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="px-8 py-3 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                    >
                      View All Articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </MaxWidthWrapper>
        </section>

        {/* CTA Section - Ochi Style */}
        <section className="relative py-32 border-t border-zinc-800">
          <MaxWidthWrapper>
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-12"
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
