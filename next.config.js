module.exports = {
  serverRuntimeConfig: {
    myWord: 'words',
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL
  },

  // Will be available on both server and client
  publicRuntimeConfig: {}
};
