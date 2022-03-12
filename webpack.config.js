const webpack = require("webpack");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  context: __dirname,
  mode: process.env.NODE_ENV,
  devtool: isDevelopment ? "eval" : "nosources-source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
      favicon: "public/favicon.ico"
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new LodashModuleReplacementPlugin(),
    new Dotenv(),
    isDevelopment && new ReactRefreshWebpackPlugin({ overlay: false })
  ].filter(Boolean),
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    plugins: [new TsconfigPathsPlugin()]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public")
    },
    server: "https",
    compress: true,
    open: true,
    port: process.env.API_PORT || 4200,
    historyApiFallback: true,
    hot: isDevelopment
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(ico|png|jpe?g|gif|ttf|woff2|svg)$/i,
        type: "asset/resource"
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              ignoreDiagnostics: [
                2322, 2532, 2345, 2571, 2769, 2783, 2571, 2305
              ],
              getCustomTransformers: () => ({
                before: isDevelopment ? [ReactRefreshTypeScript()] : []
              }),
              transpileOnly: isDevelopment
            }
          }
        ]
      }
    ]
  }
};
