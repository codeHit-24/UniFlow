const ENROLLMENT_API =
"http://localhost:8080/enrollments";

const STUDENT_API =
"http://localhost:8080/Students";

const COURSE_API =
"http://localhost:8080/Courses";

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

function getHeaders() {

    const token = localStorage.getItem("token");

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}

async function loadStudents() {

    try {

        const response = await fetch(STUDENT_API, {

            headers: getHeaders()

        });

        if (!response.ok) {

            showMessage("Failed to load students");

            return;

        }

        const students = await response.json();

        let dropdown = document.getElementById("studentSelect");

        dropdown.innerHTML =
            '<option value="">Select Student</option>';

        students.forEach(student => {

            dropdown.innerHTML += `

                <option value="${student.id}">
                    ${student.firstName} ${student.lastName}
                </option>

            `;

        });

    }
    catch (error) {

        console.log(error);

        showMessage("Server Error");

    }

}

async function loadCourses() {

    try {

        const response = await fetch(COURSE_API, {

            headers: getHeaders()

        });

        if (!response.ok) {

            showMessage("Failed to load courses");

            return;

        }

        const courses = await response.json();

        let dropdown = document.getElementById("courseSelect");

        dropdown.innerHTML =
            '<option value="">Select Course</option>';

        courses.forEach(course => {

            dropdown.innerHTML += `

                <option value="${course.id}">
                    ${course.courseName}
                </option>

            `;

        });

    }
    catch (error) {

        console.log(error);

        showMessage("Server Error");

    }

}

function addEnrollment(){

    const enrollment = {

        studentId:
        document.getElementById("studentSelect").value,

        courseId:
        document.getElementById("courseSelect").value,

        enrollmentDate:
        document.getElementById("enrollmentDate").value

    };

    fetch(ENROLLMENT_API,{

        method:"POST",

        headers: getHeaders(),

        body:JSON.stringify(enrollment)

    })

    .then(response => {

        if(response.ok){

            showMessage("Student enrolled successfully!");

            loadEnrollments();

            clearEnrollmentForm();

        }
        else{

            showMessage("Failed to enroll student");

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server Error");

    });

}

async function loadEnrollments() {

    try {

        const response = await fetch(ENROLLMENT_API, {

            headers: getHeaders()

        });

        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;

        }

        if (!response.ok) {

            showMessage("Failed to load enrollments");

            return;

        }

        const enrollments = await response.json();

        let table = document.getElementById("enrollmentTable");

        table.innerHTML = "";

        enrollments.forEach(enrollment => {

            table.innerHTML += `

            <tr>

                <td>${enrollment.id}</td>

                <td>
                    ${enrollment.student.firstName}
                    ${enrollment.student.lastName}
                </td>

                <td>
                    ${enrollment.course.courseName}
                </td>

                <td>
                    ${enrollment.enrollmentDate}
                </td>

                <td>
                    <button class="delete-btn"
                        onclick="deleteEnrollment(${enrollment.id})">
                        Delete
                    </button>
                </td>

            </tr>

            `;

        });

    }
    catch (error) {

        console.log(error);

        showMessage("Server Error");

    }

}

function deleteEnrollment(id){

    if(!confirm("Delete this enrollment?")){
        return;
    }

    fetch(`${ENROLLMENT_API}/${id}`,{

        method:"DELETE",

        headers: getHeaders()

    })

    .then(response=>{

        if(response.ok){

            showMessage("Enrollment removed successfully!");

            loadEnrollments();

        }else{

            showMessage("Failed to remove enrollment");

        }

    });

}

function clearEnrollmentForm(){

    document.getElementById("studentSelect").selectedIndex = 0;

    document.getElementById("courseSelect").selectedIndex = 0;

    document.getElementById("enrollmentDate").value = "";

}

function showMessage(message){

    let box = document.getElementById("message");

    box.innerHTML = message;


    setTimeout(()=>{

        box.innerHTML="";

    },3000);

}

loadStudents();
loadCourses();
loadEnrollments();