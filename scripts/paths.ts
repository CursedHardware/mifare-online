import path from "path";

export const ROOT_PATH = path.resolve(__dirname, "..");
export const SRC_PATH = path.resolve(ROOT_PATH, "src");
export const ASSETS_PATH = path.resolve(ROOT_PATH, "assets");
export const FAVICON_PATH = path.resolve(ASSETS_PATH, "favicon.png");
export const DIST_PATH = path.join(ROOT_PATH, "dist");
export const NODE_MODULES = path.join(ROOT_PATH, "node_modules");
