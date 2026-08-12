const BASE_URL = "http://localhost:8080";

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

function getHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}

loadStats();

async function loadStats() {

    try {

        const students = await fetch(BASE_URL + "/Students", {

            headers: getHeaders()

        });

        if (!students.ok) {

            console.log("Students:", students.status);

            return;

        }

        const studentData = await students.json();

        document.getElementById("studentCount").innerHTML =
            studentData.length;


        const courses = await fetch(BASE_URL + "/Courses", {

            headers: getHeaders()

        });

        if (!courses.ok) {

            console.log("Courses:", courses.status);

            return;

        }

        const courseData = await courses.json();

        document.getElementById("courseCount").innerHTML =
            courseData.length;


        const enrollments = await fetch(BASE_URL + "/enrollments", {

            headers: getHeaders()

        });

        if (!enrollments.ok) {

            console.log("Enrollments:", enrollments.status);

            return;

        }

        const enrollmentData = await enrollments.json();

        document.getElementById("enrollmentCount").innerHTML =
            enrollmentData.length;

    }
    catch (error) {

        console.log(error);

    }

}