const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  webpack: (config, { isServer }) => {
    // Adiciona uma regra de carregamento para arquivos do puppeteer-core
    if (!isServer) {
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/puppeteer-core/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      });
    }

    // Configuração para resolver o alias 'canvas'
    config.resolve.alias.canvas = false;

    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.placafipe.xyz/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "https://api.futuredata.com.br/:path*",
      },
    ];
  },

  async middleware() {
    const apiProxy = createProxyMiddleware({
      target: "https://api.placafipe.xyz",
      changeOrigin: true,
    });

    const authProxy = createProxyMiddleware({
      target: "https://api.futuredata.com.br",
      changeOrigin: true,
    });

    return {
      "/api": apiProxy,
      "/auth": authProxy,
    };
  },

  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

