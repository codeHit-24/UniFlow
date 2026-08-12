const ENROLLMENT_API =
    "http://localhost:8080/enrollments/me";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "STUDENT") {

    window.location.href = "login.html";

}

async function loadMyCourses() {

    const container =
        document.getElementById("courseContainer");

    try {

        const response = await fetch(ENROLLMENT_API, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }

        });

        // Token expired
        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "login.html";

            return;

        }

        if (!response.ok) {

            container.innerHTML = `
                <p>Failed to load your courses.</p>
            `;

            return;

        }

        const enrollments = await response.json();

        if (enrollments.length === 0) {

            container.innerHTML = `
                <div class="empty-message">
                    <h3>No courses yet 📚</h3>
                    <p>You are not enrolled in any courses.</p>
                </div>
            `;

            return;

        }

        container.innerHTML = "";

        enrollments.forEach(enrollment => {

            const course = enrollment.course;

            container.innerHTML += `

                <div class="course-card">

                    <h2>
                        ${course.courseName}
                    </h2>

                    <p>
                        <strong>Course Code:</strong>
                        ${course.courseCode}
                    </p>

                    <p>
                        <strong>Credits:</strong>
                        ${course.credits}
                    </p>

                    <p>
                        <strong>Department:</strong>
                        ${course.department}
                    </p>

                    <p>
                        <strong>Enrolled On:</strong>
                        ${enrollment.enrollmentDate}
                    </p>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Error loading courses:",
            error
        );

        container.innerHTML = `
            <p>Server error. Please try again.</p>
        `;

    }

}

function goBack() {

    window.location.href =
        "student-dashboard.html";

}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href =
        "login.html";

}

loadMyCourses();