import React, { useEffect, useState } from 'react';
import Head from 'next/head';
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

  return (
    <>
      <Head>
        <title>{caseStudy.title} - {caseStudy.client} | Liquidata</title>
        <meta name="description" content={caseStudy.excerpt} />
      </Head>

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Title & Description */}
              <div className="lg:col-span-7">
                {/* Client */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
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
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
                >
                  {caseStudy.title}
                </motion.h1>

                {/* Subtitle */}
                {caseStudy.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-2xl text-zinc-400 mb-8"
                  >
                    {caseStudy.subtitle}
                  </motion.p>
                )}

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg text-zinc-300 leading-relaxed"
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
                  className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800"
                >
                  <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Project Details</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Industry</p>
                      <p className="text-lg text-white">{caseStudy.industry}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Project Type</p>
                      <p className="text-lg text-white">{caseStudy.projectType}</p>
                    </div>

                    {caseStudy.duration && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Duration</p>
                        <p className="text-lg text-white flex items-center gap-2">
                          <FiClock size={18} />
                          {caseStudy.duration}
                        </p>
                      </div>
                    )}

                    {caseStudy.teamSize && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Team Size</p>
                        <p className="text-lg text-white flex items-center gap-2">
                          <FiUsers size={18} />
                          {caseStudy.teamSize}
                        </p>
                      </div>
                    )}

                    {/* Links */}
                    {(caseStudy.liveUrl || caseStudy.githubUrl) && (
                      <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs uppercase tracking-wider text-zinc-500 mb-4">Links</p>
                        <div className="flex flex-col gap-3">
                          {caseStudy.liveUrl && (
                            <a
                              href={caseStudy.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <FiExternalLink size={16} />
                              <span>Visit Live Site</span>
                            </a>
                          )}
                          {caseStudy.githubUrl && (
                            <a
                              href={caseStudy.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <FiGithub size={16} />
                              <span>View on GitHub</span>
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
                className="max-w-4xl prose prose-invert prose-lg prose-zinc
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4
                  prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
                  prose-strong:text-white prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:text-zinc-300
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-zinc-300
                  prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-400
                  prose-img:rounded-2xl prose-img:my-8"
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
