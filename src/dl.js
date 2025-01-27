import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, orderByChild, equalTo, get, query, update, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function sha256(message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

const signup = document.getElementById("signupButton");
const signin = document.getElementById("signinButton");
if(signup){
  signup.addEventListener("click", function(event) {
      event.preventDefault(); 
      document.getElementById("doctor").style.display = "none";
      document.getElementById("doctor-register").style.display = "block";
      return false;
  });
}

if(signin){
  signin.addEventListener("click", function() {
      document.getElementById("doctor-register").style.display = "none";
      document.getElementById("doctor").style.display = "block";
  });
}

function signInWithEmailLinkFunc() {
  const email = document.getElementById("email").value; // Replace with user's email
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://deepti-bhat.github.io/nsproj-final/doctordashboard.html',
    handleCodeInApp: true,
  };
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // Save email to localStorage for later verification
      window.localStorage.setItem('emailForSignIn', email);
      sessionStorage.setItem('emailForSign', email);
      executeFunc();
      // Notify user that the link has been sent
      alert("An email with the sign-in link has been sent to your email address.");
      document.getElementById("login-form").reset();
    })
    .catch((error) => {
      console.error(error);
      alert("Error sending email link:", error.message);
    });
}
async function executeFunc() {
  try {
      const usersRef = ref(db, '/doctors/');
      const usersSnapshot = await get(usersRef);
      if (usersSnapshot.exists()) {
          usersSnapshot.forEach((userSnapshot) => {
              const userID = userSnapshot.key;
              const userData = userSnapshot.val();
              const userEmail = localStorage.getItem('emailForSignIn');
              if (userData && userData.emailID == userEmail) {
                  window.localStorage.setItem('doctorID', userID);
                  window.localStorage.setItem('doctorName', userData.docName);
              }
          });
      }
  } catch (error) {
      console.error("Error retrieving user data:", error);
  }
};
// Check if the current URL has a sign-in link, and complete sign-in process
if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    // Prompt user to enter their email again if not found in localStorage
    email = window.prompt('Please provide your email for confirmation');
  }

  // Sign-in with email and link
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      // Clear the email from storage
      window.localStorage.removeItem('emailForSignIn');
      // You can redirect the user or do other operations here upon successful sign-in
      window.alert("Sign-in successful");
      console.log("Sign-in successful:", result.user);
    })
    .catch((error) => {
      console.error(error);
      alert("Error signing in with email link:", error.message);
    });
}
async function checkDoctor() {
  try {
      const usersRef = ref(db, '/doctors/'); 
      const usersSnapshot = await get(usersRef);
      const userEmail = document.getElementById("email").value;
      var emailFlag  = false;
      if (usersSnapshot.exists()) {
          usersSnapshot.forEach((userSnapshot) => {
              const userID = userSnapshot.key; 
              const userData = userSnapshot.val(); 
              if (userData && userData.emailID == userEmail)  {
                signInWithEmailLinkFunc();
                emailFlag = true;
               }
    });

}
    if(!emailFlag) {
      window.alert("Doctor not registered");
    }}
    catch (error) {
        console.error("Error retrieving user data:", error);
      }
}
const submit = document.getElementById("doctorButton");
submit.addEventListener("click", function(e) {
    e.preventDefault();
    checkDoctor();
});

const name = document.getElementById("name");
const email =  document.getElementById("signup-email");
const adhNum =  document.getElementById("adhNum");
const mob = document.getElementById("mob");
const certDoct = document.getElementById("certDoct");
const pwd = document.getElementById("pwd");


const subBtn = document.getElementById('submit');
async function signIn() {
    try {
       
  const cred = await createUserWithEmailAndPassword(auth,email.value, pwd.value)
  .then(() => {
    var user = auth.currentUser;
    alert(`User created successfully`);
  });
  const key = `${email.value}${certDoct.value}`
  const encrypted = sha256(key);

        const userRef = ref(db, '/doctors/'+encrypted); 
                  const newData = {
                    docName: name.value,
                    emailID:email.value,
                    adhaarNum: Number(adhNum.value),
                    mobile:Number(mob.value),
                    certificateID:certDoct.value
                };
                
               set(userRef, newData).then(()=>{
                window.alert("Account created successfully!");
               }).catch((error)=>{
                console.log(error);
               });
               const parentRef = ref(db, 'sockets');
               //Add default values to the new user
               const dataToAdd = {
                 doc: encrypted,
                 user: "null",
                 request: "null"
               };
               const newEntryRef = push(parentRef);
               set(newEntryRef, dataToAdd)
               .then(() => {
                 console.log("Data added successfully!");
               })
               .catch((error) => {
                 console.error("Error adding data: ", error);
               });
    document.getElementById("signupForm").reset();
}
catch(error){
  
    alert( `Authentication failed ${error.code}: ${error.message}`);

}
}
if(signin){
  subBtn.addEventListener('click', function(e) {
    e.preventDefault();
    signIn();
  });
}
