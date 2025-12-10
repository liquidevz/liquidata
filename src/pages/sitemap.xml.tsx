import { GetServerSideProps } from 'next';
import { publicFetch } from '../utils/adminApi';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const [seoConfig, blogs, caseStudies] = await Promise.all([
      publicFetch('/api/seo-config'),
      publicFetch('/api/blogs'),
      publicFetch('/api/case-studies')
    ]);

    const baseUrl = seoConfig?.siteUrl || 'https://liquidata.com';
    const currentDate = new Date().toISOString();

    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/calculator', priority: '0.9', changefreq: 'weekly' }
    ];

    const blogPages = (blogs?.blogs || []).map((blog: any) => ({
      url: `/blog/${blog.slug}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: blog.publishedAt || blog.createdAt
    }));

    const caseStudyPages = (caseStudies?.caseStudies || []).map((cs: any) => ({
      url: `/case-studies/${cs.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: cs.publishedAt || cs.createdAt
    }));

    const allPages = [...staticPages, ...blogPages, ...caseStudyPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
};

export default Sitemap;