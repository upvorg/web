//@ts-nocheck
const path = require('path')
const baseConfig = require('../../scripts/webpack.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { default: merge } = require('webpack-merge')

module.exports = merge(baseConfig, {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../../dist/index')
  },
  devServer: {
    port: 3000
  },
  resolve: {
    alias: {
      component: path.resolve(__dirname, 'src/component'),
      public: path.resolve(__dirname, 'src/public'),
      api: path.resolve(__dirname, 'src/api'),
      widget: path.resolve(__dirname, 'src/widget')
    }
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                import: [path.resolve(__dirname, 'src/public/css/var.styl')]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
})
