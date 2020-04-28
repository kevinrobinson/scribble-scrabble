module.exports = {
  // secrets, for API routes only
  serverRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL
  },

  // Will be available on both server and client
  publicRuntimeConfig: {}
};
