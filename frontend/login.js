const LOGIN_URL =
    "http://localhost:8080/users/login";

async function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    // Clear old message
    message.textContent = "";
    message.classList.remove("show");


    // ==============================
    // EMPTY FIELD VALIDATION
    // ==============================

    if (!username && !password) {

        message.textContent =
            "Please enter your username and password.";

        message.classList.add("show");

        return;
    }


    if (!username) {

        message.textContent =
            "Please enter your username.";

        message.classList.add("show");

        return;
    }


    if (!password) {

        message.textContent =
            "Please enter your password.";

        message.classList.add("show");

        return;
    }


    // ==============================
    // LOGIN REQUEST
    // ==============================

    try {

        const response = await fetch(LOGIN_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })

        });


        // Read backend response

        let data = {};

        try {

            data = await response.json();

        }
        catch {

            data = {};

        }


        console.log(
            "Login status:",
            response.status
        );

        console.log(
            "Login response:",
            data
        );


        // ==============================
        // LOGIN FAILED
        // ==============================

        if (!response.ok) {

            message.textContent =
                data.message ||
                "Invalid username or password.";

            message.classList.add("show");

            return;
        }


        // ==============================
        // LOGIN SUCCESSFUL
        // ==============================

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        localStorage.setItem(
            "username",
            username
        );


        // ==============================
        // ROLE REDIRECTION
        // ==============================

        if (data.role === "ADMIN") {

            window.location.href =
                "dashboard.html";

        }
        else if (data.role === "STUDENT") {

            window.location.href =
                "student-dashboard.html";

        }
        else if (data.role === "FACULTY") {

            window.location.href =
                "faculty-dashboard.html";

        }
        else {

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");

            message.textContent =
                "Unknown user role.";

            message.classList.add("show");
        }

    }
    catch (error) {

        console.error(
            "Login failed:",
            error
        );

        message.textContent =
            "Unable to connect to the server. Please try again.";

        message.classList.add("show");
    }
}