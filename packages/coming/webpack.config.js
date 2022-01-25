// @ts-nocheck
const path = require('path')
const baseConfig = require('../../webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { default: merge } = require('webpack-merge')

module.exports = merge(baseConfig, {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../../dist/html')
  },
  devServer: {
    port: 3001
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../../public/index.html',
      title: 'vpv - free animes no ads',
      script: `<script>
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?5e4eee252da8cfbd070f418edd852e33";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      </script>
      `
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        griffith: {
          test: (module) => {
            return /griffith.+|hls.+/.test(module.context)
          },
          name: 'griffith',
          priority: 1
        }
      }
    }
  }
})
