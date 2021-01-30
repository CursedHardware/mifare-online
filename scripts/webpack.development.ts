import merge from "webpack-merge";
import config from "./webpack.config";

import CSSPlugin from "mini-css-extract-plugin";

export default merge(config, {
    mode: "development",
    devtool: "source-map",
    devServer: {
        hot: false,
        inline: false,
    },
    plugins: [
        new CSSPlugin(),
    ],
});
