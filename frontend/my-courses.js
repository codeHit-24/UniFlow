/* =========================================================
   STUDENT MY COURSES
   ========================================================= */

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


/* =========================================================
   AUTHENTICATION
   ========================================================= */

if (!token || role !== "STUDENT") {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href = "login.html";

}


/* =========================================================
   API
   ========================================================= */

const COURSES_API =
    "http://localhost:8080/enrollments/me";


/* =========================================================
   LOAD STUDENT NAME
   ========================================================= */

function loadStudentName() {

    const element =
        document.getElementById("studentName");

    if (!element) {
        return;
    }

    const username =
        localStorage.getItem("username");

    element.textContent =
        username || "Student";

}


/* =========================================================
   LOAD MY COURSES
   ========================================================= */

async function loadCourses() {

    const container =
        document.getElementById("courseContainer");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                COURSES_API,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        /* =================================================
           UNAUTHORIZED
           ================================================= */

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");

            window.location.href =
                "login.html";

            return;
        }


        /* =================================================
           FORBIDDEN
           ================================================= */

        if (response.status === 403) {

            container.innerHTML = `
                <div class="empty-message">

                    <h3>
                        Access denied
                    </h3>

                    <p>
                        You do not have permission
                        to view your courses.
                    </p>

                </div>
            `;

            return;
        }


        /* =================================================
           OTHER ERROR
           ================================================= */

        if (!response.ok) {

            throw new Error(
                `Failed to load courses (${response.status})`
            );

        }


        /* =================================================
           RESPONSE
           ================================================= */

        const enrollments =
            await response.json();

        console.log(
            "Student enrollments:",
            enrollments
        );


        /* =================================================
           NO COURSES
           ================================================= */

        if (
            !Array.isArray(enrollments) ||
            enrollments.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-message">

                    <h3>
                        No courses yet
                    </h3>

                    <p>
                        You are not currently enrolled
                        in any courses.
                    </p>

                </div>
            `;

            return;
        }


        /* =================================================
           DISPLAY COURSES
           ================================================= */

        container.innerHTML = "";


        enrollments.forEach(enrollment => {

            /*
             * We don't yet assume the exact shape
             * of your Enrollment JSON.
             *
             * These checks allow the page to work
             * with either nested course data or
             * direct enrollment fields.
             */

            const course =
                enrollment.course || {};


            const courseName =
                course.courseName ||
                course.name ||
                enrollment.courseName ||
                "Course";


            const courseCode =
                course.courseCode ||
                enrollment.courseCode ||
                "—";


            const credits =
                course.credits ??
                enrollment.credits ??
                "—";


            const department =
                course.department ||
                enrollment.department ||
                "—";


            const enrollmentDate =
                enrollment.enrollmentDate ||
                enrollment.date ||
                "—";


            const card =
                document.createElement("div");

            card.className =
                "course-card";


            card.innerHTML = `

                <h2>
                    ${courseName}
                </h2>

                <p>
                    <strong>
                        Course Code:
                    </strong>
                    ${courseCode}
                </p>

                <p>
                    <strong>
                        Credits:
                    </strong>
                    ${credits}
                </p>

                <p>
                    <strong>
                        Department:
                    </strong>
                    ${department}
                </p>

                <p>
                    <strong>
                        Enrollment Date:
                    </strong>
                    ${enrollmentDate}
                </p>

            `;


            container.appendChild(card);

        });

    }
    catch (error) {

        console.error(
            "Student courses error:",
            error
        );


        container.innerHTML = `
            <div class="error-message">

                Unable to load your courses.
                Please try again later.

            </div>
        `;

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href =
        "login.html";

}


/* =========================================================
   INITIALIZE
   ========================================================= */

loadStudentName();

loadCourses();