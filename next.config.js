const nextTranslate = require('next-translate');

const nextConfig = {
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    domains: ['localhost', 'res.cloudinary.com', 'esasis.esa.edu.lb'],
  },
  swcMinify: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  ...nextTranslate(),
  publicRuntimeConfig: {
    ENCRYPT_SECRET_KEY: '3H}.+z]M+QLA:)*&)&6m6HnD>87/B%^ftd"!jMu4Pm]UUW0$nUaH.NZ.d1s6T9-',
  },
  rewrites: async () => {
    return [
      {
        source: '/file/:path*', // Add a dynamic parameter in the source
        destination: 'http://localhost:3002/:path*', // Append the dynamic parameter to the destination
      },
      {
        source: '/api/:path*', // Add a dynamic parameter in the source
        destination: 'http://localhost:3001/api/:path*', // Append the dynamic parameter to the destination
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
