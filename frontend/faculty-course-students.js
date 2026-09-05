const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


// --------------------------------------------------
// STORE LOADED ENROLLMENTS
// --------------------------------------------------

let allEnrollments = [];


// --------------------------------------------------
// FACULTY AUTHENTICATION
// --------------------------------------------------

if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


// --------------------------------------------------
// GET COURSE ID FROM URL
// Example:
// faculty-course-students.html?courseId=5
// --------------------------------------------------

const params = new URLSearchParams(
    window.location.search
);

const courseId = params.get("courseId");


// --------------------------------------------------
// CHECK COURSE ID
// --------------------------------------------------

if (!courseId) {

    document.getElementById(
        "courseTitle"
    ).textContent = "Course Students";

    document.getElementById(
        "studentContainer"
    ).innerHTML = `

        <div class="empty-message">

            <h3>Course ID is missing</h3>

            <p>
                A valid course was not selected.
                Please return to My Courses and select a course.
            </p>

        </div>

    `;

} else {

    loadStudents();

}


// --------------------------------------------------
// LOAD STUDENTS
// --------------------------------------------------

async function loadStudents() {

    const container =
        document.getElementById(
            "studentContainer"
        );

    try {

        container.innerHTML = `

            <div class="loading-card">

                <p>
                    Loading students...
                </p>

            </div>

        `;


        const response = await fetch(

            `https://uniflow-backend-im5s.onrender.com/enrollments/course/${courseId}`,

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
            localStorage.removeItem("username");

            window.location.href =
                "login.html";

            return;

        }


        // ------------------------------------------
        // FORBIDDEN
        // ------------------------------------------

        if (response.status === 403) {

            container.innerHTML = `

                <div class="empty-message">

                    <h3>
                        Access Denied
                    </h3>

                    <p>
                        You are not assigned to this course.
                    </p>

                </div>

            `;

            return;

        }


        // ------------------------------------------
        // COURSE NOT FOUND
        // ------------------------------------------

        if (response.status === 404) {

            container.innerHTML = `

                <div class="empty-message">

                    <h3>
                        Course Not Found
                    </h3>

                    <p>
                        The selected course could not be found.
                    </p>

                </div>

            `;

            return;

        }


        // ------------------------------------------
        // OTHER SERVER ERROR
        // ------------------------------------------

        if (!response.ok) {

            throw new Error(
                `Failed to load students. Status: ${response.status}`
            );

        }


        // ------------------------------------------
        // READ RESPONSE
        // ------------------------------------------

        const enrollments =
            await response.json();


        console.log(
            "Course student enrollments:",
            enrollments
        );


        // ------------------------------------------
        // NO STUDENTS
        // ------------------------------------------

        if (
            !Array.isArray(enrollments) ||
            enrollments.length === 0
        ) {

            document.getElementById(
                "courseTitle"
            ).textContent = "Course Students";


            container.innerHTML = `

                <div class="empty-message">

                    <h3>
                        No Students Enrolled
                    </h3>

                    <p>
                        There are currently no students
                        enrolled in this course.
                    </p>

                </div>

            `;

            return;

        }


        // ------------------------------------------
        // SAVE ENROLLMENTS
        // ------------------------------------------

        allEnrollments = enrollments;


        // ------------------------------------------
        // COURSE INFORMATION
        // ------------------------------------------

        const course =
            enrollments[0].course;


        if (course) {

            document.getElementById(
                "courseTitle"
            ).textContent =
                `${course.courseName} - Students`;

        }


        // ------------------------------------------
        // DISPLAY STUDENTS
        // ------------------------------------------

        renderStudents(allEnrollments);


    }
    catch (error) {

        console.error(
            "Error loading course students:",
            error
        );


        container.innerHTML = `

            <div class="empty-message">

                <h3>
                    Unable to Load Students
                </h3>

                <p>
                    There was a problem loading the
                    students for this course.
                    Please try again.
                </p>

                <button
                    type="button"
                    onclick="loadStudents()"
                    style="width:auto; margin-top:15px;"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// --------------------------------------------------
// RENDER STUDENTS
// --------------------------------------------------

function renderStudents(enrollments) {

    const container =
        document.getElementById(
            "studentContainer"
        );


    // ------------------------------------------
    // NO SEARCH RESULTS
    // ------------------------------------------

    if (!enrollments ||
        enrollments.length === 0) {

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


    // ------------------------------------------
    // CLEAR CONTAINER
    // ------------------------------------------

    container.innerHTML = "";


    // ------------------------------------------
    // DISPLAY STUDENTS
    // ------------------------------------------

    enrollments.forEach(enrollment => {

        const student =
            enrollment.student;


        if (!student) {
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


                <!-- Enrollment -->

                <div class="student-course">

                    <span class="detail-label">
                        Enrollment Date
                    </span>

                    <strong>
                        ${enrollment.enrollmentDate || "N/A"}
                    </strong>

                </div>


            </article>

        `;

    });

}


// --------------------------------------------------
// SEARCH STUDENTS
// --------------------------------------------------

function filterStudents() {

    const searchInput =
        document.getElementById(
            "studentSearch"
        );


    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    // ------------------------------------------
    // SHOW ALL STUDENTS
    // ------------------------------------------

    if (!searchTerm) {

        renderStudents(
            allEnrollments
        );

        return;

    }


    // ------------------------------------------
    // FILTER
    // ------------------------------------------

    const filteredEnrollments =
        allEnrollments.filter(
            enrollment => {

                const student =
                    enrollment.student;


                if (!student) {
                    return false;
                }


                const fullName =
                    `${student.firstName || ""}
                     ${student.lastName || ""}`
                    .toLowerCase();


                const email =
                    (student.email || "")
                    .toLowerCase();


                const department =
                    (student.department || "")
                    .toLowerCase();


                const semester =
                    String(
                        student.semester || ""
                    ).toLowerCase();


                return (
                    fullName.includes(searchTerm) ||
                    email.includes(searchTerm) ||
                    department.includes(searchTerm) ||
                    semester.includes(searchTerm)
                );

            }
        );


    // ------------------------------------------
    // DISPLAY RESULTS
    // ------------------------------------------

    renderStudents(
        filteredEnrollments
    );

}


// --------------------------------------------------
// SEARCH EVENT
// --------------------------------------------------

const searchInput =
    document.getElementById(
        "studentSearch"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterStudents
    );

}


// --------------------------------------------------
// BACK TO FACULTY COURSES
// --------------------------------------------------

function goBack() {

    window.location.href =
        "faculty-courses.html";

}


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href =
        "login.html";

}