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
        localStorage.setItem("role", data.role);

        if (data.role === "ADMIN") {

            window.location.href = "index.html";

        }
        else if (data.role === "STUDENT") {

            window.location.href = "student-dashboard.html";

        }
        else if (data.role === "FACULTY") {

            window.location.href = "faculty-dashboard.html";

        }
        else {

            document.getElementById("message").innerHTML =
                "Unknown user role";

        }

    })

    .catch(error => {

        document.getElementById("message").innerHTML = error.message;

    });

}