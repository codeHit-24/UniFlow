/* =========================================================
   STUDENT DASHBOARD
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
   LOAD STUDENT NAME
   ========================================================= */

function loadStudentName() {

    const studentNameElement =
        document.getElementById("studentName");

    if (!studentNameElement) {
        return;
    }

    const username =
        localStorage.getItem("username");

    if (username) {

        studentNameElement.textContent =
            username;

    }
    else {

        studentNameElement.textContent =
            "Student";

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