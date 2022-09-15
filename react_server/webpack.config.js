const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: './main.js',
   output: {
      path: path.join(__dirname, '/bundle'),
      filename: 'index_bundle.js'
   },
   devServer: {
      port: 8001
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/, 
            loader: 'babel-loader',
            options: {
               presets: ["@babel/preset-env", "@babel/preset-react"]
            },
         },
         {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
         },
         {
            test: /\.(jpe?g|png|gif|svg)$/i, 
            loader: 'file-loader',
            options: {
              name: 'public/[name].[ext]'
            }
        }
      ],
   },
   plugins:[
      new HtmlWebpackPlugin({
         template: './index.html'
      })
   ]
}