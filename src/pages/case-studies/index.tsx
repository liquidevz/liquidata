import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { publicFetch } from '../../utils/adminApi';
import { MaxWidthWrapper } from '../../components/utils/MaxWidthWrapper';
import { HeaderGrid } from '../../components/utils/HeaderGrid';
import { SplashButton } from '../../components/buttons/SplashButton';
import { GhostButton } from '../../components/buttons/GhostButton';
import { Barlow } from "next/font/google";
import { FiArrowUpRight } from 'react-icons/fi';

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  excerpt: string;
  featuredImage: string;
  client: string;
  industry: string;
  projectType: string;
  duration?: string;
  technologies: string[];
  status: string;
  featured: boolean;
  publishedAt?: string;
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await publicFetch('/api/case-studies');
      setCaseStudies(response.caseStudies || []);
      setFilteredCaseStudies(response.caseStudies || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = caseStudies;

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(cs => cs.industry === selectedIndustry);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(cs => cs.projectType === selectedType);
    }

    setFilteredCaseStudies(filtered);
  }, [selectedIndustry, selectedType, caseStudies]);

  const getUniqueIndustries = () => {
    return Array.from(new Set(caseStudies.map(cs => cs.industry))).filter(Boolean);
  };

  const getUniqueTypes = () => {
    return Array.from(new Set(caseStudies.map(cs => cs.projectType))).filter(Boolean);
  };

  return (
    <>
      <Head>
        <title>Work - Case Studies | Liquidata</title>
        <meta name="description" content="Purpose driven, strategy-led projects that people care about. Explore our portfolio of successful case studies." />
      </Head>

      <main className={barlowFont.className}>
        {/* Hero Section - Ochi Style */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-20">
          <HeaderGrid />
          <MaxWidthWrapper className="relative z-10">
            {/* Heading Counter - Ochi Style */}
            <div className="mb-8">
              <p className="text-zinc-400 text-sm uppercase tracking-widest">
                Work ({filteredCaseStudies.length})
              </p>
            </div>

            {/* Large Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none mb-6 lg:mb-8 max-w-5xl"
            >
              Purpose driven, strategy-led projects{' '}
              <br className="hidden md:block" />
              that people care about.
            </motion.h1>

            {/* Filter Pills - Ochi Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-3 mt-12"
            >
              {/* Industry Filters */}
              <button
                onClick={() => setSelectedIndustry('all')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedIndustry === 'all'
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                All
              </button>
              {getUniqueIndustries().map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedIndustry === industry
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </motion.div>
          </MaxWidthWrapper>
        </section>

        {/* Projects Grid - Ochi Card Style */}
        <section className="pb-20 md:pb-32">
          <MaxWidthWrapper>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-zinc-400 text-lg">Loading projects...</div>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {filteredCaseStudies.map((caseStudy, index) => (
                    <motion.div
                      key={caseStudy._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      layout
                    >
                      <Link href={`/case-studies/${caseStudy.slug}`}>
                        <motion.div
                          className="group relative border-t border-zinc-800 pt-6 pb-6 cursor-pointer"
                          whileHover="hover"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            {/* Left: Title & Tags */}
                            <div className="flex-1">
                              <motion.h2
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-none"
                                variants={{
                                  hover: { x: 10 }
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                {caseStudy.title}
                              </motion.h2>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs uppercase tracking-wider rounded-full">
                                  {caseStudy.client}
                                </span>
                                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs uppercase tracking-wider rounded-full">
                                  {caseStudy.projectType}
                                </span>
                                {caseStudy.technologies.slice(0, 2).map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs uppercase tracking-wider rounded-full"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Right: Image & Arrow */}
                            <div className="w-full sm:w-80 lg:w-80 xl:w-96 relative">
                              {/* Featured Badge */}
                              {caseStudy.featured && (
                                <div className="absolute -top-2 -right-2 z-10">
                                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FiArrowUpRight className="text-white" size={20} />
                                  </div>
                                </div>
                              )}

                              {/* Image Container */}
                              <motion.div
                                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900"
                                variants={{
                                  hover: { scale: 0.98 }
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                {caseStudy.featuredImage ? (
                                  <img
                                    src={caseStudy.featuredImage}
                                    alt={caseStudy.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-6xl font-bold text-zinc-700">
                                      {caseStudy.client.charAt(0)}
                                    </span>
                                  </div>
                                )}

                                {/* Hover Overlay */}
                                <motion.div
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                                  initial={{ opacity: 0 }}
                                  variants={{
                                    hover: { opacity: 1 }
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                    <FiArrowUpRight className="text-zinc-900" size={28} />
                                  </div>
                                </motion.div>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {!loading && filteredCaseStudies.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-2xl text-zinc-400 mb-8">No projects found</p>
                    <button
                      onClick={() => {
                        setSelectedIndustry('all');
                        setSelectedType('all');
                      }}
                      className="px-8 py-3 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                    >
                      Clear Filters
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
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none mb-12"
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
                    Start the project
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
