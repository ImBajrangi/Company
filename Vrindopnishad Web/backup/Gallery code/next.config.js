module.exports = {
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  }
}; 
