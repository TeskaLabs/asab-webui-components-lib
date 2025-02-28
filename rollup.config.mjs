import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy"; // Ensure SCSS files are copied

import { readFileSync } from "fs"; // Import FS to read package.json
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf8"));

export default {
  input: "lib/index.js",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    postcss({
      extensions: [".css", ".scss"],
      use: ["sass"],
      extract: true,
      minimize: true,
    }),
    resolve({
      extensions: [".js", ".jsx", ".scss"],
    }),
    commonjs({
      ignore: (id) => id.includes(".scss"),
    }),
    babel({
      babelHelpers: "runtime",
      extensions: [".js", ".jsx"],
      exclude: /node_modules/,
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
    }),
    copy({
      targets: [
        { src: "src/styles/**/*", dest: "dist/styles" }, // Ensure SCSS files are copied
        { src: "src/**/*.scss", dest: "dist" }, // Copies all SCSS files to dist
      ],
      flatten: false,
    }),
  ],
  external: [...Object.keys(packageJson.peerDependencies || {})],
};
