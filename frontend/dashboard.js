const BASE_URL = "http://localhost:8080";

loadStats();

async function loadStats(){

    const students = await fetch(BASE_URL + "/Students");
    const studentData = await students.json();

    document.getElementById("studentCount").innerHTML = studentData.length;

    const courses = await fetch(BASE_URL + "/Courses");
    const courseData = await courses.json();

    document.getElementById("courseCount").innerHTML = courseData.length;

    const enrollments = await fetch(BASE_URL + "/enrollments");
    const enrollmentData = await enrollments.json();

    document.getElementById("enrollmentCount").innerHTML = enrollmentData.length;

}