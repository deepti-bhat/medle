import {initializeApp}  from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, orderByChild, equalTo, get, query, update, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZItBsxkIt9KdQew1ocn2Y7UjY0eeh_uU",
    authDomain: "nsproj-da609.firebaseapp.com",
    databaseURL: "https://nsproj-da609-default-rtdb.firebaseio.com",
    projectId: "nsproj-da609",
    storageBucket: "nsproj-da609.appspot.com",
    messagingSenderId: "273729925887",
    appId: "1:273729925887:web:fa53f9af1a0f54229212ca",
    measurementId: "G-44N23C234T"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function sha256(message) {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}
document.getElementById("endButton").addEventListener("click", async function() { 
    try{
        const usersRef = ref(db, 'sockets'); 
        const usersSnapshot = await get(usersRef);
        const info = localStorage.getItem('doctorID');
        if (usersSnapshot.exists()) {
          usersSnapshot.forEach((userSnapshot) => {
              const userID = userSnapshot.key; 
              const userData = userSnapshot.val();
              console.log(info);
              if (userData && userData.doc == info) {
                console.log(userData.doc);
                  console.log(`User ID: ${userID}, Email: ${info}`);
                  const nodePath = `sockets/${userID}`;
                  const newData = {
                  doc: info,
                  request: "null",
                  user: "null"
              };
              update(ref(db, nodePath), newData)
                  .then(() => {
                      console.log("Attribute updated successfully!");
                      fetch();
                  })
                  .catch((error) => {
                      console.error("Error updating attribute:", error);
                  });
                  
              }
          });
        } else {
            console.log("No users found in the database.");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
});
document.getElementById("logout").addEventListener("click", function() {    
    auth.signOut().then(() => {
        localStorage.clear();
        window.location.href = "doctorlogin.html";
    }).catch((error) => {
        console.error(error);
    });
});
async function fetch(info) {
    try{
    const usersRef = ref(db, 'sockets'); 
    const usersSnapshot = await get(usersRef);
    if (usersSnapshot.exists()) {
      usersSnapshot.forEach((userSnapshot) => {
          const userData = userSnapshot.val();
          console.log(userData.doc);
          console.log(info);
          if (userData && userData.doc == info) {
            
            const userID = userSnapshot.key;
            const path1 = '/sockets/'+userID+'/request';
            const databaseRef1 = ref(db, path1);
            onValue(databaseRef1, (snapshot) => {
                const request = snapshot.val();
                myFunction1(request);
            });
            
            document.getElementById("yes").addEventListener("click", function() {  
                    const patientEmail = localStorage.getItem('reqEmail');
                      const nodePath = `sockets/${userID}`;
                      const newData = {
                      doc: info,
                      user: patientEmail,
                      request: patientEmail
                  };
                  update(ref(db, nodePath), newData)
                      .then(() => {
                          console.log("Attribute updated successfully!");
                          fetch();
                      })
                      .catch((error) => {
                          console.error("Error updating attribute:", error);
                      });
                myFunction(patientEmail);
            });
            document.getElementById("no").addEventListener("click", function() {  
                const patientEmail = localStorage.getItem('reqEmail');
                  const nodePath = `sockets/${userID}`;
                  const newData = {
                  doc: info,
                  user: "nill",
                  request: "null"
              };
              update(ref(db, nodePath), newData)
                  .then(() => {
                      console.log("Attribute updated successfully!");
                      fetch();
                  })
                  .catch((error) => {
                      console.error("Error updating attribute:", error);
                  });
                  document.getElementById("request-container").style.display = "none";
                document.getElementById("main-content").style.display = "block";
            });
            // const path = '/sockets/'+userID+'/user';
            // const databaseRef = ref(db, path);
            // console.log(userData.user);
            // sessionStorage.setItem("userName", userData.user);
            // onValue(databaseRef, (snapshot) => {
            //     const data = snapshot.val();
            //     console.log('Data has changed:', data);
            //     sessionStorage.setItem("patientEmail", data);
            //     myFunction(data);
            // });
                }
            });
    } else {
        console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
}
const param = localStorage.getItem('doctorID');
fetch(param);
function myFunction(data) {
    if (data !== "null") {
    const name = localStorage.getItem('docName');
    const id = localStorage.getItem('doctorID');
    window.localStorage.setItem('docName', name);
    window.localStorage.setItem('docID', id);
    window.localStorage.setItem('userEmail', data);
    window.localStorage.setItem('patientEmail', data);
    checkName();
    window.location.href = "doctorview.html";
    
    }
}
async function checkName() {
    try {
      const userEmail = localStorage.getItem('userEmail');
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
function myFunction1(request) {
    if (request !== "null") {
        window.localStorage.setItem('reqEmail', request);
        console.log(request);
        document.getElementById("request-container").style.display = "block";
        document.getElementById("main-content").style.display = "none";
        document.getElementById("connection-request").innerHTML = request;
    }
}