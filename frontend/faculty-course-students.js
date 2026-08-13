const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "FACULTY") {
    window.location.href = "login.html";
}


// Get courseId from URL
const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");


if (!courseId) {

    document.getElementById("studentContainer").innerHTML = `
        <p>
            Course ID is missing.
        </p>
    `;

    throw new Error("Course ID is missing");

}


async function loadStudents() {

    const container =
        document.getElementById("studentContainer");

    try {

        const response = await fetch(
            `http://localhost:8080/enrollments/course/${courseId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "login.html";

            return;

        }


        if (response.status === 403) {

            container.innerHTML = `
                <p>
                    You are not assigned to this course.
                </p>
            `;

            return;

        }


        if (response.status === 404) {

            container.innerHTML = `
                <p>
                    Course not found.
                </p>
            `;

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        const enrollments =
            await response.json();


        if (enrollments.length === 0) {

            container.innerHTML = `
                <div class="empty-message">

                    <h3>No students enrolled 👨‍🎓</h3>

                    <p>
                        There are currently no students
                        enrolled in this course.
                    </p>

                </div>
            `;

            return;

        }


        // Set course title
        const course =
            enrollments[0].course;

        document.getElementById(
            "courseTitle"
        ).textContent =
            `${course.courseName} - Students 👨‍🎓`;


        container.innerHTML = "";


        enrollments.forEach(enrollment => {

            const student =
                enrollment.student;

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

                    <p>
                        <strong>Enrollment Date:</strong>
                        ${enrollment.enrollmentDate}
                    </p>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Error loading course students:",
            error
        );

        container.innerHTML = `
            <p>
                Server error. Please try again.
            </p>
        `;

    }

}


function goBack() {

    window.location.href =
        "faculty-courses.html";

}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}


loadStudents();