const API_URL =
    "https://uniflow-backend-im5s.onrender.com/Courses";

let selectedCourseId = null;

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (!token || role !== "ADMIN") {

    window.location.href = "login.html";

}


/* =========================================================
   HEADERS
========================================================= */

function getHeaders() {

    const token =
        localStorage.getItem("token");

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


/* =========================================================
   LOAD COURSES
========================================================= */

async function loadCourses() {

    try {

        const response =
            await fetch(API_URL, {

                headers: getHeaders()

            });


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href =
                "login.html";

            return;

        }


        if (response.status === 403) {

            showMessage(
                "You do not have permission to manage courses."
            );

            return;

        }


        if (!response.ok) {

            showMessage(
                "Failed to load courses."
            );

            return;

        }


        const courses =
            await response.json();


        const table =
            document.getElementById(
                "courseTable"
            );


        table.innerHTML = "";


        if (courses.length === 0) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="text-align:center;"
                    >

                        No courses found.

                    </td>

                </tr>

            `;

            return;

        }


        courses.forEach(course => {

            const row = `

                <tr>

                    <td>
                        ${course.id}
                    </td>

                    <td>
                        ${course.courseName}
                    </td>

                    <td>
                        ${course.courseCode}
                    </td>

                    <td>
                        ${course.credits}
                    </td>

                    <td>
                        ${course.department}
                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                onclick="editCourse(${course.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteCourse(${course.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;


            table.innerHTML += row;

        });

    }
    catch (error) {

        console.error(
            "Error loading courses:",
            error
        );

        showMessage(
            "Server error. Please try again."
        );

    }

}


/* =========================================================
   SAVE COURSE
========================================================= */

function saveCourse() {

    if (selectedCourseId === null) {

        addCourse();

    }
    else {

        updateCourse();

    }

}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearCourseForm() {

    document.getElementById(
        "courseName"
    ).value = "";


    document.getElementById(
        "courseCode"
    ).value = "";


    document.getElementById(
        "credits"
    ).value = "";


    document.getElementById(
        "department"
    ).value = "";


    selectedCourseId = null;


    const button =
        document.querySelector(
            ".course-form button"
        );


    if (button) {

        button.textContent =
            "Add Course";

    }

}


/* =========================================================
   ADD COURSE
========================================================= */

async function addCourse() {

    const course = {

        courseName:
            document.getElementById(
                "courseName"
            ).value.trim(),

        courseCode:
            document.getElementById(
                "courseCode"
            ).value.trim(),

        credits:
            Number(
                document.getElementById(
                    "credits"
                ).value
            ),

        department:
            document.getElementById(
                "department"
            ).value.trim()

    };


    if (
        !course.courseName ||
        !course.courseCode ||
        !course.credits ||
        !course.department
    ) {

        showMessage(
            "Please fill in all course fields."
        );

        return;

    }


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: getHeaders(),

                body:
                    JSON.stringify(course)

            });


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href =
                "login.html";

            return;

        }


        if (response.ok) {

            showMessage(
                "Course added successfully."
            );

            clearCourseForm();

            loadCourses();

        }
        else {

            showMessage(
                "Failed to add course."
            );

        }

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Server error. Please try again."
        );

    }

}


/* =========================================================
   EDIT COURSE
========================================================= */

async function editCourse(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    headers: getHeaders()
                }
            );


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href =
                "login.html";

            return;

        }


        if (!response.ok) {

            showMessage(
                "Unable to load course."
            );

            return;

        }


        const course =
            await response.json();


        selectedCourseId =
            course.id;


        document.getElementById(
            "courseName"
        ).value =
            course.courseName;


        document.getElementById(
            "courseCode"
        ).value =
            course.courseCode;


        document.getElementById(
            "credits"
        ).value =
            course.credits;


        document.getElementById(
            "department"
        ).value =
            course.department;


        const button =
            document.querySelector(
                ".course-form button"
            );


        if (button) {

            button.textContent =
                "Update Course";

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Server error. Please try again."
        );

    }

}


/* =========================================================
   UPDATE COURSE
========================================================= */

async function updateCourse() {

    const course = {

        courseName:
            document.getElementById(
                "courseName"
            ).value.trim(),

        courseCode:
            document.getElementById(
                "courseCode"
            ).value.trim(),

        credits:
            Number(
                document.getElementById(
                    "credits"
                ).value
            ),

        department:
            document.getElementById(
                "department"
            ).value.trim()

    };


    if (
        !course.courseName ||
        !course.courseCode ||
        !course.credits ||
        !course.department
    ) {

        showMessage(
            "Please fill in all course fields."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${selectedCourseId}`,
                {

                    method: "PUT",

                    headers: getHeaders(),

                    body:
                        JSON.stringify(course)

                }
            );


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href =
                "login.html";

            return;

        }


        if (response.ok) {

            showMessage(
                "Course updated successfully."
            );

            clearCourseForm();

            loadCourses();

        }
        else {

            showMessage(
                "Failed to update course."
            );

        }

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Server error. Please try again."
        );

    }

}


/* =========================================================
   DELETE COURSE
========================================================= */

async function deleteCourse(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this course?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    headers: getHeaders()

                }
            );


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href =
                "login.html";

            return;

        }


        if (response.ok) {

            showMessage(
                "Course deleted successfully."
            );

            loadCourses();

        }
        else {

            showMessage(
                "Failed to delete course."
            );

        }

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Server error. Please try again."
        );

    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message) {

    const box =
        document.getElementById(
            "message"
        );


    if (!box) {
        return;
    }


    box.textContent =
        message;


    box.style.opacity =
        "1";


    setTimeout(() => {

        box.style.opacity =
            "0";

    }, 3000);

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadCourses();