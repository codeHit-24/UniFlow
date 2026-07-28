const API_URL = "http://localhost:8080/Courses";

let selectedCourseId = null;

function loadCourses(){

    fetch(API_URL)

    .then(response => response.json())

    .then(courses => {

        let table =
        document.getElementById("courseTable");

        table.innerHTML="";

        courses.forEach(course=>{

            let row=`

            <tr>

            <td>${course.id}</td>

            <td>${course.courseName}</td>

            <td>${course.courseCode}</td>

            <td>${course.credits}</td>

            <td>${course.department}</td>

            <td>

            <button onclick="editCourse(${course.id})">
            Edit
            </button>

            <button onclick="deleteCourse(${course.id})">
            Delete
            </button>

            </td>

            </tr>

            `;

            table.innerHTML+=row;

        });

    });

}

function saveCourse(){

    if(selectedCourseId == null){

        addCourse();

    }
    else{

        updateCourse();

    }

}

function clearCourseForm(){

    document.getElementById("courseName").value = "";
    document.getElementById("courseCode").value = "";
    document.getElementById("credits").value = "";
    document.getElementById("department").value = "";

    selectedCourseId = null;

}

function addCourse(){

    const course = {

        courseName:
        document.getElementById("courseName").value,

        courseCode:
        document.getElementById("courseCode").value,

        credits:
        document.getElementById("credits").value,

        department:
        document.getElementById("department").value

    };

    fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(course)

    })

    .then(response=>{

        if(response.ok){

            showMessage("Course added successfully!");

            clearCourseForm();

            loadCourses();

        }
        else{

            showMessage("Failed to add course");

        }

    })

    .catch(error=>{

        console.log(error);

        showMessage("Server Error");

    });

}

function showMessage(message){

    let box = document.getElementById("message");

    box.innerHTML = message;


    setTimeout(()=>{

        box.innerHTML="";

    },3000);

}

function editCourse(id){

    fetch(`${API_URL}/${id}`)

    .then(response => response.json())

    .then(course => {

        selectedCourseId = course.id;

        document.getElementById("courseName").value = course.courseName;
        document.getElementById("courseCode").value = course.courseCode;
        document.getElementById("credits").value = course.credits;
        document.getElementById("department").value = course.department;

    });

}

function updateCourse(){

    const course = {

        courseName:
        document.getElementById("courseName").value,

        courseCode:
        document.getElementById("courseCode").value,

        credits:
        document.getElementById("credits").value,

        department:
        document.getElementById("department").value

    };

    fetch(`${API_URL}/${selectedCourseId}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(course)

    })

    .then(response => {

        if(response.ok){

            showMessage("Course updated successfully!");

            clearCourseForm();

            loadCourses();

        }
        else{

            showMessage("Failed to update course");

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server Error");

    });

}

function deleteCourse(id){

    let confirmDelete = confirm(
        "Are you sure you want to delete this course?"
    );

    if(!confirmDelete){
        return;
    }

    fetch(`${API_URL}/${id}`, {

        method:"DELETE"

    })

    .then(response => {

        if(response.ok){

            showMessage("Course deleted successfully!");

            loadCourses();

        }
        else{

            showMessage("Failed to delete course");

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server Error");

    });

}

loadCourses();