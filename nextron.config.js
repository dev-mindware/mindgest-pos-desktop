module.exports = {
  // Specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'main',
  // Specify an alternate webpack configuration
  webpack: (config, env) => {
    config.externals = {
      ...config.externals,
      'better-sqlite3': 'commonjs better-sqlite3',
    };
    return config;
  },
};
