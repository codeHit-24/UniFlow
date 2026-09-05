const COURSES_API =
    "https://uniflow-backend-im5s.onrender.com/Courses/me";

const STUDENTS_API =
    "https://uniflow-backend-im5s.onrender.com/enrollments/my-students";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


// Protect page
if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


// Load statistics
async function loadStatistics() {

    const courseCount =
        document.getElementById("courseCount");

    const studentCount =
        document.getElementById("studentCount");

    const enrollmentCount =
        document.getElementById("enrollmentCount");


    try {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };


        /*
         * Load faculty courses
         */
        const coursesResponse =
            await fetch(
                COURSES_API,
                {
                    method: "GET",
                    headers: headers
                }
            );


        /*
         * Load faculty students/enrollments
         */
        const studentsResponse =
            await fetch(
                STUDENTS_API,
                {
                    method: "GET",
                    headers: headers
                }
            );


        /*
         * Token expired
         */
        if (
            coursesResponse.status === 401 ||
            studentsResponse.status === 401
        ) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href =
                "login.html";

            return;

        }


        /*
         * Permission denied
         */
        if (
            coursesResponse.status === 403 ||
            studentsResponse.status === 403
        ) {

            document.getElementById(
                "message"
            ).innerHTML = `
                <div class="error-message">

                    You do not have permission
                    to view these statistics.

                </div>
            `;

            return;

        }


        /*
         * Other API errors
         */
        if (
            !coursesResponse.ok ||
            !studentsResponse.ok
        ) {

            throw new Error(
                "Failed to load statistics"
            );

        }


        const courses =
            await coursesResponse.json();

        const enrollments =
            await studentsResponse.json();


        /*
         * Count unique students.
         *
         * A student enrolled in multiple
         * courses should only be counted once.
         */
        const uniqueStudentIds =
            new Set(
                enrollments.map(
                    enrollment =>
                        enrollment.student.id
                )
            );


        /*
         * Update dashboard statistics
         */
        courseCount.textContent =
            courses.length;

        studentCount.textContent =
            uniqueStudentIds.size;

        enrollmentCount.textContent =
            enrollments.length;


    }
    catch (error) {

        console.error(
            "Error loading statistics:",
            error
        );


        document.getElementById(
            "message"
        ).innerHTML = `
            <div class="error-message">

                Unable to load statistics.
                Please try again later.

            </div>
        `;

    }

}


// Back to dashboard
function goBack() {

    window.location.href =
        "faculty-dashboard.html";

}


// Logout
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


// Load statistics
loadStatistics();