module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cs-stores-images.s3.amazonaws.com', 'imgur.com', 'comeschile.cl'],
  },
  webpack: (config, { defaultLoaders, isServer }) => {
    if (isServer) {
      config.externals.push('_http_common')
    }
    return config
  },
}
