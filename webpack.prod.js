const config = require("./webpack.config");

/** @type {typeof config} */
const prodConfig = {
  ...config,
  output: {
    ...config.output,
    publicPath: "/chatgpt-web",
  },
  devtool: false,
  mode: "production",
  optimization: {
    chunkIds: "named",
    splitChunks: {
      maxSize: 300 * 1024,
      chunks: "all",
      cacheGroups: {
        react: {
          test: /[\\/]react(-router)?(-dom)?[\\/]/,
          name: "react",
          chunks: "initial",
          priority: 50,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 0,
        },
      },
    },
  },
};

module.exports = prodConfig;
