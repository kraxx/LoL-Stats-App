const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const outputDirectory = "dist";

const clientPort = 3000;
const serverPort = 3001;

module.exports = {
  entry: "./client/src/index.js",
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "./bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    port: clientPort,
    open: true,
    proxy: {
      "/api": `http://localhost:${serverPort}`
    },
    historyApiFallback: true // unsure what this is
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
      favicon: "./client/public/favicon.ico"
    })
  ]
};