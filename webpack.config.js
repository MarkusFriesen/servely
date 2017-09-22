var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");
var webpack = require('webpack');

var isProd = process.argv.indexOf('-p') !== -1

var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  loader: ['css-loader', 'sass-loader'],
  publicPath: '/src/server/public/assets/styles'
})

var cssConfig = isProd ? cssProd : cssDev;

module.exports = {
  entry: './src/client/js/app.js',
  output: {
    path: isProd ? path.join(__dirname, 'src/server/public/') : path.resolve(__dirname, "dist"),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [{
        test: /\.s?css$/,
        use: cssConfig
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'stage-0'],
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
          }
        }
      },
      {
        test: /(\.png|\.jpe?g)$/,
        use: 'file-loader?name=[name].[ext]&publicPath=/&outputPath=assets/img/',
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "src/server/public/"),
    compress: true,
    stats: "errors-only",
    open: true,
    hot: true,
    setup: function(app){
      //Dish Type
      app.get('/api/dishTypes', function(req, res){
        res.status(200).json([
          {_id: "58833fdc7bb0c19fc957754c", name: "Quick Eats"},
          {_id: "58833fdc7bb0c19fc957754d", name: "Mains"},
          {_id: "58833fdc7cc9c19fc957754d", name: "Dessert"},
          {_id: "58833fdc7cc9c19fc958854d", name: "Drinks"},
        ])
      })

      //Dishes
      app.get('/api/dishes', function(req, res){
        res.status(200).json([
          {_id: "58833fdc7bb0c19fc957754b", name: "Simple Salad", description: "(Shellsburg, IA) chili, garlic, lime",cost: 6, type: "58833fdc7bb0c19fc957754c"},
          {_id: "58833fdc7bb0c19fc957752d", name: "Steak", description: "Argentinan Steak Cooked to your liking",cost: 6, type: "58833fdc7bb0c19fc957754d"},
          {_id: "58833fdc8bb0c19fc957754d", name: "Burger with Fries", description: "Beef, cheese, Lettuce, Tomatoes",cost: 6, type: "58833fdc7bb0c19fc957754d"},
          {_id: "58833ff97bb0c19fc957754c", name: "Orzo Salad", description: "house pickles, mustard seed, fried chili flake (if fried served w/ blue chz dressing)", cost: 9.50, type: "58833fdc7bb0c19fc957754c"},
          {_id: "58833ff97bb0c19fc957754f", name: "Muffin", description: "Oreo with Sugar dressing",cost: 1.75, type: "58833fdc7cc9c19fc957754d"},
          {_id: "58833ff97bb0c19fc957754g", name: "Brownie", description: "Chocolate with a sugar coating",cost: 1.90, type: "58833fdc7cc9c19fc957754d"},
          {_id: "58833gg97bb0c19fc957754c", name: "Sprite", description: "1.5L sprite",cost: 3.45, type: "58833fdc7cc9c19fc958854d"},
          {_id: "59933ff97bb0c19fc957754c", name: "Coffee", description: "Cofee with hot water", cost: 1.80, type: "58833fdc7cc9c19fc958854d"}
        ])
      })

      //Orders
      app.get('/api/orders', function(req, res){
        res.status(200).json([
          {_id: "58833fdc7bb0c19fc157863b", table: 1, name: "Markus", timestamp: Date.now(), dishes: [{id:"58833fdc7bb0c19fc957754b", quantity: 2}], made: true, hasPayed: false, amountPayed: 0, notes: ""},
          {_id: "58833fdc6ds8c19fc157863b", table: 1, name: "Elli", timestamp: Date.now() + 5, dishes: [{id:"58833ff97bb0c19fc957754c", quantity: 2}], made: false, hasPayed: false, amountPayed: 0, notes: "Extra pickels. Cream no Sugar. Potatoes on the side. Ketchup with Majyo." },
          {_id: "58875fdc6ds8c19fc865863b", table: 1, name: "John", timestamp: Date.now() + 10, dishes: [{id:"58833ff97bb0c19fc957754c", quantity: 2}, {id:"58833fdc7bb0c19fc957754b", quantity: 2}], made: false, hasPayed: false, amountPayed: 0, notes: "Extra pickels"}
        ])
      });

      app.delete('/api/orders', function (req, res){
        res.status(200).json({})
      });

      app.post('/api/orders', function(req, res){
        //TODO: figure out where order is in req
        res.status(200).json({})
      });
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Order',
      has: true,
      template: './src/client/index.html'
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: !isProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}