//@ts-nocheck
const path = require('path')
const baseConfig = require('../../webpack.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { default: merge } = require('webpack-merge')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

//https://github.com/privatenumber/esbuild-loader/discussions/205

module.exports = merge(baseConfig, {
  entry: {
    admin: './src/main.ts'
  },
  output: {
    path: path.resolve(__dirname, '../../dist/admin')
  },
  devServer: {
    port: 8888
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2015'
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          jsxFactory: 'vueJsxCompat',
          target: 'es2015'
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../../public/index.html',
      title: '创作者中心',
      script: `<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
      <link rel="stylesheet" href="https://unpkg.com/prism-themes/themes/prism-material-light.css" />
    `
    }),
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      vueJsxCompat: [path.resolve(path.join(__dirname, './vue-jsx-compat.js')), 'default']
    }),
    new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_OPTIONS_API__: true
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        milkdown: {
          test: (module) => {
            return /@milkdown.+/.test(module.context)
          },
          name: 'milkdown',
          priority: 1
        }
      }
    }
  }
})
