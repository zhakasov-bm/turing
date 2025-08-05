module.exports = {
  siteUrl: process.env.SITE_URL || 'https://alanturing.app',
  generateRobotsTxt: true,
  exclude: ['/admin'],
  sitemapSize: 7000,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}
