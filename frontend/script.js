const API_URL = "https://uniflow-backend-im5s.onrender.com/Students";

let selectedStudentId = null;
let students = [];

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


/* =========================================================
   AUTHORIZATION HEADERS
========================================================= */

function getHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

    try {

        const response = await fetch(API_URL, {
            headers: getHeaders()
        });


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;
        }


        if (response.status === 403) {

            showMessage(
                "You do not have permission to view students.",
                "#dc3545"
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );
        }


        const data = await response.json();

        students = data;

        displayStudents(data);

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
   ADD STUDENT
========================================================= */

async function addStudent() {

    const firstName =
        document.getElementById("firstName")
            .value.trim();

    const lastName =
        document.getElementById("lastName")
            .value.trim();

    const email =
        document.getElementById("email")
            .value.trim();

    const department =
        document.getElementById("department")
            .value.trim();

    const semester =
        document.getElementById("semester")
            .value.trim();


    /* Validation */

    if (
        !firstName ||
        !lastName ||
        !email ||
        !department ||
        !semester
    ) {

        showMessage(
            "Please fill all fields.",
            "#dc3545"
        );

        return;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showMessage(
            "Please enter a valid email address.",
            "#dc3545"
        );

        return;
    }


    if (
        Number(semester) < 1 ||
        Number(semester) > 8
    ) {

        showMessage(
            "Semester must be between 1 and 8.",
            "#dc3545"
        );

        return;
    }


    const student = {

        firstName,
        lastName,
        email,
        department,
        semester

    };


    const saveBtn =
        document.getElementById("saveBtn");


    saveBtn.disabled = true;

    saveBtn.textContent = "Saving...";


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(student)
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;
        }


        if (response.status === 403) {

            showMessage(
                "You do not have permission to add students.",
                "#dc3545"
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to add student"
            );
        }


        showMessage(
            "Student added successfully."
        );


        clearForm();

        await loadStudents();

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Failed to add student.",
            "#dc3545"
        );

    }
    finally {

        saveBtn.disabled = false;

        saveBtn.textContent =
            "Save Student";
    }
}


/* =========================================================
   SAVE STUDENT
========================================================= */

function saveStudent() {

    if (selectedStudentId === null) {

        addStudent();

    }
    else {

        updateStudent();

    }
}


/* =========================================================
   EDIT STUDENT
========================================================= */

async function editStudent(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                headers: getHeaders()
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load student"
            );
        }


        const student =
            await response.json();


        selectedStudentId =
            student.id;


        document.getElementById(
            "firstName"
        ).value =
            student.firstName;


        document.getElementById(
            "lastName"
        ).value =
            student.lastName;


        document.getElementById(
            "email"
        ).value =
            student.email;


        document.getElementById(
            "department"
        ).value =
            student.department;


        document.getElementById(
            "semester"
        ).value =
            student.semester;


        /* Change form heading */

        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Student";


        /* Change button */

        document.getElementById(
            "saveBtn"
        ).textContent =
            "Update Student";


        /* Scroll to form */

        document.querySelector(
            ".student-form-panel"
        ).scrollIntoView({
            behavior: "smooth"
        });

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Unable to load student.",
            "#dc3545"
        );
    }
}


/* =========================================================
   UPDATE STUDENT
========================================================= */

async function updateStudent() {

    const firstName =
        document.getElementById("firstName")
            .value.trim();

    const lastName =
        document.getElementById("lastName")
            .value.trim();

    const email =
        document.getElementById("email")
            .value.trim();

    const department =
        document.getElementById("department")
            .value.trim();

    const semester =
        document.getElementById("semester")
            .value.trim();


    if (
        !firstName ||
        !lastName ||
        !email ||
        !department ||
        !semester
    ) {

        showMessage(
            "Please fill all fields.",
            "#dc3545"
        );

        return;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showMessage(
            "Please enter a valid email address.",
            "#dc3545"
        );

        return;
    }


    if (
        Number(semester) < 1 ||
        Number(semester) > 8
    ) {

        showMessage(
            "Semester must be between 1 and 8.",
            "#dc3545"
        );

        return;
    }


    const student = {

        firstName,
        lastName,
        email,
        department,
        semester

    };


    const saveBtn =
        document.getElementById("saveBtn");


    saveBtn.disabled = true;

    saveBtn.textContent =
        "Updating...";


    try {

        const response = await fetch(
            `${API_URL}/${selectedStudentId}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(student)
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;
        }


        if (response.status === 403) {

            showMessage(
                "You do not have permission to update students.",
                "#dc3545"
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to update student"
            );
        }


        showMessage(
            "Student updated successfully."
        );


        clearForm();

        await loadStudents();

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Failed to update student.",
            "#dc3545"
        );

    }
    finally {

        saveBtn.disabled = false;

        saveBtn.textContent =
            "Save Student";
    }
}


/* =========================================================
   DELETE STUDENT
========================================================= */

async function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;
        }


        if (response.status === 403) {

            showMessage(
                "You do not have permission to delete students.",
                "#dc3545"
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to delete student"
            );
        }


        showMessage(
            "Student deleted successfully."
        );


        await loadStudents();

    }
    catch (error) {

        console.error(error);

        showMessage(
            "Failed to delete student.",
            "#dc3545"
        );
    }
}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearForm() {

    document.getElementById(
        "firstName"
    ).value = "";


    document.getElementById(
        "lastName"
    ).value = "";


    document.getElementById(
        "email"
    ).value = "";


    document.getElementById(
        "department"
    ).value = "";


    document.getElementById(
        "semester"
    ).value = "";


    selectedStudentId = null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Student";


    document.getElementById(
        "saveBtn"
    ).textContent =
        "Save Student";
}


/* =========================================================
   DISPLAY STUDENTS
========================================================= */

function displayStudents(studentList) {

    const table =
        document.getElementById(
            "studentTable"
        );


    table.innerHTML = "";


    if (studentList.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center; padding:30px;"
                >

                    No students found.

                </td>

            </tr>

        `;

        return;
    }


    studentList.forEach(student => {

        const row = `

            <tr>

                <td>
                    ${student.id}
                </td>


                <td>

                    <strong>
                        ${student.firstName}
                        ${student.lastName}
                    </strong>

                </td>


                <td>
                    ${student.email}
                </td>


                <td>
                    ${student.department}
                </td>


                <td>
                    ${student.semester}
                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            onclick="editStudent(${student.id})">

                            Edit

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>

        `;


        table.innerHTML += row;
    });
}


/* =========================================================
   SEARCH STUDENTS
========================================================= */

function searchStudent() {

    const keyword =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase()
        .trim();


    const filtered =
        students.filter(student => {

            const fullName =
                `${student.firstName} ${student.lastName}`
                    .toLowerCase();


            const email =
                student.email
                    .toLowerCase();


            const department =
                student.department
                    .toLowerCase();


            return (
                fullName.includes(keyword) ||
                email.includes(keyword) ||
                department.includes(keyword)
            );

        });


    displayStudents(filtered);
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


    box.textContent = message;

    box.style.background = color;

    box.style.opacity = "1";


    setTimeout(() => {

        box.style.opacity = "0";

    }, 2500);
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