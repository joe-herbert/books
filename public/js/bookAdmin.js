document.addEventListener("DOMContentLoaded", () => {
    searchdown("nameInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "Title",
        inputName: "nameInput",
        initialValues: [book.name],
        simpleInput: true,
    });
    searchdown("authorInput", {
        values: authors,
        multiple: false,
        addValues: true,
        placeholder: "Author",
        inputName: "authorInput",
        initialValues: [book.author],
    });
    searchdown("genreInput", {
        values: genres,
        multiple: true,
        addValues: true,
        placeholder: "Genres",
        inputName: "genreInput",
        initialValues: book.genres,
    });
    searchdown("tagInput", {
        values: tags,
        multiple: true,
        addChoices: true,
        placeholder: "Tags",
        inputName: "tagInput",
        initialValues: book.tags,
    });
    searchdown("notesInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "Notes",
        inputName: "notesInput",
        initialValues: [book.notes],
        simpleInput: true,
        textarea: true,
    });
    searchdown("blurbInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "Blurb",
        inputName: "blurbInput",
        initialValues: [book.blurb],
        simpleInput: true,
        textarea: true,
    });
    searchdown("isbnInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "ISBN",
        inputName: "isbnInput",
        initialValues: [book.isbn],
        simpleInput: true,
    });
    searchdown("linkInput", {
        multiple: false,
        addValues: true,
        saveEntered: false,
        placeholder: "Link",
        inputName: "linkInput",
        initialValues: [book.link],
        simpleInput: true,
    });
});

function editBook() {
    document.querySelector("body").classList.add("edit");
    document.getElementById("notes").classList.remove("hide");
    document.getElementById("link").classList.remove("hide");
    document.getElementById("isbn").classList.remove("hide");
}

function cancelEdit() {
    document.querySelector("body").classList.remove("edit");
    if (document.getElementById("notesField").innerText === "") {
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
        blurb: sdGetValue("sdInput-blurbInput", true),
        isbn: sdGetValue("sdInput-isbnInput", true),
        link: sdGetValue("sdInput-linkInput", true),
        notes: sdGetValue("sdInput-notesInput", true),
    };
    if (img) {
        data.cover = img;
    } else {
        data.cover = document.getElementById("cover").getAttribute("src");
    }
    fetch(`${window.location.origin}/books/editBook`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                //TODO: handle error
            }
        })
        .then((response) => {
            response = JSON.parse(response);
            document.getElementById("nameField").innerText = data.title;
            let author = document.getElementById("authorField");
            author.innerText = data.author;
            author.href = `./?author=${response.author}`;
            let genre = document.getElementById("genreField");
            genre.innerHTML = "";
            data.genres.forEach((g) => {
                let a = document.createElement("a");
                a.href = `./?genre=${response.genres[g]}`;
                a.classList.add("genre", "bookField");
                a.innerText = g;
                genre.appendChild(a);
            });
            let tag = document.getElementById("tagField");
            tag.innerHTML = "";
            data.tags.forEach((t) => {
                let a = document.createElement("a");
                a.href = `./?tag=${response.tags[t]}`;
                a.classList.add("tag", "bookField");
                a.innerText = t;
                tag.appendChild(a);
            });
            document.getElementById("notesField").innerText = data.notes;
            document.getElementById("blurbField").innerText = data.blurb;
            document.getElementById("isbnField").innerText = data.isbn;
            let linkField = document.getElementById("linkField");
            linkField.href = data.link;
            linkField.innerText = data.link;
            document.getElementById("coverField").src = data.cover;
            cancelEdit();
        });
}

function removeImage() {
    document.getElementById("coverInput").value = "";
    document.getElementById("cover").src = "";
}
