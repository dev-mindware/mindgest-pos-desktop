module.exports = {
  // Specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'main',
  // Specify an alternate webpack configuration
  webpack: (config, env) => {
    // Mantém as configurações originais e garante formato de array
    let baseExternals = config.externals || [];
    if (!Array.isArray(baseExternals)) {
      baseExternals = [baseExternals];
    }

    config.externals = [
      ...baseExternals,
      {
        'better-sqlite3': 'commonjs better-sqlite3',
        'node-machine-id': 'commonjs node-machine-id'
      },
      // Exclusão estrita via Função para garantir o require('commonjs ...')
      function ({ context, request }, callback) {
        if (/^@prisma\/client(\/.*)?$/.test(request) || /^\.prisma\/client(\/.*)?$/.test(request) || /^prisma-client(\/.*)?$/.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      }
    ];

    return config;
  },
};
