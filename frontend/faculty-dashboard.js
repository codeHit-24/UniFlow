const COURSES_API =
    "https://uniflow-backend-im5s.onrender.com/Courses/me";

const STUDENT_COUNT_API =
    "https://uniflow-backend-im5s.onrender.com/enrollments/faculty/student-count";


/* =====================================================
   AUTHENTICATION
   ===================================================== */

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "FACULTY") {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "login.html";

}


/* =====================================================
   NAVIGATION
   ===================================================== */

function goToCourses() {

    window.location.href =
        "faculty-courses.html";

}


function goToStudents() {

    window.location.href =
        "faculty-students.html";

}


function goToStatistics() {

    window.location.href =
        "faculty-statistics.html";

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href =
        "login.html";

}


/* =====================================================
   FACULTY NAME
   ===================================================== */

function loadFacultyName() {

    const username =
        localStorage.getItem("username");

    const name =
        username || "Faculty";


    const facultyName =
        document.getElementById(
            "facultyName"
        );

    const headerFacultyName =
        document.getElementById(
            "headerFacultyName"
        );

    const welcomeFacultyName =
        document.getElementById(
            "welcomeFacultyName"
        );


    if (facultyName) {

        facultyName.textContent =
            name;

    }


    if (headerFacultyName) {

        headerFacultyName.textContent =
            name;

    }


    if (welcomeFacultyName) {

        welcomeFacultyName.textContent =
            name;

    }

}


/* =====================================================
   LOAD FACULTY COURSES
   ===================================================== */

async function loadDashboardData() {

    const courseCount =
        document.getElementById(
            "courseCount"
        );


    try {

        const response =
            await fetch(
                COURSES_API,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            logout();

            return;

        }


        if (response.status === 403) {

            console.error(
                "Faculty does not have permission to view courses."
            );

            if (courseCount) {

                courseCount.textContent =
                    "0";

            }

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load courses"
            );

        }


        const courses =
            await response.json();


        if (courseCount) {

            courseCount.textContent =
                courses.length;

        }


        console.log(
            "Faculty courses:",
            courses
        );

    }
    catch (error) {

        console.error(
            "Dashboard course error:",
            error
        );


        if (courseCount) {

            courseCount.textContent =
                "0";

        }

    }

}


/* =====================================================
   LOAD STUDENT COUNT
   ===================================================== */

async function loadStudentCount() {

    const countElement =
        document.getElementById(
            "studentCount"
        );


    try {

        const response =
            await fetch(
                STUDENT_COUNT_API,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            logout();

            return;

        }


        if (response.status === 403) {

            console.error(
                "Faculty does not have permission to view student count."
            );

            if (countElement) {

                countElement.textContent =
                    "0";

            }

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Student count request failed: ${response.status}`
            );

        }


        const count =
            await response.json();


        if (countElement) {

            countElement.textContent =
                count;

        }

    }
    catch (error) {

        console.error(
            "Error loading student count:",
            error
        );


        if (countElement) {

            countElement.textContent =
                "0";

        }

    }

}


/* =====================================================
   INITIALIZE DASHBOARD
   ===================================================== */

loadFacultyName();

loadDashboardData();

loadStudentCount();