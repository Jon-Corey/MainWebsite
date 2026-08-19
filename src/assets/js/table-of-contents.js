// Requires:
// - A container with id 'contents' containing the text content
// - A container with id 'table-of-contents' for the table of contents
// - Headings in the content should have unique IDs or they will be generated based on their text content
(() => {
    const contents = document.getElementById('contents');
    const toc = document.getElementById('table-of-contents');

    // Build the table of contents based on headings in the content
    const headingElements = contents.querySelectorAll('h2, h3, h4');
    let tocHTML = '<strong>Table of Contents</strong><ul>';

    headingElements.forEach(heading => {
        const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-');
        heading.id = id; // Ensure each heading has an ID
        const level = parseInt(heading.tagName.charAt(1), 10);
        tocHTML += `<li class="level-${level}"><a href="#${id}">${heading.textContent}</a></li>`;
    });

    tocHTML += '</ul>';
    toc.innerHTML = tocHTML;

    // Highlight only one active section at a time based on scroll position
    const headings = Array.from(headingElements);
    const tocLinks = Array.from(toc.querySelectorAll('a'));

    function highlightActiveSection() {
        let activeIndex = -1;
        const scrollPosition = window.scrollY + 100; // Offset for better detection

        for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const nextHeading = headings[i + 1];
            const headingTop = heading.getBoundingClientRect().top + window.scrollY;
            const nextHeadingTop = nextHeading
                ? nextHeading.getBoundingClientRect().top + window.scrollY
                : Infinity;

            if (scrollPosition >= headingTop && scrollPosition < nextHeadingTop) {
                activeIndex = i;
                break;
            }
        }

        tocLinks.forEach((link, idx) => {
            if (idx === activeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
    window.addEventListener('resize', highlightActiveSection);
    highlightActiveSection();
})();