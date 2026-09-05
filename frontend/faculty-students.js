const STUDENTS_API =
    "https://uniflow-backend-im5s.onrender.com/enrollments/my-students";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

let allEnrollments = [];


// =========================================================
// PAGE PROTECTION
// =========================================================

if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


// =========================================================
// LOAD MY STUDENTS
// =========================================================

async function loadMyStudents() {

    const container =
        document.getElementById("studentContainer");

    if (!container) {
        console.error("studentContainer not found.");
        return;
    }


    container.innerHTML = `
        <div class="loading-card">
            <p>Loading students...</p>
        </div>
    `;


    try {

        const response = await fetch(
            STUDENTS_API,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        // =================================================
        // UNAUTHORIZED
        // =================================================

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");

            window.location.href = "login.html";

            return;
        }


        // =================================================
        // FORBIDDEN
        // =================================================

        if (response.status === 403) {

            container.innerHTML = `
                <div class="empty-message">

                    <h3>Access Denied</h3>

                    <p>
                        You do not have permission
                        to view these students.
                    </p>

                </div>
            `;

            return;
        }


        // =================================================
        // SERVER ERROR
        // =================================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // =================================================
        // READ RESPONSE
        // =================================================

        const enrollments =
            await response.json();


        console.log(
            "My student enrollments:",
            enrollments
        );


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (
            !Array.isArray(enrollments) ||
            enrollments.length === 0
        ) {

            allEnrollments = [];

            container.innerHTML = `
                <div class="empty-message">

                    <h3>No Students Found</h3>

                    <p>
                        No students are currently
                        enrolled in your courses.
                    </p>

                </div>
            `;

            return;
        }


        // Store all data for searching
        allEnrollments = enrollments;


        // Display students
        displayStudents(allEnrollments);


    }
    catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        container.innerHTML = `
            <div class="empty-message">

                <h3>
                    Unable to Load Students
                </h3>

                <p>
                    Something went wrong while
                    retrieving the student data.
                    Please try again.
                </p>

                <button
                    type="button"
                    onclick="loadMyStudents()"
                    style="width:auto; margin-top:15px;"
                >
                    Try Again
                </button>

            </div>
        `;

    }

}


// =========================================================
// DISPLAY STUDENTS
// =========================================================

function displayStudents(enrollments) {

    const container =
        document.getElementById("studentContainer");


    if (!container) {
        return;
    }


    // No search results
    if (!enrollments || enrollments.length === 0) {

        container.innerHTML = `
            <div class="empty-message">

                <h3>
                    No Students Found
                </h3>

                <p>
                    No students match your search.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML = "";


    enrollments.forEach(enrollment => {

        const student =
            enrollment.student;

        const course =
            enrollment.course;


        // Safety check
        if (!student || !course) {

            console.warn(
                "Invalid enrollment:",
                enrollment
            );

            return;
        }


        const firstName =
            student.firstName || "";

        const lastName =
            student.lastName || "";

        const fullName =
            `${firstName} ${lastName}`.trim();


        const avatarLetter =
            firstName
                ? firstName.charAt(0).toUpperCase()
                : "S";


        container.innerHTML += `

            <article class="student-card">

                <!-- Student Header -->

                <div class="student-card-header">

                    <div class="student-avatar">

                        ${avatarLetter}

                    </div>


                    <div>

                        <h2>
                            ${fullName || "Student"}
                        </h2>

                        <span class="student-email">
                            ${student.email || "No email available"}
                        </span>

                    </div>

                </div>


                <!-- Student Details -->

                <div class="student-details">

                    <div class="student-detail">

                        <span class="detail-label">
                            Department
                        </span>

                        <strong>
                            ${student.department || "N/A"}
                        </strong>

                    </div>


                    <div class="student-detail">

                        <span class="detail-label">
                            Semester
                        </span>

                        <strong>
                            ${student.semester || "N/A"}
                        </strong>

                    </div>

                </div>


                <!-- Course -->

                <div class="student-course">

                    <span class="detail-label">
                        Enrolled Course
                    </span>

                    <strong>
                        ${course.courseName || "Unknown Course"}
                    </strong>

                    <span class="course-code">
                        ${course.courseCode || "N/A"}
                    </span>

                </div>

            </article>

        `;

    });

}


// =========================================================
// SEARCH STUDENTS
// =========================================================

function searchStudents() {

    const searchInput =
        document.getElementById("studentSearch");


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    // Empty search = show everyone
    if (!searchText) {

        displayStudents(allEnrollments);

        return;
    }


    const filteredStudents =
        allEnrollments.filter(enrollment => {

            const student =
                enrollment.student || {};

            const course =
                enrollment.course || {};


            const firstName =
                student.firstName || "";

            const lastName =
                student.lastName || "";

            const email =
                student.email || "";

            const department =
                student.department || "";

            const semester =
                student.semester || "";

            const courseName =
                course.courseName || "";

            const courseCode =
                course.courseCode || "";


            const searchableText = `

                ${firstName}
                ${lastName}
                ${firstName} ${lastName}
                ${email}
                ${department}
                ${semester}
                ${courseName}
                ${courseCode}

            `.toLowerCase();


            return searchableText.includes(
                searchText
            );

        });


    displayStudents(filteredStudents);

}


// =========================================================
// BACK TO DASHBOARD
// =========================================================

function goBack() {

    window.location.href =
        "faculty-dashboard.html";

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href =
        "login.html";

}


// =========================================================
// START SEARCH
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const searchInput =
            document.getElementById("studentSearch");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchStudents
            );

        }


        loadMyStudents();

    }
);