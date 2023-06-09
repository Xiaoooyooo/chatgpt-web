const config = require("./webpack.config");

/** @type {typeof config} */
const prodConfig = {
  ...config,
  mode: "development",
  devServer: {
    port: 8888,
    historyApiFallback: true,
  },
  devtool: "source-map",
  // devtool: false,
};

module.exports = prodConfig;
