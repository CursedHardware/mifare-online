import merge from "webpack-merge";
import config from "./webpack.config";

import CSSPlugin from "mini-css-extract-plugin";
import OptimizeCSSPlugin from "optimize-css-assets-webpack-plugin";
import { HashedModuleIdsPlugin } from "webpack";

export default merge(config, {
    mode: "production",
    devtool: false,
    optimization: {
        runtimeChunk: "single",
    },
    plugins: [
        new CSSPlugin(),
        new OptimizeCSSPlugin(),
        new HashedModuleIdsPlugin(),
    ],
});
