const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ProgressPlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

const isEnvProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {},
  mode: isEnvProduction ? 'production' : 'development',
  output: {
    filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
    chunkFilename: isEnvProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]'
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
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [isEnvProduction ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
            // @ts-ignore
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
          // Added for profiling in devtools
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }),
    new ProgressPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isEnvProduction)
    })
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    compress: true,
    historyApiFallback: true,
    hot: true
  }
}
