// contants
const studentCollection = "students"

// references
const auth = firebase.auth();
const db = firebase.firestore()

const loginForm = document.getElementById('loginForm')
// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        // Sign in with email and password
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("🚀 ~ .then ~ userCredential:", userCredential.user.multiFactor.user)
                var { user } = userCredential.user.multiFactor;
                console.log("🚀 ~ Logged in user:", user);
                window.localStorage.setItem('__user__', JSON.stringify(user))
                window.location.replace("admin-portal.html")
            })
            .catch((error) => {
                var errorMessage = error.message;
                window.alert(errorMessage)
            });
    });
}

let stuData = []

const getAllStudents = () => {
    const stuTable = document.querySelector('#stuData')
    console.log("🚀 ~ getAllStudents ~ stuTable:", stuTable.lastElementChild)
    stuTable.lastElementChild.innerHTML = ''
    let index = 0
    stuData = []
    db.collection(studentCollection).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            console.log("🚀 ~ querySnapshot.forEach ~ data:", data)
            index++
            stuData = [...stuData, { id: doc.id, ...data }]
            stuTable.lastElementChild.innerHTML += `
                <tr>
                    <td>${index}</td>
                    <td>${data.firstName}</td>
                    <td>${data.lastName}</td>
                    <td>${data.email}</td>
                    <td>${data.cnic}</td>
                    <td>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#resultModal" data-bs-stuId="${doc.id}" onclick='addStudentResult(this)'>
                            Add Result
                        </button>
                    </td>
                </tr>`
        });
    });
}

if (window.location.pathname === '/admin-portal.html') {
    getAllStudents()
}

const addStudentForm = document.getElementById('addStudentForm')
if (addStudentForm) {
    addStudentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('studentEmail').value;
        const password = document.getElementById('studentPassword').value;
        const cnic = document.getElementById('cnic').value;
        const userType = document.getElementById('userType').value;
        const student = {
            firstName,
            lastName,
            email,
            password,
            cnic,
            userType
        }
        console.log("🚀 ~ student:", student)
        db.collection("students").where("email", "==", email)
            .get()
            .then((querySnapshot) => {
                let found = false
                querySnapshot.forEach((doc) => {
                    found = true
                });
                if (!found) {
                    firebase.auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            db.collection("students").add(student)
                                .then((docRef) => {
                                    console.log("🚀 ~ .then ~ docRef:", docRef)
                                    getAllStudents();
                                })
                                .catch((error) => {
                                    console.error("Error adding document: ", error);
                                });
                        })
                        .catch((error) => {
                            var errorMessage = error.message;
                            window.alert(errorMessage)
                        });
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    });
}

const addStudentResult = (element) => {
    console.log("🚀 ~ addStudentResult ~ stu:", element)
    const stuId = element.getAttribute('data-bs-stuId')
    console.log("🚀 ~ addStudentResult ~ stuId:", stuId)
    const student = stuData.find(x => x.id === stuId)
    console.log("🚀 ~ addStudentResult ~ student:", student)
}

document.getElementById('uploadMarksForm').addEventListener('submit', function (event) {
    event.preventDefault();
    // Add logic to save marks data
    alert('Marks uploaded successfully!');
});

document.getElementById('editProfileForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newCnic = document.getElementById('editCnic').value;
    // Add logic to update CNIC
    alert('Profile updated successfully!');
});

document.getElementById('resultLookupForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const lookupCnic = document.getElementById('lookupCnic').value;
    // Simulate result lookup
    document.getElementById('resultDisplay').innerText = `Results for CNIC ${lookupCnic}: [Sample Result Data]`;
});



