const { join } = require('path')
require('dotenv').config()
const webpack = require('webpack')

// Import all plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractText = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DashboardPlugin   = require('webpack-dashboard/plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const WriteFilePlugin   = require('write-file-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const proxyConfig = {
    "target": {
        "host": process.env.WP_HOST,
        "protocol": 'http:',
        "port": process.env.WP_PORT
    },
    ignorePath: false,
    changeOrigin: true,
    secure: false
}

module.exports = env => {
    const dist = join(__dirname, process.env.THEME_FOLDER)
    const isProd = env && env.production
    const isAnalyzer = env && env.analyzer
    return {
        context: process.cwd(),
        entry: {
			main: './index.js'
		},
		output: {
			path: dist,
			filename: `${process.env.JS_FOLDER}/bundle.js`,
            publicPath: '/',
            pathinfo: true
        },
        devtool: isProd ? 'eval' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.js$/,
					exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env', {
                                    modules: false
                                }]
                            ]
                        }
                    }
                },
                {
                    test: /\.(sass|scss)$/,
                    exclude: /node_modules/,
                    use: isProd ?  ExtractText.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: "css-loader",
                            options: { minimize: true }
                        },{
                            loader: "postcss-loader",
                            options: {
                                plugins: () => [require('autoprefixer')({
                                    browsers: ['last 5 version', 'ie 9']
                                })]
                            }
                        },{
                            loader: "sass-loader"
                        }]
					}) : [{
                        loader: "style-loader"
                    },{
                        loader: "css-loader",
                    },{
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require('autoprefixer')({
                                browsers: ['last 1 version']
                            })]
                        }
                    },{
                        loader: "sass-loader", // compiles Sass to CSS
                    }]
				}
            ]
        },
		devServer: {
            contentBase: dist,
            port: process.env.PORT,
			historyApiFallback: true,
			compress: isProd,
			inline: !isProd,
			hot: !isProd,
			stats: {
                // Hide all chunks logs
				chunks: false
            },
            proxy: {
                // '**': proxyConfig,
                '/': proxyConfig,
            }
		},
        plugins: [
            ...(isAnalyzer ? [new BundleAnalyzerPlugin()] : []),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isProd ? JSON.stringify('production') : JSON.stringify('development')
            }),
            new ExtractText({
                filename: `${process.env.CSS_FOLDER}/main.css`,
                allChunks: true
            }),
            new CleanWebpackPlugin([
                join(dist, `${process.env.CSS_FOLDER}/main.css`),
                join(dist, `${process.env.CSS_FOLDER}/main.css.map`),
                join(dist, `${process.env.JS_FOLDER}/bundle.js`),
                join(dist, `${process.env.JS_FOLDER}/bundle.js.map`)
            ],{
                root: dist
            }),
            ...( isProd ? [] : [new DashboardPlugin()]),
            new OpenBrowserPlugin({ url: `http://${process.env.HOST}:${process.env.PORT}` }),
            new WriteFilePlugin(),
            ...(isProd ? [
                new UglifyJSPlugin()
            ] : [] )
        ]
    }
    
}