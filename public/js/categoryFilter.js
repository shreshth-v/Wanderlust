const filters = document.querySelectorAll(".filter");

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        const category = filter.getAttribute("data-category");
        
        if (category) {
            
            // Redirect to the category route
            window.location.href = `/listings/filter/${category}`;
        }
    });
});



const currentCategory = window.location.pathname.split('/').pop(); // Get category from the URL
filters.forEach(filter => {
    if (filter.getAttribute("data-category").toLowerCase() === currentCategory.toLowerCase()) {
        filter.classList.add("active");
    }
});