import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { IdAttributePlugin } from "@11ty/eleventy";
import { parseHTML } from "linkedom";

export default function (eleventyConfig) {
	// Copy `assets/` to `_site/assets/`
	eleventyConfig.addPassthroughCopy("assets");

	// Add syntax highlighting
	eleventyConfig.addPlugin(syntaxHighlight);

	// Add IDs to headings
	eleventyConfig.addPlugin(IdAttributePlugin);

	// Add target="_blank" to external links
	eleventyConfig.addTransform("externalLinks", (content, outputPath) => {
		if (outputPath?.endsWith(".html")) {
			const { document } = parseHTML(content);
			const links = document.getElementsByTagName("a");

			for (const link of links) {
				const href = link.getAttribute("href");
				if (href && !href.startsWith("/") && !href.startsWith("#")) {
					link.setAttribute("target", "_blank");
					link.setAttribute("rel", "noopener noreferrer");
				}
			}

			return document.toString();
		}
		return content;
	});

	// Merge data from multiple sources (such as tags)
	eleventyConfig.setDataDeepMerge(true);
};
