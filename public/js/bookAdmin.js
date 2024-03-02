document.addEventListener("DOMContentLoaded", () => {
    searchdown("nameInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "Title",
        inputName: "nameInput",
        initialValues: [bookName],
    });
    searchdown("authorInput", {
        values: authors,
        multiple: false,
        addValues: true,
        placeholder: "Author",
        inputName: "authorInput",
        initialValues: [bookAuthor],
    });
    searchdown("genreInput", {
        values: genres,
        multiple: true,
        addValues: true,
        placeholder: "Genres",
        inputName: "genreInput",
        initialValues: bookGenres,
    });
    searchdown("tagInput", {
        values: tags,
        multiple: true,
        addChoices: true,
        placeholder: "Tags",
        inputName: "tagInput",
        initialValues: bookTags,
    });
});

function editBook() {
    document.querySelector("body").classList.add("edit");
    document.getElementById("notes").classList.remove("hide");
}

function cancelEdit() {
    document.querySelector("body").classList.remove("edit");
    if (document.getElementById("notesField").innerHTML === "") {
        document.getElementById("notes").classList.add("hide");
    }
}

function saveBook() {
    let input = document.querySelector("#coverInput");
    if (!input.files || !input.files[0]) {
        sendBook(undefined);
    } else {
        readFile(true, sendBook);
    }
}

function sendBook(img) {
    const params = new URLSearchParams(window.location.search);
    const data = {
        id: params.get("id"),
        title: sdGetValue("sdInput-nameInput", true),
        author: sdGetValue("sdInput-authorInput", true),
        genres: sdGetValue("sdInput-genreInput", true),
        tags: sdGetValue("sdInput-tagInput", true),
        notes: document.getElementById("notesInput").value,
    };
    if (img) {
        data.cover = img;
    }
    fetch(`${window.location.origin}/books/editBook`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.ok) {
            //TODO: update all fields to new inputs
            cancelEdit();
        } else {
            //TODO: handle error
        }
    });
}
