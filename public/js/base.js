document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#coverInput").addEventListener("change", () => {
        readFile(false);
    });

    document.querySelectorAll(".delete").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            let bookId = deleteBtn.dataset.id;
            let bookTitle = deleteBtn.dataset.title;
            if (confirm(`Are you sure you want to delete '${bookTitle}'? This can't be undone!`) === true) {
                fetch(`${window.location.origin}/books/deleteBook`, {
                    method: "POST",
                    body: JSON.stringify({
                        id: bookId,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((response) => {
                    if (response.ok) {
                        deleteBtn.closest("tr").remove();
                        //TODO: success toast
                    } else {
                        //TODO: error toast
                    }
                });
            }
        });
    });
});

function readFile(send, sendFunc) {
    let input = document.querySelector("#coverInput");
    if (!input.files || !input.files[0]) return;

    const FR = new FileReader();

    FR.addEventListener("load", (evt) => {
        let coverImg = document.getElementById("cover");
        coverImg.src = evt.target.result;
        coverImg.classList.remove("hide");
        console.log(evt.target.result);
        img64 = evt.target.result;
        if (send) {
            sendFunc(evt.target.result);
        }
    });

    FR.addEventListener("error", (err) => {
        console.error(err);
        //TODO: handle error
    });

    FR.readAsDataURL(input.files[0]);
}

function logout() {
    fetch(`${window.location.origin}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.ok) {
            window.location.reload();
        } else {
            //TODO: error toast
        }
    });
}
