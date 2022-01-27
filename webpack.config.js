const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ProgressPlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyPlugin = require('copy-webpack-plugin')

const isEnvProduction = process.env.NODE_ENV === 'production'

const LOCAL_API_HOST = 'http://127.0.0.1:8080'
const API_HOST = isEnvProduction ? 'http://api.upv.life' : `/api`
const STORAGE_HOST = isEnvProduction ? 'http://storge.upv.life' : `${LOCAL_API_HOST}/upload`

module.exports = {
  mode: isEnvProduction ? 'production' : 'development',
  target: 'web',
  output: {
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : 'static/js/bundle_[name].js',
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
  },
  devtool: !isEnvProduction ? 'eval-source-map' : false,
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
          target: 'es2015'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../../' }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isEnvProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: { maxSize: 10000 }
        }
      },
      {
        test: /\.svg$/i,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true
      }),
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '../../public/',
          globOptions: {
            ignore: ['**/*.html']
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }),
    new ProgressPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isEnvProduction),
      __API_HOST__: JSON.stringify(API_HOST),
      __STORAGE_HOST__: JSON.stringify(STORAGE_HOST)
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    isEnvProduction &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      })
  ].filter(Boolean),
  devServer: {
    static: '../../public',
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
    compress: true,
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/api': {
        target: LOCAL_API_HOST,
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true
      }
    }
  }
}
