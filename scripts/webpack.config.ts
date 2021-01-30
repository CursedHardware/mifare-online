import webpack from "webpack";

import * as TypedCSSModules from "@nice-labs/typed-css-modules";
import CleanPlugin from "clean-webpack-plugin";
import HTMLPlugin from "html-webpack-plugin";
import CSSPlugin from "mini-css-extract-plugin";
import PathsPlugin from "tsconfig-paths-webpack-plugin";
import * as paths from "./paths";

const configure: webpack.Configuration = {
    entry: paths.SRC_PATH,
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new PathsPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: require.resolve("ts-loader"),
                options: { compilerOptions: { module: "esnext" } },
            },
            {
                test: /\.s?css$/,
                use: [
                    CSSPlugin.loader,
                    {
                        loader: require.resolve("css-loader"),
                        options: { modules: true },
                    },
                    TypedCSSModules.loader,
                    require.resolve("sassjs-loader"),
                ],
                include: paths.SRC_PATH,
            },
            {
                test: /\.css$/,
                use: [
                    CSSPlugin.loader,
                    require.resolve("css-loader"),
                ],
                include: paths.NODE_MODULES,
            },
            {
                test: /\.mfd$/,
                use: require.resolve("buffer-loader"),
            },
            {
                test: /\.md$/,
                use: require.resolve("raw-loader"),
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    plugins: [
        new HTMLPlugin({
            title: "Mifare Online",
            favicon: paths.FAVICON_PATH,
        }),
        new CleanPlugin(),
    ],
    devServer: {
        https: true,
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    },
};

export default configure;
