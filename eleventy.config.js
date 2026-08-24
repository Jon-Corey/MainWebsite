export default function (eleventyConfig) {
	// Set the input directory to `src`
    eleventyConfig.setInputDirectory('src');

	// Pass through static assets
	eleventyConfig.addPassthroughCopy("src/assets");

	// Pass through individual files in the root
	eleventyConfig.addPassthroughCopy("src/robots.txt");
	eleventyConfig.addPassthroughCopy("src/staticwebapp.config.json");

	// Merge data from multiple sources (such as tags)
	eleventyConfig.setDataDeepMerge(true);
};
