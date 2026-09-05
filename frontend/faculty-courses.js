const COURSES_API =
    "http://localhost:8080/Courses/me";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


// --------------------------------------------------
// FACULTY AUTHENTICATION
// --------------------------------------------------

if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


// --------------------------------------------------
// LOAD FACULTY COURSES
// --------------------------------------------------

async function loadMyCourses() {

    const container =
        document.getElementById("courseContainer");

    try {

        const response = await fetch(
            COURSES_API,
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        // ------------------------------------------
        // UNAUTHORIZED
        // ------------------------------------------

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "login.html";

            return;

        }


        // ------------------------------------------
        // FORBIDDEN
        // ------------------------------------------

        if (response.status === 403) {

            container.innerHTML = `

                <div class="empty-message">

                    <h3>Access denied</h3>

                    <p>
                        You do not have permission to view
                        your assigned courses.
                    </p>

                </div>

            `;

            return;

        }


        // ------------------------------------------
        // OTHER SERVER ERRORS
        // ------------------------------------------

        if (!response.ok) {

            container.innerHTML = `

                <div class="empty-message">

                    <h3>Unable to load courses</h3>

                    <p>
                        Failed to load your courses.
                        Please try again later.
                    </p>

                </div>

            `;

            return;

        }


        const courses =
            await response.json();


        // ------------------------------------------
        // NO COURSES
        // ------------------------------------------

        if (!Array.isArray(courses) ||
            courses.length === 0) {

            container.innerHTML = `

                <div class="empty-message">

                    <h3>No courses assigned</h3>

                    <p>
                        You currently have no courses
                        assigned to you.
                    </p>

                </div>

            `;

            return;

        }


        // ------------------------------------------
        // DISPLAY COURSES
        // ------------------------------------------

        container.innerHTML = "";


        courses.forEach(course => {

            container.innerHTML += `

                <div class="course-card">

                    <h2>
                        ${course.courseName}
                    </h2>

                    <p>
                        <strong>Course Code:</strong>
                        ${course.courseCode}
                    </p>

                    <p>
                        <strong>Credits:</strong>
                        ${course.credits}
                    </p>

                    <p>
                        <strong>Department:</strong>
                        ${course.department}
                    </p>

                    <button
                        type="button"
                        onclick="viewStudents(${course.id})">
                        View Students
                    </button>

                </div>

            `;

        });


    }
    catch (error) {

        console.error(
            "Error loading faculty courses:",
            error
        );


        container.innerHTML = `

            <div class="empty-message">

                <h3>Server error</h3>

                <p>
                    Unable to connect to the server.
                    Please try again.
                </p>

            </div>

        `;

    }

}


// --------------------------------------------------
// VIEW COURSE STUDENTS
// --------------------------------------------------

function viewStudents(courseId) {

    if (!courseId) {

        return;

    }

    window.location.href =
        `faculty-course-students.html?courseId=${courseId}`;

}


// --------------------------------------------------
// BACK TO FACULTY DASHBOARD
// --------------------------------------------------

function goBack() {

    window.location.href =
        "faculty-dashboard.html";

}


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


// --------------------------------------------------
// INITIALIZE
// --------------------------------------------------

loadMyCourses();