import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const sitemap = new SitemapStream({
  hostname: 'https://www.zaggathletics.com',
});
const writeStream = createWriteStream('./public/sitemap.xml');

sitemap.pipe(writeStream);

// Add your routes here:
[
  '/',
  '/signup',
  '/login',
  '/workouts',
  '/add-workout',
  '/Ranks',
  '/settings',
].forEach(route =>
  sitemap.write({ url: route, changefreq: 'weekly', priority: 0.8 })
);

sitemap.end();

streamToPromise(sitemap).then(() => console.log('✅ sitemap.xml created'));
