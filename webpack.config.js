const webpack = require("webpack");
const path = require("path");
const miniCss = require("mini-css-extract-plugin");
const htmlPlugin = require("html-webpack-plugin");

/** @type {import("webpack").Configuration} */
const config = {
  mode: null,
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[id].js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [miniCss.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: [miniCss.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        use: "@svgr/webpack",
      },
    ],
  },
  plugins: [
    new miniCss({}),
    new htmlPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== "production",
    }),
  ],
};

module.exports = config;
