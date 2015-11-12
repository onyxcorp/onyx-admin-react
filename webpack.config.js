var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var output = path.join(__dirname, 'dist/build');
var mainPath = path.resolve(__dirname, 'src', 'client.js');
var globalsPath = path.resolve(__dirname, 'src', 'globals.js');
var mainStyle = path.resolve(__dirname, 'src/styles', 'app.less');
var adminStyle = path.resolve(__dirname, 'src/styles', 'admin.less');


var lessLoader = [
    "css-loader",
    "less-loader"
];

var serverEntries = [
    "webpack-dev-server/client?http://localhost:8080",
    'webpack/hot/only-dev-server'
];

module.exports = {

    resolve: {
        modulesDirectories: ["node_modules", "src"],
        extensions : ["", ".js", ".jsx", ".less"]
    },

    entry: {
        client: [serverEntries.toString(), mainPath],
        style: [serverEntries.toString(), adminStyle, mainStyle],
        globals: [serverEntries.toString(), globalsPath]
        },


    devServer: {
        contentBase: './dist/',
        publicPath: '/build/',
        hot: true,
        quiet: true,
        noInfo: true,
        headers: { "Access-Control-Allow-Origin": "*" },
        historyApiFallback: {
            index: 'index.html'
        }
    },
    resolveLoader: {
        modulesDirectories: ["node_modules", "src"],
        extensions : ["", ".js", ".jsx", ".less"]
    },
    output: {
        path: output,
        filename: '[name].js',
        publicPath: '/build/'
    },
    node          : {
        net : 'empty',
        tls : 'empty',
        dns : 'empty'
    },
    progress: true,
    module: {
        loaders: [{
            test: /\.js.*$/,
            loaders: ['react-hot', 'babel','babel?stage=1'],
            exclude: /node_modules/
        }, {
            test: /\.png.*$/,
            loaders: ['url-loader?limit=100000&mimetype=image/png'],
            exclude: /node_modules/
        },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", lessLoader.join("!"))
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("bundle.css"),
        //new webpack.optimize.UglifyJsPlugin(),
        new webpack.NoErrorsPlugin()

    ]
};
