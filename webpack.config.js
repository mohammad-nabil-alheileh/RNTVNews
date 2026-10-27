// Web build for LG webOS (oldest supported: webOS 22 = Chromium 87).
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './index.web.tsx',
  target: ['web', 'es2020'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '', // relative paths: webOS loads the app from file://
    clean: true,
  },
  resolve: {
    alias: { 'react-native$': 'react-native-web' },
    // .web.* files win over shared ones, e.g. deviceInfo.web.ts
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      { test: /\.m?js$/, resolve: { fullySpecified: false } },
      {
        test: /\.[jt]sx?$/,
        // Our code plus React Native libraries that ship untranspiled code
        exclude: /node_modules\/(?!(react-native-safe-area-context)\/)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false, // babel.config.js is for Metro (Android) only
            presets: [
              ['@babel/preset-env', {
                targets: { chrome: '87' },
                useBuiltIns: 'usage',
                corejs: '3.51',
                include: ['transform-class-properties', 'transform-private-methods'],
              }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: ['babel-plugin-react-compiler', 'react-native-web'],
          },
        },
      },
      { test: /\.(png|jpe?g|gif|svg|woff2)$/, type: 'asset/resource' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TV News Reader',
      templateContent:
        '<!doctype html><html><head><meta charset="utf-8"><title>TV News Reader</title></head>' +
        '<body style="margin:0;background:#10171d"><div id="root" style="height:100vh;display:flex"></div></body></html>',
    }),
    new webpack.DefinePlugin({ __DEV__: JSON.stringify(argv.mode !== 'production') }),
    new CopyPlugin({ patterns: [{ from: 'webos' }] }), // appinfo.json + icons
  ],
  devServer: { port: 8080, historyApiFallback: true },
});
