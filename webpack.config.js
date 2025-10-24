const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  // webpack.config.js (bagian devServer)
devServer: {
  static: './dist',
  historyApiFallback: true,
  port: 8080,
  hot: true,
  proxy: {
    '/api': {
      target: 'https://story-api.dicoding.dev',
      changeOrigin: true,
      secure: true,
      pathRewrite: { '^/api': '' }, // /api/login -> https://story-api.dicoding.dev/login
      headers: {
      }
    }
  }
},

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      title: 'StoryMapApp'
    })
  ],
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    splitChunks: { chunks: 'all' }
  }
};
