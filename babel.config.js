module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: {
					esmodules: true, // Use node 14 or higher
				},
				shippedProposals: true, // Allows modern features like BigInt
			}
		],
		"@babel/preset-react"
	],
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
