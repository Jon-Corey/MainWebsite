// Set year in footer
let yearElement = document.getElementById("current-year");
yearElement.innerText = new Date().getFullYear();

// Set CSS variables
// I'm using this instead of 80lvh because Edge on iOS treats lvh as dvh, which means it changes when the user scrolls. This logic sets a height once and leaves it.
document.documentElement.style.setProperty("--max-item-height", `${window.innerHeight * 0.8}px`);
