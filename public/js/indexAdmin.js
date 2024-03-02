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

function addBookFormSubmit() {
    let input = document.querySelector("#coverInput");
    if (!input.files || !input.files[0]) {
        sendBook(undefined);
    } else {
        readFile(true, sendBook);
    }
}

function sendBook(img) {
    const data = {
        title: sdGetValue("sdInput-title", true),
        author: sdGetValue("sdInput-author", true),
        genres: sdGetValue("sdInput-genres", true),
        tags: sdGetValue("sdInput-tags", true),
    };
    if (img) {
        data.cover = img;
    }
    fetch(`${window.location.origin}/books/addBook`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.ok) {
            console.log(response);
            console.log(data);
            //TODO: add book to table
        } else {
            //TODO: handle error
        }
    });
}
