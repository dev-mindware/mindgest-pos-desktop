/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  distDir: '../app',
  images: {
    unoptimized: true,
  },
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    return config
  },
}
