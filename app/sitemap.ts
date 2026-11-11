import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

// One page for now. Add an entry here for each page the site gains.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
