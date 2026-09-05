const API_URL =
    "http://localhost:8080/Students/me";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (!token || role !== "STUDENT") {

    window.location.href = "login.html";

}


async function loadProfile() {

    try {

        const response = await fetch(API_URL, {

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "login.html";

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load profile"
            );

        }


        const student = await response.json();


        /*
         * Profile information
         */

        document.getElementById(
            "firstName"
        ).textContent =
            student.firstName;


        document.getElementById(
            "lastName"
        ).textContent =
            student.lastName;


        document.getElementById(
            "email"
        ).textContent =
            student.email;


        document.getElementById(
            "department"
        ).textContent =
            student.department;


        document.getElementById(
            "semester"
        ).textContent =
            student.semester;


        /*
         * Student name in the dashboard top bar
         */

        const profileName =
            document.getElementById("profileName");


        if (profileName) {

            profileName.textContent =
                `${student.firstName} ${student.lastName}`;

        }

    }
    catch (error) {

        console.error(
            "Error loading profile:",
            error
        );


        document.getElementById(
            "firstName"
        ).textContent = "Unable to load";


        document.getElementById(
            "lastName"
        ).textContent = "Unable to load";


        document.getElementById(
            "email"
        ).textContent = "Unable to load";


        document.getElementById(
            "department"
        ).textContent = "Unable to load";


        document.getElementById(
            "semester"
        ).textContent = "Unable to load";

    }

}


function goBack() {

    window.location.href =
        "student-dashboard.html";

}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


loadProfile();