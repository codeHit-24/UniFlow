const BASE_URL = "http://localhost:8080";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


// Protect admin dashboard

if (!token || role !== "ADMIN") {

    window.location.href = "login.html";

}


// Common headers

function getHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}


// Load dashboard statistics

async function loadStats() {

    try {

        const studentsResponse =
            await fetch(
                BASE_URL + "/Students",
                {
                    headers: getHeaders()
                }
            );


        if (studentsResponse.status === 401) {

            logout();

            return;

        }


        if (!studentsResponse.ok) {

            console.error(
                "Students:",
                studentsResponse.status
            );

            return;

        }


        const studentData =
            await studentsResponse.json();


        document.getElementById(
            "studentCount"
        ).textContent = studentData.length;


        const coursesResponse =
            await fetch(
                BASE_URL + "/Courses",
                {
                    headers: getHeaders()
                }
            );


        if (coursesResponse.status === 401) {

            logout();

            return;

        }


        if (!coursesResponse.ok) {

            console.error(
                "Courses:",
                coursesResponse.status
            );

            return;

        }


        const courseData =
            await coursesResponse.json();


        document.getElementById(
            "courseCount"
        ).textContent = courseData.length;


        const enrollmentsResponse =
            await fetch(
                BASE_URL + "/enrollments",
                {
                    headers: getHeaders()
                }
            );


        if (enrollmentsResponse.status === 401) {

            logout();

            return;

        }


        if (!enrollmentsResponse.ok) {

            console.error(
                "Enrollments:",
                enrollmentsResponse.status
            );

            return;

        }


        const enrollmentData =
            await enrollmentsResponse.json();


        document.getElementById(
            "enrollmentCount"
        ).textContent =
            enrollmentData.length;

    }
    catch (error) {

        console.error(
            "Error loading dashboard statistics:",
            error
        );

    }

}


// Logout

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    window.location.href = "login.html";

}


// Start

loadStats();