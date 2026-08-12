const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


// Protect faculty dashboard
if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


// Navigation

function goToCourses() {

    window.location.href =
        "faculty-courses.html";

}


function goToStudents() {

    window.location.href =
        "faculty-students.html";

}


// Logout

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}

function goToStatistics() {

    window.location.href =
        "faculty-statistics.html";

}