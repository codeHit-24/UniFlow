const API_URL = "http://localhost:8080/Students";

let selectedStudentId = null;

function loadStudents(){
fetch(API_URL)

.then(response => response.json())

.then(students => {


    let table = document.getElementById(
        "studentTable"
    );

    table.innerHTML = "";

    students.forEach(student => {


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
        <button onclick="editStudent(${student.id})">
        Edit
        </button>

        <button onclick="deleteStudent(${student.id})">
        Delete
        </button>
        </td>

        </tr>

        `;


        table.innerHTML += row;


    });


});
}

function addStudent(){

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

        }
        else{

            showMessage("Failed to add student");

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server error");

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

            showMessage("Student deleted successfully");

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

        }
        else{

            showMessage("Failed to update student");

        }

    })

    .catch(error => {

        console.log(error);

        showMessage("Server error");

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

function showMessage(message){

    let box = document.getElementById("message");

    box.innerHTML = message;


    setTimeout(()=>{

        box.innerHTML="";

    },3000);

}

loadStudents();