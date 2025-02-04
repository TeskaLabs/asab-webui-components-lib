import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy"; // ✅ Ensure SCSS files are copied

import { readFileSync } from "fs"; // ✅ Import FS to read package.json
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
        { src: "src/styles/**/*", dest: "dist/styles" }, // ✅ Ensure SCSS files are copied
        { src: "src/**/*.scss", dest: "dist" }, // ✅ Copies all SCSS files to dist
      ],
      flatten: false,
    }),
  ],
  external: [...Object.keys(packageJson.peerDependencies || {})],
};







// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import babel from "@rollup/plugin-babel";
// import peerDepsExternal from "rollup-plugin-peer-deps-external";
// import postcss from "rollup-plugin-postcss";
// import autoprefixer from "autoprefixer";


// export default {
// 	input: "lib/index.js",
// 	output: [
// 	    {
// 	        dir: "dist", // ✅ Preserve module structure
// 	        format: "cjs",
// 	        exports: "named",
// 	        sourcemap: true,
// 	        preserveModules: true, // ✅ Keeps individual module structure
// 	    },
// 	    {
// 	        dir: "dist",
// 	        format: "esm",
// 	        exports: "named",
// 	        sourcemap: true,
// 	        preserveModules: true,
// 	    }
// 	],
// 	plugins: [
// 		peerDepsExternal(),
// 		resolve({
// 			extensions: [".js", ".jsx"],
// 			moduleDirectories: ["node_modules", "src"],
// 			preferBuiltins: false,
// 		}),
// 		babel({
// 		    babelHelpers: "runtime",
// 		    extensions: [".js", ".jsx"], // ✅ Ensure it processes both JS and JSX files
// 		    include: ["src/**/*"], // ✅ Ensure all files in "src/" are processed
// 		    exclude: /node_modules/, // ✅ Do NOT transpile node_modules
// 		    presets: [
// 			  ["@babel/preset-env", { targets: "defaults" }],
// 			  "@babel/preset-react",
// 			],
// 		    plugins: [
// 		        "@babel/plugin-transform-runtime",
// 		        [
// 		            "module-resolver",
// 		            {
// 		                root: ["./src"], // ✅ Ensure correct resolution
// 		                extensions: [".js", ".jsx"],
// 		            }
// 		        ],
// 		    ]
// 		}),
// 		commonjs(),
// 		// commonjs({
// 		// 	include: /node_modules|src/,
// 		// 	transformMixedEsModules: true,
// 		// 	dynamicRequireTargets: ["src/**/*.js", "src/**/*.jsx"],
// 		// }),
// 		postcss({
// 			extensions: [".css", ".scss"],
// 			use: ["sass"],
// 			extract: true,
// 			minimize: true,
// 			plugins: [autoprefixer()],
// 		}),
// 	],
// 	external: ["react", "react-dom"],
// };


// export default {
// 	input: "src/index.js",
// 	output: [
// 	    {
// 	        file: "dist/index.js",
// 	        format: "cjs",
// 	        sourcemap: true,
// 	        exports: "named", // ✅ Ensure all named exports are kept
// 	        preserveModules: true, // ✅ Keep individual module structure (prevents removal)
// 	    },
// 	    {
// 	        file: "dist/index.esm.js",
// 	        format: "esm",
// 	        sourcemap: true,
// 	        exports: "named",
// 	        preserveModules: true, // ✅ Avoid issues with module resolution
// 	    }
// 	],
// 	plugins: [
// 	    peerDepsExternal(),
// 	    resolve({
// 	        extensions: [".js", ".jsx"],
// 	        rootDir: "./src", // ✅ Ensure Rollup looks in "src"
// 	        moduleDirectories: ["node_modules", "src"],
// 	        preferBuiltins: false,
// 	    }),
// 	    babel({
// 	        babelHelpers: "runtime",
// 	        extensions: [".js", ".jsx"],
// 	        exclude: "node_modules/**",
// 	        presets: ["@babel/preset-env", "@babel/preset-react"],
// 	        plugins: [
// 	            "@babel/plugin-transform-runtime",
// 	            [
// 	                "module-resolver",
// 	                {
// 	                    root: ["./src"], // ✅ Ensure "src" is treated as the base directory
// 	                    extensions: [".js", ".jsx"], // ✅ Allow both .js and .jsx files
// 	                }
// 	            ]
// 	        ]
// 	    }),
// 	    commonjs({
// 		    include: /node_modules/, // ✅ Ensure CommonJS modules are processed
// 		    transformMixedEsModules: true,
// 		    dynamicRequireTargets: [
// 		        "src/**/*.js",
// 		        "src/**/*.jsx"
// 		    ],
// 		}),
// 	    postcss({
// 	        extensions: [".css", ".scss"],
// 	        use: ["sass"],
// 	        extract: true,
// 	        minimize: true,
// 	        plugins: [autoprefixer()]
// 	    }),
// 	],
// 	external: ["react", "react-dom"]
// };
