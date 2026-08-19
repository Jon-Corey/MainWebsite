// Handle Navbar Toggle

const navbarToggle = navbar.querySelector("#navbar-toggle");
const navbarMenu = document.querySelector("#navbar-menu");
const navbarLinksContainer = navbarMenu.querySelector(".navbar-links");
let isNavbarExpanded = navbarToggle.getAttribute("aria-expanded") === "true";

const toggleNavbarVisibility = () => {
    isNavbarExpanded = !isNavbarExpanded;
    navbarToggle.setAttribute("aria-expanded", isNavbarExpanded);
};

navbarToggle.addEventListener("click", toggleNavbarVisibility);

navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
navbarMenu.addEventListener("click", toggleNavbarVisibility);

// Handle Theme

function getTheme() {
    let theme = localStorage.getItem('SelectedTheme')?.replaceAll('"', '')?.trim()?.toLowerCase() ?? '';

    if (theme !== 'dark' && theme !== 'light') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return theme;
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('SelectedTheme', newTheme);
    document.documentElement.classList.remove(currentTheme);
    document.documentElement.classList.add(newTheme);
}

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', toggleTheme);

// Handle Copy Button on Code Blocks

(() => {
    const codeBlocks = document.querySelectorAll('pre[class*="language"]');

    codeBlocks.forEach((codeBlock) => {
        const button = document.createElement('button');
        button.classList.add('copy-button');
        button.type = 'button';
        button.ariaLabel = 'Copy code to clipboard';
        button.innerHTML = '<i class="bi bi-copy"></i>';

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent);
            button.innerHTML = '<i class="bi bi-check-lg"></i>';
            button.classList.add('copied');
            setTimeout(() => {
                button.classList.remove('copied');
            }, 1500);
            setTimeout(() => {
                button.innerHTML = '<i class="bi bi-copy"></i>';
            }, 2000);
        });
        codeBlock.appendChild(button);
    });
})();
