async function loginSubmit(form) {
    const data = {
        username: form.username.value,
        password: form.password.value,
    };
    fetch(`${window.location.origin}/book/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.text())
        .then((response) => {
            console.log(response);
        });
}
