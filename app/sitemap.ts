import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://repid.dev'
  
  const staticRoutes = [
    '',
    '/why',
    '/ecosystem',
    '/learn',
    '/leaderboard',
    '/ethics',
    '/bounties',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticRoutes]
}
