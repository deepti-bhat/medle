import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, orderByChild, equalTo, get, query, update, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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


const result = document.getElementById("result");
const patientEmail = localStorage.getItem('userEmail');
async function fetch(info) {
    try{
    const usersRef = ref(db, 'sockets'); 
    const usersSnapshot = await get(usersRef);
    
    if (usersSnapshot.exists()) {
      usersSnapshot.forEach((userSnapshot) => {
          const userID2 = userSnapshot.key; 
          const userData = userSnapshot.val();
          console.log(info);
          if (userData && userData.doc == info) {
            console.log(userData.doc);
              const nodePath = `sockets/${userID2}`;
              const newData = {
              doc: info,
              user: "null",
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
              
              const userID = userSnapshot.key;
                    const path1 = '/sockets/'+userID+'/user';
                    const databaseRef1 = ref(db, path1);
                    onValue(databaseRef1, (snapshot) => {
                        const request = snapshot.val();
                        if(request == patientEmail) {
                          functionSuccess();
                        }
                        else if(request == "nill") {
                          functionFailure();
                        }
                    });

          }

          
      });
    } else {
        console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
}

const scanner = new Html5QrcodeScanner('reader',{
    qrbox:{
        width:250,
        height:250,

    },
    fps:20,
});
scanner.render(success, error);

function success(result){
    console.log(result);
    const param = result.replace(/^http:\/\//, '');
    sessionStorage.setItem('doc', param);
    console.log(param);
    fetch(param);
    scanner.clear();
    document.getElementById('reader').remove();
    const message = document.getElementById('message');
    // const endButton = document.getElementById('endButton')
    // endButton.style.display = 'block';
    message.innerHTML = 'Waiting to connect with Doctor...';
}
function functionSuccess() {
    const message = document.getElementById('message');
    const endButton = document.getElementById('endButton')
    endButton.style.display = 'block';
    message.innerHTML = 'Records Connected with Doctor';
}
function functionFailure() {
    window.alert("Doctor has not accepted your request");
    window.location.href = "patientdashboard.html"; 
}
function error(err){
    console.error(err);
}
document.getElementById('endButton').addEventListener('click', func);
async function func(){
    window.location.href = "patientdashboard.html";
    try{
        const usersRef = ref(db, 'sockets'); 
        const usersSnapshot = await get(usersRef);
        const info = sessionStorage.getItem('doc');
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
}