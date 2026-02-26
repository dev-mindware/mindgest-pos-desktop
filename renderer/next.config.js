/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  distDir: '../app',
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config) => {
    return config
  },
}
