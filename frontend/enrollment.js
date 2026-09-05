const ENROLLMENT_API =
   "https://uniflow-backend-im5s.onrender.com/enrollments";

const STUDENT_API =
    "https://uniflow-backend-im5s.onrender.com/Students";

const COURSE_API =
    "https://uniflow-backend-im5s.onrender.com/Courses";


const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


/* =========================================================
   AUTHENTICATION
========================================================= */

if (!token || role !== "ADMIN") {

    window.location.href = "login.html";

}


/* =========================================================
   HEADERS
========================================================= */

function getHeaders() {

    const currentToken =
        localStorage.getItem("token");

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${currentToken}`

    };

}


/* =========================================================
   HANDLE AUTH ERRORS
========================================================= */

function handleAuthError(response) {

    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "login.html";

        return true;
    }


    if (response.status === 403) {

        showMessage(
            "You do not have permission to perform this action.",
            "#dc3545"
        );

        return true;
    }


    return false;

}


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

    try {

        const response =
            await fetch(
                STUDENT_API,
                {
                    headers: getHeaders()
                }
            );


        if (handleAuthError(response)) {
            return;
        }


        if (!response.ok) {

            showMessage(
                "Failed to load students.",
                "#dc3545"
            );

            return;
        }


        const students =
            await response.json();


        const dropdown =
            document.getElementById(
                "studentSelect"
            );


        dropdown.innerHTML =
            `<option value="">
                Select Student
            </option>`;


        students.forEach(student => {

            dropdown.innerHTML += `

                <option value="${student.id}">
                    ${student.firstName}
                    ${student.lastName}
                    -
                    ${student.email}
                </option>

            `;

        });

    }
    catch (error) {

        console.error(
            "Error loading students:",
            error
        );

        showMessage(
            "Unable to load students.",
            "#dc3545"
        );

    }

}


/* =========================================================
   LOAD COURSES
========================================================= */

async function loadCourses() {

    try {

        const response =
            await fetch(
                COURSE_API,
                {
                    headers: getHeaders()
                }
            );


        if (handleAuthError(response)) {
            return;
        }


        if (!response.ok) {

            showMessage(
                "Failed to load courses.",
                "#dc3545"
            );

            return;
        }


        const courses =
            await response.json();


        const dropdown =
            document.getElementById(
                "courseSelect"
            );


        dropdown.innerHTML =
            `<option value="">
                Select Course
            </option>`;


        courses.forEach(course => {

            dropdown.innerHTML += `

                <option value="${course.id}">
                    ${course.courseName}
                    -
                    ${course.courseCode}
                </option>

            `;

        });

    }
    catch (error) {

        console.error(
            "Error loading courses:",
            error
        );

        showMessage(
            "Unable to load courses.",
            "#dc3545"
        );

    }

}


/* =========================================================
   ADD ENROLLMENT
========================================================= */

async function addEnrollment() {

    const studentId =
        document.getElementById(
            "studentSelect"
        ).value;


    const courseId =
        document.getElementById(
            "courseSelect"
        ).value;


    const enrollmentDate =
        document.getElementById(
            "enrollmentDate"
        ).value;


    /* Validation */

    if (!studentId) {

        showMessage(
            "Please select a student.",
            "#dc3545"
        );

        return;
    }


    if (!courseId) {

        showMessage(
            "Please select a course.",
            "#dc3545"
        );

        return;
    }


    if (!enrollmentDate) {

        showMessage(
            "Please select an enrollment date.",
            "#dc3545"
        );

        return;
    }


    const enrollment = {

        studentId:
            Number(studentId),

        courseId:
            Number(courseId),

        enrollmentDate:
            enrollmentDate

    };


    try {

        const response =
            await fetch(
                ENROLLMENT_API,
                {

                    method: "POST",

                    headers:
                        getHeaders(),

                    body:
                        JSON.stringify(
                            enrollment
                        )

                }
            );


        if (handleAuthError(response)) {
            return;
        }


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Enrollment error:",
                errorText
            );

            showMessage(
                "Failed to enroll student.",
                "#dc3545"
            );

            return;
        }


        showMessage(
            "Student enrolled successfully.",
            "#16a34a"
        );


        clearEnrollmentForm();


        await loadEnrollments();

    }
    catch (error) {

        console.error(
            "Error adding enrollment:",
            error
        );

        showMessage(
            "Server error. Please try again.",
            "#dc3545"
        );

    }

}


/* =========================================================
   LOAD ENROLLMENTS
========================================================= */

async function loadEnrollments() {

    try {

        const response =
            await fetch(
                ENROLLMENT_API,
                {
                    headers:
                        getHeaders()
                }
            );


        if (handleAuthError(response)) {
            return;
        }


        if (!response.ok) {

            showMessage(
                "Failed to load enrollments.",
                "#dc3545"
            );

            return;
        }


        const enrollments =
            await response.json();


        const table =
            document.getElementById(
                "enrollmentTable"
            );


        table.innerHTML = "";


        if (enrollments.length === 0) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-table">
                        No enrollments found.
                    </td>

                </tr>

            `;

            return;
        }


        enrollments.forEach(
            enrollment => {

                const student =
                    enrollment.student;

                const course =
                    enrollment.course;


                table.innerHTML += `

                    <tr>

                        <td>
                            ${enrollment.id}
                        </td>

                        <td>

                            ${student.firstName}
                            ${student.lastName}

                        </td>

                        <td>

                            ${course.courseName}

                            <small class="course-code">
                                ${course.courseCode}
                            </small>

                        </td>

                        <td>
                            ${enrollment.enrollmentDate}
                        </td>

                        <td>

                            <div
                                class="action-buttons">

                                <button
                                    class="delete-btn"
                                    onclick="
                                        deleteEnrollment(
                                            ${enrollment.id}
                                        )
                                    ">

                                    Delete

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        );

    }
    catch (error) {

        console.error(
            "Error loading enrollments:",
            error
        );

        showMessage(
            "Unable to load enrollments.",
            "#dc3545"
        );

    }

}


/* =========================================================
   DELETE ENROLLMENT
========================================================= */

async function deleteEnrollment(id) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this enrollment?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${ENROLLMENT_API}/${id}`,
                {

                    method: "DELETE",

                    headers:
                        getHeaders()

                }
            );


        if (handleAuthError(response)) {
            return;
        }


        if (!response.ok) {

            showMessage(
                "Failed to remove enrollment.",
                "#dc3545"
            );

            return;
        }


        showMessage(
            "Enrollment removed successfully.",
            "#16a34a"
        );


        await loadEnrollments();

    }
    catch (error) {

        console.error(
            "Error deleting enrollment:",
            error
        );

        showMessage(
            "Server error. Please try again.",
            "#dc3545"
        );

    }

}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearEnrollmentForm() {

    document.getElementById(
        "studentSelect"
    ).selectedIndex = 0;


    document.getElementById(
        "courseSelect"
    ).selectedIndex = 0;


    document.getElementById(
        "enrollmentDate"
    ).value = "";

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    color = "#16a34a"
) {

    const box =
        document.getElementById(
            "message"
        );


    box.innerHTML =
        message;


    box.style.background =
        color;


    box.style.opacity =
        "1";


    setTimeout(() => {

        box.style.opacity =
            "0";

    }, 3000);

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadStudents();
loadCourses();
loadEnrollments();