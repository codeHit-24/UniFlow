const STUDENTS_API =
    "http://localhost:8080/enrollments/my-students";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


async function loadMyStudents() {

    const container =
        document.getElementById("studentContainer");

    try {

        const response = await fetch(STUDENTS_API, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }

        });


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "login.html";

            return;

        }


        if (response.status === 403) {

            container.innerHTML = `
                <p>
                    You do not have permission to view
                    these students.
                </p>
            `;

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        const enrollments = await response.json();


        if (enrollments.length === 0) {

            container.innerHTML = `
                <div class="empty-message">

                    <h3>No students found 👨‍🎓</h3>

                    <p>
                        No students are currently enrolled
                        in your courses.
                    </p>

                </div>
            `;

            return;

        }


        container.innerHTML = "";


        enrollments.forEach(enrollment => {

            const student = enrollment.student;
            const course = enrollment.course;

            container.innerHTML += `

                <div class="student-card">

                    <h2>
                        ${student.firstName}
                        ${student.lastName}
                    </h2>

                    <p>
                        <strong>Email:</strong>
                        ${student.email}
                    </p>

                    <p>
                        <strong>Department:</strong>
                        ${student.department}
                    </p>

                    <p>
                        <strong>Semester:</strong>
                        ${student.semester}
                    </p>

                    <hr>

                    <p>
                        <strong>Course:</strong>
                        ${course.courseName}
                    </p>

                    <p>
                        <strong>Course Code:</strong>
                        ${course.courseCode}
                    </p>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Unable to load students.
                Please try again.
            </p>
        `;

    }

}


function goBack() {

    window.location.href =
        "faculty-dashboard.html";

}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


loadMyStudents();