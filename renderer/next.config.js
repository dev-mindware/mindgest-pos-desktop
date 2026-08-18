/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  distDir: '../app',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://mindgest.mindware-vps.cloud/api",
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || "MG_REg4eFg5eDJQU0lmNWcKUQU0YN3BDZDNvU2dnSnQ5OXRiL3NtbEhqSzhpdXNDZ2V6T2NwbzlCYnJDRWBTkJna3Foa2lHOXcwQkFRRUZBQVNZkbQo2lmN4eFg_MG",
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    return config
  },
}

