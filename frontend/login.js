const LOGIN_URL = "http://localhost:8080/users/login";

function login() {

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value.trim();

    fetch(LOGIN_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })

    })

    .then(response => {

        if (!response.ok) {

            throw new Error("Invalid username or password");

        }

        return response.json();

    })

    .then(data => {

        localStorage.setItem("token", data.token);

        window.location.href = "index.html";

    })

    .catch(error => {

        document.getElementById("message").innerHTML = error.message;

    });

}