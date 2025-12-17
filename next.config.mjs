/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  eslint: {
    ignoreDuringBuilds: true
  },
  // distDir: 'dist',
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboards',
        permanent: true
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/bapi/:path*',
        destination: '/api/bapi/:path*' // Proxy to Backend
      }
    ]
  }
}

export default nextConfig
