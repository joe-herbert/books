document.addEventListener("DOMContentLoaded", () => {
    console.log("load");
    searchdown("titleInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "Title",
        inputName: "title",
    });
    searchdown("authorInput", {
        values: authors,
        multiple: false,
        addValues: true,
        placeholder: "Author",
        inputName: "author",
    });
    searchdown("genreInput", {
        values: genres,
        multiple: true,
        addValues: true,
        placeholder: "Genres",
        inputName: "genres",
    });
    searchdown("tagInput", {
        values: tags,
        multiple: true,
        addChoices: true,
        placeholder: "Tags",
        inputName: "tags",
    });
});

function addBookFormSubmit(form) {
    const data = {
        title: sdGetValue(form.title, true),
        author: sdGetValue(form.author, true),
        genres: sdGetValue(form.genres, true),
        tags: sdGetValue(form.tags, true),
    };
    fetch(`${window.location.origin}/books/addBook`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.ok) {
            //TODO: add book to table
        } else {
            //TODO: handle error
        }
    });
}
