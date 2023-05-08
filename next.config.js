/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false,
  },
    experimental: {
      appDir: true,
    },
    images: {
      domains: ['avatars.githubusercontent.com','lh3.googleusercontent.com']
    }

  }

module.exports = nextConfig
