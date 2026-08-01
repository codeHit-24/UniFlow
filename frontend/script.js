const API_URL = "http://localhost:8080/Students";

let selectedStudentId = null;

let students = [];

async function loadStudents() {

    const response = await fetch(API_URL);

    const data = await response.json();

    students = data;

    displayStudents(data);

}

function addStudent(){

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();
    const semester = document.getElementById("semester").value.trim();

    if(
        !firstName ||
        !lastName ||
        !email ||
        !department ||
        !semester
    ){

        showMessage("Please fill all fields", "#dc3545");

        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        showMessage("Invalid email address","#dc3545");

        return;

    }

    if(semester < 1 || semester > 8){

        showMessage("Semester must be between 1 and 8","#dc3545");

        return;

    }

    const student = {

        firstName,

        lastName,

        email,

        department,

        semester

    };

    const saveBtn = document.getElementById("saveBtn");

    saveBtn.disabled = true;

    saveBtn.innerHTML = "Saving...";

    fetch("http://localhost:8080/Students", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(student)

    })

    .then(response => {

        if(response.ok){

            showMessage("Student added successfully");

            clearForm();

            loadStudents();

            saveBtn.disabled = false;

            saveBtn.innerHTML = "Add Student";

        }
        else{

            showMessage("Failed to add student");

            saveBtn.disabled = false;

            saveBtn.innerHTML = "Add Student";

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server error");

        saveBtn.disabled = false;

        saveBtn.innerHTML = "Add Student";

    });

}

function deleteStudent(id){

    let confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );


    if(!confirmDelete){
        return;
    }


    fetch(`http://localhost:8080/Students/${id}`, {

        method:"DELETE"

    })

    .then(response => {

        console.log("Delete status:", response.status);


        if(response.ok){

            showMessage("Student deleted successfully", "#dc3545");

            loadStudents();

        }
        else{

            showMessage("Delete failed");

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server error");

    });

}

function editStudent(id){

    fetch(`http://localhost:8080/Students/${id}`)

    .then(response => response.json())

    .then(student => {


        selectedStudentId = student.id;


        document.getElementById("firstName").value =
            student.firstName;


        document.getElementById("lastName").value =
            student.lastName;


        document.getElementById("email").value =
            student.email;


        document.getElementById("department").value =
            student.department;


        document.getElementById("semester").value =
            student.semester;


    });

}

function saveStudent(){

    if(selectedStudentId === null){

        addStudent();

    }
    else{

        updateStudent();

    }

}

function updateStudent(){

    const student = {

        firstName:
        document.getElementById("firstName").value,

        lastName:
        document.getElementById("lastName").value,

        email:
        document.getElementById("email").value,

        department:
        document.getElementById("department").value,

        semester:
        document.getElementById("semester").value

    };

    const saveBtn = document.getElementById("saveBtn");

    saveBtn.disabled = true;

    saveBtn.innerHTML = "Updating...";


    fetch(
        `http://localhost:8080/Students/${selectedStudentId}`,
        {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(student)

    })

    .then(response => {

        if(response.ok){

            showMessage("Student updated successfully!");

            clearForm();

            loadStudents();

            saveBtn.disabled = false;

            saveBtn.innerHTML = "Save Student";

        }
        else{

            showMessage("Failed to update student");

            saveBtn.disabled = false;

            saveBtn.innerHTML = "Save Student";

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server error");

        saveBtn.disabled = false;

        saveBtn.innerHTML = "Save Student";

    });

}

function clearForm(){

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("department").value = "";
    document.getElementById("semester").value = "";

    selectedStudentId = null;

}

function showMessage(message, color = "#16a34a") {

    let box = document.getElementById("message");

    box.innerHTML = message;

    box.style.background = color;

    box.style.opacity = "1";

    setTimeout(() => {

        box.style.opacity = "0";

    }, 2500);

}

function displayStudents(studentList) {

    let table = document.getElementById("studentTable");

    table.innerHTML = "";

    studentList.forEach(student => {

        let row = `

        <tr>

            <td>${student.id}</td>

            <td>
                ${student.firstName}
                ${student.lastName}
            </td>

            <td>${student.email}</td>

            <td>${student.department}</td>

            <td>${student.semester}</td>

            <td>

                <div class="action-buttons">

                    <button onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteStudent(${student.id})">
                        Delete
                    </button>

                </div>

            </td>

        </tr>

        `;

        table.innerHTML += row;

    });

}

function searchStudent() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = students.filter(student =>

        (student.firstName + " " + student.lastName)
            .toLowerCase()
            .includes(keyword)

    );

    displayStudents(filtered);

}

loadStudents();