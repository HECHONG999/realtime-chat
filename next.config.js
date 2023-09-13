/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const sentryWebpackPluginOptions = {
  debug: false,

  // enable if too noisy in console
  silent: true,

  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
}

module.exports = (phase, { defaultConfig }) => {
  const nextPlugins = [
    withBundleAnalyzer,
    (nConfig) =>
        withSentryConfig(
            {
              ...nConfig,
              sentry: {
                // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#opt-out-of-auto-instrumentation-on-specific-routes
                excludeServerRoutes: ['/api/auth/[...nextauth]'],
              },
            },
            sentryWebpackPluginOptions,
        ),
  ]

  const config = nextPlugins.reduce(
      (prev, plugin) => {
        const update = plugin(prev)
        return typeof update === 'function'
            ? update(phase, defaultConfig)
            : update
      },
      { ...nextConfig },
  )

  return config
}
const nextConfig = {
  experimental: {
    appDir: true,
  },
    images: {
      domains: ['avatars.githubusercontent.com','lh3.googleusercontent.com']
    }

  }

// module.exports = nextConfig
