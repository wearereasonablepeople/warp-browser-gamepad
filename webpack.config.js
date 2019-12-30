const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  mode: isDev ? "development" : "production",
  target: "web",
  entry: path.resolve(__dirname, isDev ? "example" : "src"),
  output: {
    filename: "index.js"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "example"),
    port: 3000
  }
};
