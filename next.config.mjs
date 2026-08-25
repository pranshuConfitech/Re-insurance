import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.BASEPATH,
  eslint: {
    ignoreDuringBuilds: true
  },
  // Next 16 infers workspace root from parent lockfiles; pin it to this app
  turbopack: {
    root: __dirname
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
