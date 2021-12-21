//@ts-nocheck
const path = require('path')
const baseConfig = require('../../scripts/webpack.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { default: merge } = require('webpack-merge')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

//https://github.com/privatenumber/esbuild-loader/discussions/205

module.exports = merge(baseConfig, {
  entry: {
    admin: './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, '../../dist/admin'),
  },
  devServer: {
    port: 8888,
  },
  resolve: {
    alias: {
      h: 'vue',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2015',
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          jsxFactory: 'vueJsxCompat',
          target: 'es2015',
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      vueJsxCompat: [path.resolve(path.join(__dirname, './vue-jsx-compat.js')), 'default'],
    }),
    new webpack.DefinePlugin({
      __GH__: JSON.stringify(false),
      __ROUTER_BASE__: JSON.stringify('/'),
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_OPTIONS_API__: true,
    }),
  ],
})
