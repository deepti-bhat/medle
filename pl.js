import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, orderByChild, equalTo, get, query, update, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {

};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const signin = document.getElementById("signinButton");
const signup = document.getElementById("signupButton");
const submitButton = document.getElementById("patientButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");


const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword, fullName, numberInput;

if(signup){
    signup.addEventListener("click", function(event) {
        event.preventDefault(); 
        document.getElementById("patient").style.display = "none";
        document.getElementById("patient-register").style.display = "block";
        return false;
    });
}

if(signin){
    signin.addEventListener("click", function() {
        document.getElementById("patient-register").style.display = "none";
        document.getElementById("patient").style.display = "block";
    });
}


function sha256(message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}
if(createacctbtn) {
    createacctbtn.addEventListener("click", function(e) {
      e.preventDefault();
      var isVerified = true;
      signupEmail = signupEmailIn.value;
      confirmSignupEmail = confirmSignupEmailIn.value;
      if(signupEmail != confirmSignupEmail) {
          window.alert("Email fields do not match. Try again.")
          isVerified = false;
      }
      signupPassword = signupPasswordIn.value;
      confirmSignUpPassword = confirmSignUpPasswordIn.value;
      if(signupPassword != confirmSignUpPassword) {
          window.alert("Password fields do not match. Try again.")
          isVerified = false;
      }
      if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
        window.alert("Please fill out all required fields.");
        isVerified = false;
      }
      fullName = document.getElementById("name-signup").value;
      numberInput = document.getElementById("numberInput").value;
      if(isVerified) {
        createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
          .then((userCredential) => {
          const user = userCredential.user;
          const parentRef = ref(db, 'patients');
          //Add default values to the new user
          const encrypted = sha256(numberInput);
          const dataToAdd = {
            email: signupEmail,
            code: encrypted,
            fullname: fullName
          };
          const newEntryRef = push(parentRef);
          set(newEntryRef, dataToAdd)
          .then(() => {
            window.alert("Account created successfully!");
            console.log("Data added successfully!");
          })
          .catch((error) => {
            console.error("Error adding data: ", error);
          });
            document.getElementById("reg-form").reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            errorMessage = "Password should be at least 6 characters. Please try again.";
          }
          if(errorCode == "auth/invalid-email"){
              errorMessage = "Invalid Email ID";
          }
          if(errorCode == "auth/email-already-in-use"){
              errorMessage = "Email already in use. Try Logging In.";
          }
        });
      }
    });
}
    
if(submitButton){
    submitButton.addEventListener("click", function(e) {
      e.preventDefault();
      email = emailInput.value;
      password = passwordInput.value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          sessionStorage.setItem("user", user);
          window.localStorage.setItem("userEmail", user.email);
          window.location.href = 'pin.html';
          document.getElementById("login-form").reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error occurred. Try again.");
          window.alert(errorMessage);
        });
    });
    }

const checkNumberInput = document.getElementById("checkNumberInput");
const checkButton = document.getElementById("enter-btn");
async function checkName() {
  try {
    const userEmail = window.localStorage.getItem('userEmail');
    const usersRef = ref(db, 'patients'); 
    const usersSnapshot = await get(usersRef);
    if (usersSnapshot.exists()) {
        usersSnapshot.forEach((userSnapshot) => {
            const userID = userSnapshot.key;
            const userData = userSnapshot.val();
            if (userData && userData.email == userEmail) {
                window.localStorage.setItem("userName", userData.fullname);
                console.log(userData.fullname);
            }
        });
    } else {
        console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
}
async function checkCode() {
  try {
    const userEmail = localStorage.getItem('userEmail');
    const usersRef = ref(db, 'patients'); 
    const usersSnapshot = await get(usersRef);

    if (usersSnapshot.exists()) {
        usersSnapshot.forEach((userSnapshot) => {
            const userID = userSnapshot.key; // Get the user ID
            const userData = userSnapshot.val(); // Get the user data
            const value = checkNumberInput.value;
            const encrypted = sha256(value);
            if (userData && userData.email == userEmail) {
                if(userData.code == encrypted) {
                    window.location.href = 'patientdashboard.html';
                } else {
                    window.alert("Invalid code. Try again.");
                }
            }
        });
    } else {
        console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
}
if(checkNumberInput) {
  checkButton.addEventListener("click", function(e) {
    e.preventDefault();
    checkName();
    checkCode();
  });
} 
