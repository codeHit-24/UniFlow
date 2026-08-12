const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "STUDENT") {

    window.location.href = "login.html";

}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "login.html";

}