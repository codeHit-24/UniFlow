const COURSES_API =
    "http://localhost:8080/Courses/me";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (!token || role !== "FACULTY") {

    window.location.href = "login.html";

}


async function loadMyCourses() {

    const container =
        document.getElementById("courseContainer");

    try {

        const response = await fetch(COURSES_API, {

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
                    these courses.
                </p>
            `;

            return;

        }


        if (!response.ok) {

            container.innerHTML = `
                <p>
                    Failed to load courses.
                </p>
            `;

            return;

        }


        const courses = await response.json();


        if (courses.length === 0) {

            container.innerHTML = `
                <div class="empty-message">

                    <h3>No courses assigned 📚</h3>

                    <p>
                        You currently have no courses
                        assigned to you.
                    </p>

                </div>
            `;

            return;

        }


        container.innerHTML = "";


        courses.forEach(course => {

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

                    <button
                        onclick="viewStudents(${course.id})">
                        View Students 👨‍🎓
                    </button>

                </div>

            `;

        });

    }
    catch (error) {

        console.error(
            "Error loading faculty courses:",
            error
        );

        container.innerHTML = `
            <p>
                Server error. Please try again.
            </p>
        `;

    }

}

function viewStudents(courseId) {

    window.location.href =
        `faculty-course-students.html?courseId=${courseId}`;

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


loadMyCourses();