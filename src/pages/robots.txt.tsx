import { GetServerSideProps } from 'next';
import { publicFetch } from '../utils/adminApi';

const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const seoConfig = await publicFetch('/api/seo-config');
    const robotsTxt = seoConfig?.robotsTxt || 'User-agent: *\nAllow: /';
    
    res.setHeader('Content-Type', 'text/plain');
    res.write(robotsTxt);
    res.end();
  } catch (error) {
    res.setHeader('Content-Type', 'text/plain');
    res.write('User-agent: *\nAllow: /');
    res.end();
  }

  return { props: {} };
};

export default RobotsTxt;