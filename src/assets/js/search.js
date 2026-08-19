(() => {
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    if (searchInput && searchResults) {
        searchInput.addEventListener("input", function() {
            const query = searchInput.value.toLowerCase();
            const items = searchResults.getElementsByClassName("search-result-item");

            Array.from(items).forEach(function(item) {
                const title = item.querySelector("h2").textContent.toLowerCase();
                const description = item.querySelector(".description").textContent.toLowerCase();

                if (title.includes(query) || description.includes(query)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
})();
