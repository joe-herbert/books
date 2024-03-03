async function loginSubmit(form) {
    const data = {
        username: form.username.value,
        password: form.password.value,
    };
    fetch(`${window.location.origin}/books/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        if (response.ok) {
            if (document.referrer && !document.referrer.includes("login")) {
                window.location.href = document.referrer;
            } else {
                window.location.href = window.location.origin + "/books/";
            }
        } else {
            //TODO: handle error
        }
    });
}
