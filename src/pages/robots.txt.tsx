import { GetServerSideProps } from 'next';
import { publicFetch } from '../utils/adminApi';

const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const seoConfig = await publicFetch('/api/seo-config');
    const baseRobots = seoConfig?.robotsTxt || `# Liquidata Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://liquidata.dev/sitemap.xml

Crawl-delay: 0`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.write(baseRobots);
    res.end();
  } catch (error) {
    res.setHeader('Content-Type', 'text/plain');
    res.write(`# Liquidata Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://liquidata.dev/sitemap.xml`);
    res.end();
  }

  return { props: {} };
};

export default RobotsTxt;