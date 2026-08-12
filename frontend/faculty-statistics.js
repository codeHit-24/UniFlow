const COURSES_API =
    "http://localhost:8080/Courses/me";

const STUDENTS_API =
    "http://localhost:8080/enrollments/my-students";


const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


async function loadStatistics() {

    try {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };


        const coursesResponse =
            await fetch(COURSES_API, {
                headers: headers
            });


        const studentsResponse =
            await fetch(STUDENTS_API, {
                headers: headers
            });


        if (
            coursesResponse.status === 401 ||
            studentsResponse.status === 401
        ) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "login.html";

            return;

        }


        if (
            coursesResponse.status === 403 ||
            studentsResponse.status === 403
        ) {

            alert(
                "You do not have permission to view statistics."
            );

            return;

        }


        const courses =
            await coursesResponse.json();

        const enrollments =
            await studentsResponse.json();


        /*
         * Count unique students.
         *
         * A student may be enrolled in
         * more than one course.
         */

        const uniqueStudentIds =
            new Set(
                enrollments.map(
                    enrollment =>
                        enrollment.student.id
                )
            );


        document.getElementById(
            "courseCount"
        ).textContent = courses.length;


        document.getElementById(
            "studentCount"
        ).textContent = uniqueStudentIds.size;


        document.getElementById(
            "enrollmentCount"
        ).textContent = enrollments.length;

    }
    catch (error) {

        console.error(
            "Error loading statistics:",
            error
        );

    }

}


function goBack() {

    window.location.href =
        "faculty-dashboard.html";

}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


loadStatistics();