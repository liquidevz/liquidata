import { GetServerSideProps } from 'next';
import { publicFetch } from '../utils/adminApi';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://liquidata.com';
  const currentDate = new Date().toISOString();

  try {
    const [seoConfig, blogs, caseStudies] = await Promise.allSettled([
      publicFetch('/api/seo-config'),
      publicFetch('/api/blogs'),
      publicFetch('/api/case-studies')
    ]);

    const siteUrl = seoConfig.status === 'fulfilled' && seoConfig.value?.siteUrl ? seoConfig.value.siteUrl : baseUrl;

    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/calculator', priority: '0.9', changefreq: 'weekly' }
    ];

    const blogPages = blogs.status === 'fulfilled' && blogs.value?.blogs
      ? blogs.value.blogs.map((blog: any) => ({
          url: `/blog/${blog.slug}`,
          priority: '0.6',
          changefreq: 'weekly',
          lastmod: blog.publishedAt || blog.createdAt || currentDate
        }))
      : [];

    const caseStudyPages = caseStudies.status === 'fulfilled' && caseStudies.value?.caseStudies
      ? caseStudies.value.caseStudies.map((cs: any) => ({
          url: `/case-studies/${cs.slug}`,
          priority: '0.7',
          changefreq: 'monthly',
          lastmod: cs.publishedAt || cs.createdAt || currentDate
        }))
      : [];

    const allPages = [...staticPages, ...blogPages, ...caseStudyPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    const fallbackPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/calculator', priority: '0.9', changefreq: 'weekly' }
    ];

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.write(fallbackSitemap);
    res.end();
  }

  return { props: {} };
};

export default Sitemap;