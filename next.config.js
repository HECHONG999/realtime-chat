/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false,
  },
    experimental: {
      appDir: true,
    },
    // images: {
    //   domains: ['lh3.googleusercontent.com']
    // }
  }

module.exports = nextConfig
