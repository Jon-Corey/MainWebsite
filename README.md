# JonCorey.Dev

This is the main website for JonCorey.Dev, a software development company that's trying to make complex things simple. For more info about JonCorey.Dev, you can visit this site at [joncorey.dev](https://joncorey.dev).

## ⚙️ Tech

This site is a static site that uses HTML, CSS, and JavaScript (no frameworks).

### 🏗️ 11ty

The site is built by **[11ty](https://11ty.dev)**, a static site generator. The site uses 11ty to accomplish the following things:

- Reuse HTML in multiple places (e.g. `/_includes/base.html` is used on every page).
- Populate the 'Products' and 'Blog' lists with all products/blog articles automatically (see `/product.html`).
- Rename and move HTML files to make the URL look better (e.g. `joncorey.dev/product.html` -> `joncorey.dev/product/`).
- Add `id` attributes to headings (e.g. `<h2>About</h2>` -> `<h2 id="about">About</h2>`).
- Add `target="_blank" rel="noopener noreferrer"` to external links.
- Add syntax highlighting to code blocks (using [PrismJS](https://prismjs.com)).

### 🛠️ Other Tools

- **[Bootstrap Icons](https://icons.getbootstrap.com)**: The icons used on this site.
- **[Vector Text](https://vector-text.com)**: Used to generate the text in the product and blog article cards.
- **[PrismJS](https://prismjs.com)**: Used for syntax highlighting of code blocks.
  - **[VS Code Dark+ Prism Theme](https://github.com/PrismJS/prism-themes)**: The syntax highlighting theme.
- **[linkedom](https://github.com/WebReflection/linkedom)**: Used to parse and modify some HTML in the build process.
- **[Embla Carousel](https://www.embla-carousel.com)**: Used for the screenshot carousel on the [Game Tally page](https://joncorey.dev/game-tally).
- **[Umami](https://umami.is)**: Privacy-focused analytics used for improving the contents of the website.

## 📁 File Structure

- `_includes/`: Holds 11ty page layouts used by other pages.
- `_site/`: The folder containing the built site. Not included in source control.
- `assets/`: Contains assets used on the site. Not built by 11ty.
  - `css/`: Contains CSS files.
  - `data/`: Contains JSON files.
  - `images/`: Contains images.
  - `js/`: Contains JavaScript files.
- Other Folders: Contain groups of pages.
- `.gitignore`: Defines the folders/files that should be ignored by Git and 11ty.
- `.eleventyignore`: Defines the folders/files that should be ignored by 11ty, but not Git.
- `eleventy.config.js`: The config file for 11ty.
- `404.html`: The page to show when the user encounters a 404 error.
- `index.html`: The home page of the site.
- Other HTML and Markdown files: Other pages.

## 💻 Running Locally

### 🛠️ Build

The following command uses 11ty to build the site and output the built site to the `_site` folder.

```sh
npm run build
```

### 🏃‍♂️ Build and Run

The following command uses 11ty to build the site and output the built site to the `_site` folder. It then runs a local web server that hosts the built site. 11ty then watches for changes to the source files and will update the built site accordingly.

```sh
npm run start
```

## 📜 Licensing

This repository uses a split licensing model to distinguish between reusable code and protected content:

### ✅ Source Code

All original source code in this repository - including templates, configuration files, and scripts - is licensed under the MIT License. You are free to use, modify, and distribute this code in accordance with that license.

### 🚫 Content and Branding

All original content - including written text (e.g., blog posts, product descriptions, landing pages), branding, images, and other media - is not licensed for reuse or redistribution. These materials are protected under copyright and may not be copied, modified, or republished without explicit permission.

### 📦 Third-Party Code

This repository may include third-party code under separate licenses. Such files contain license notices in their headers or accompanying documentation. Please respect the terms of those licenses when using or modifying those components.

## 📝 Contributing

This repository is open-source for transparency and educational purposes, but I’m not currently accepting external contributions.

If you find a bug or have feedback, feel free to open an issue.
