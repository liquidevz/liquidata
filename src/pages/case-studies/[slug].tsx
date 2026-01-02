import React, { useEffect, useState } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import { breadcrumbStructuredData } from '../../seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { publicFetch } from '../../utils/adminApi';
import { MaxWidthWrapper } from '../../components/utils/MaxWidthWrapper';
import { Barlow } from "next/font/google";
import { FiArrowLeft, FiExternalLink, FiGithub, FiCalendar, FiUsers, FiClock, FiArrowUpRight } from 'react-icons/fi';

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
  content: string;
  excerpt: string;
  featuredImage: string;
  gallery?: string[];
  client: string;
  industry: string;
  projectType: string;
  duration?: string;
  teamSize?: string;
  technologies: string[];
  metrics?: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  liveUrl?: string;
  githubUrl?: string;
  publishedAt?: string;
}

interface RelatedCaseStudy {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  client: string;
  industry: string;
}

export default function CaseStudyDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<RelatedCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCaseStudy();
    }
  }, [slug]);

  const fetchCaseStudy = async () => {
    try {
      const response = await publicFetch(`/api/case-studies/${slug}`);
      setCaseStudy(response);
      
      // Fetch related projects
      if (response.industry) {
        const projectsResponse = await publicFetch(`/api/case-studies?industry=${response.industry}&limit=3`);
        setRelatedProjects((projectsResponse.caseStudies || []).filter((p: RelatedCaseStudy) => p.slug !== slug).slice(0, 3));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch case study:', error);
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

  if (!caseStudy) {
    return (
      <main className={barlowFont.className}>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-zinc-300">Project not found</h1>
          <Link href="/case-studies">
            <button className="px-8 py-3 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors">
              Back to Work
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const projectStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseStudy.title,
    description: caseStudy.excerpt,
    image: caseStudy.featuredImage || 'https://liquidata.com/og-image.jpg',
    datePublished: caseStudy.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Liquidata'
    },
    creator: {
      '@type': 'Organization',
      name: 'Liquidata'
    },
    about: {
      '@type': 'Thing',
      name: caseStudy.industry
    },
    keywords: caseStudy.technologies?.join(', ')
  };

  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: 'https://liquidata.com' },
    { name: 'Case Studies', url: 'https://liquidata.com/case-studies' },
    { name: caseStudy.title, url: `https://liquidata.com/case-studies/${caseStudy.slug}` }
  ]);

  const combinedStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [projectStructuredData, breadcrumbs]
  };

  return (
    <>
      <SEOHead
        title={`${caseStudy.title} - ${caseStudy.client} Case Study | Liquidata`}
        description={caseStudy.excerpt}
        keywords={`liquidata, ${caseStudy.client}, ${caseStudy.industry}, ${caseStudy.projectType}, ${caseStudy.technologies?.join(', ')}, case study`}
        canonical={`https://liquidata.com/case-studies/${caseStudy.slug}`}
        ogImage={caseStudy.featuredImage || 'https://liquidata.com/og-image.jpg'}
        publishedTime={caseStudy.publishedAt}
        structuredData={combinedStructuredData}
      />

      <main className={barlowFont.className}>
        {/* Back Navigation */}
        <section className="pt-24 pb-6">
          <MaxWidthWrapper>
            <Link href="/case-studies">
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
                <span className="text-sm uppercase tracking-wider">Back to Work</span>
              </motion.button>
            </Link>
          </MaxWidthWrapper>
        </section>

        {/* Project Header */}
        <section className="pb-12 md:pb-16">
          <MaxWidthWrapper>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left: Title & Description */}
              <div className="lg:col-span-7">
                {/* Client */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 md:mb-6"
                >
                  <span className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs uppercase tracking-wider rounded-full">
                    {caseStudy.client}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 md:mb-6"
                >
                  {caseStudy.title}
                </motion.h1>

                {/* Subtitle */}
                {caseStudy.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg sm:text-xl md:text-2xl text-zinc-400 mb-6 md:mb-8"
                  >
                    {caseStudy.subtitle}
                  </motion.p>
                )}

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                >
                  {caseStudy.description}
                </motion.p>
              </div>

              {/* Right: Project Details */}
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 md:p-8 border border-zinc-800/50 shadow-xl backdrop-blur-sm"
                >
                  <h3 className="text-sm uppercase tracking-wider text-zinc-400 mb-6 font-semibold">Project Details</h3>
                  
                  <div className="space-y-5">
                    <div className="pb-5 border-b border-zinc-800/50">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">Industry</p>
                      <p className="text-lg text-white font-medium">{caseStudy.industry}</p>
                    </div>
                    
                    <div className="pb-5 border-b border-zinc-800/50">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">Project Type</p>
                      <p className="text-lg text-white font-medium">{caseStudy.projectType}</p>
                    </div>

                    {caseStudy.duration && (
                      <div className="pb-5 border-b border-zinc-800/50">
                        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">Duration</p>
                        <p className="text-lg text-white font-medium flex items-center gap-2">
                          <FiClock size={18} className="text-cyan-400" />
                          {caseStudy.duration}
                        </p>
                      </div>
                    )}

                    {caseStudy.teamSize && (
                      <div className="pb-5 border-b border-zinc-800/50">
                        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">Team Size</p>
                        <p className="text-lg text-white font-medium flex items-center gap-2">
                          <FiUsers size={18} className="text-cyan-400" />
                          {caseStudy.teamSize}
                        </p>
                      </div>
                    )}

                    {/* Links */}
                    {(caseStudy.liveUrl || caseStudy.githubUrl) && (
                      <div className="pt-2">
                        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-4 font-medium">Links</p>
                        <div className="flex flex-col gap-3">
                          {caseStudy.liveUrl && (
                            <a
                              href={caseStudy.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
                            >
                              <FiExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              <span className="font-medium">Visit Live Site</span>
                            </a>
                          )}
                          {caseStudy.githubUrl && (
                            <a
                              href={caseStudy.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
                            >
                              <FiGithub size={16} className="group-hover:rotate-12 transition-transform" />
                              <span className="font-medium">View on GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* Featured Image */}
        {caseStudy.featuredImage && (
          <section className="pb-12 md:pb-16">
            <MaxWidthWrapper>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-zinc-900"
              >
                <img
                  src={caseStudy.featuredImage}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </MaxWidthWrapper>
          </section>
        )}

        {/* Technologies */}
        {caseStudy.technologies && caseStudy.technologies.length > 0 && (
          <section className="pb-12">
            <MaxWidthWrapper>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {caseStudy.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-5 py-2 bg-zinc-800 text-zinc-200 text-sm rounded-full border border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </MaxWidthWrapper>
          </section>
        )}

        {/* Project Content */}
        {caseStudy.content && (
          <section className="pb-16">
            <MaxWidthWrapper>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
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
                dangerouslySetInnerHTML={{ __html: caseStudy.content }}
              />
            </MaxWidthWrapper>
          </section>
        )}

        {/* Metrics */}
        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <section className="py-16 bg-zinc-900/50">
            <MaxWidthWrapper>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-12">Project Impact</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {caseStudy.metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-3">
                        {metric.value}
                      </div>
                      <div className="text-xl font-semibold mb-2">{metric.label}</div>
                      {metric.description && (
                        <p className="text-sm text-zinc-400">{metric.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </MaxWidthWrapper>
          </section>
        )}

        {/* Gallery */}
        {caseStudy.gallery && caseStudy.gallery.length > 0 && (
          <section className="py-16">
            <MaxWidthWrapper>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-12">Project Gallery</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudy.gallery.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900"
                    >
                      <img
                        src={image}
                        alt={`${caseStudy.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </MaxWidthWrapper>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-20 border-t border-zinc-800">
            <MaxWidthWrapper>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">Related Projects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/case-studies/${project.slug}`}>
                      <motion.article
                        className="group cursor-pointer"
                        whileHover="hover"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 mb-4">
                          {project.featuredImage ? (
                            <motion.img
                              src={project.featuredImage}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              variants={{
                                hover: { scale: 1.05 }
                              }}
                              transition={{ duration: 0.6 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-bold text-zinc-700">
                                {project.client.charAt(0)}
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
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">{project.client}</p>
                          <h3 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-zinc-400 text-sm line-clamp-2">
                            {project.excerpt}
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
                your project?
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
                    Start your project
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
