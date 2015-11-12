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


module.exports = {

    resolve: {
        modulesDirectories: ["node_modules", "src"],
        extensions : ["", ".js", ".jsx", ".less"]
    },

    entry: {
        client: [mainPath],
        style: [adminStyle, mainStyle],
        globals: [globalsPath]
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
            loaders: ['babel','babel?stage=1'],
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
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins: [
        new ExtractTextPlugin("bundle.css"),
        new webpack.optimize.UglifyJsPlugin({sourceMap: false}),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};
