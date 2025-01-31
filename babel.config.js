module.exports = {
	presets: ["@babel/preset-env", "@babel/preset-react"],
	plugins: [
		"@babel/plugin-transform-runtime",
		[
			"module-resolver",
			{
				extensions: [".js", ".jsx"],
				resolvePath: (sourcePath) => {
					if (sourcePath.endsWith(".jsx")) {
						return sourcePath.replace(".jsx", ".js");
					}
					return sourcePath;
				}
			}
		]
	]
};
