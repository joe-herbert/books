document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".filter").forEach((filter) => {
        filter.addEventListener("click", (event) => {
            const id = event.currentTarget.dataset.id;
            const type = event.currentTarget.dataset.type.toLowerCase();
            let params = new URLSearchParams(window.location.search);
            params.delete(type, id);
            window.location.search = params.toString();
        });
    });
});
