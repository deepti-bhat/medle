import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { GoogleAuthProvider, signOut, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, get, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"; 

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const db2 = getDatabase(app);
const patientName = localStorage.getItem('patientName');

async function fetchQuery(email) {
    try{
        const patientName = localStorage.getItem('userName');
        document.getElementById('welcome-message').innerHTML = `Welcome ${patientName}`;
        const patientCollection = collection(db, "patients");
        const docCollection = query(patientCollection, where("email", "==", email));
        const querySnapshot = await getDocs(docCollection);
        querySnapshot.forEach((doc) => {
            
            // const cardDisplay = document.getElementById("visitCards");
            // const card = document.createElement("div");
            // const doctorName = document.createElement("p");
            // const time = document.createElement("p");
            // const hospital = document.createElement("p");
            // const reportID = document.createElement("p");
            // card.classList.add("visit");
            // card.classList.add("col-sm-4");
            // doctorName.classList.add("doctorName");
            // hospital.classList.add("hospitalName");
            // time.classList.add("time");
            // const id = doc.id;
            // const functionCall = `handleClick('${id}')`;
            // card.setAttribute('onclick', functionCall);
            // doctorName.innerHTML = "Dr. "+doc.data().doctorName;
            // hospital.innerHTML = doc.data().hospital;
            // time.innerHTML = doc.data().time;
            // card.innerHTML = doctorName.outerHTML;
            // card.innerHTML += hospital.outerHTML;
            // card.innerHTML += time.outerHTML;
            
            // cardDisplay.appendChild(card);
            const cardDisplay = document.getElementById("visitCards");
            const innerCard = document.createElement("div");
            const time = document.createElement("div");
            const content = document.createElement("div");
            const doctorName = document.createElement("p");
            const hospitalName = document.createElement("p");
            const date = document.createElement("li");
            const month = document.createElement("li");
            const ulist = document.createElement("ul");
            innerCard.classList.add("visit");
            innerCard.classList.add("col-sm-4");
            time.classList.add("time");
            time.classList.add("col-sm-2");
            date.classList.add("date");
            month.classList.add("month");
            content.classList.add("content");
            date.innerHTML = doc.data().date;
            month.innerHTML = doc.data().month;
            ulist.innerHTML = date.outerHTML;
            ulist.innerHTML += month.outerHTML;
            time.innerHTML = ulist.outerHTML;
            doctorName.classList.add("doctorName");
            hospitalName.classList.add("hospitalName");
            const id = doc.id;
            const functionCall = `handleClick('${id}')`;
            innerCard.setAttribute('onclick', functionCall);
            doctorName.innerHTML = "Dr. "+doc.data().doctorName;
            hospitalName.innerHTML = doc.data().hospital;
            content.innerHTML = doctorName.outerHTML;
            content.innerHTML += hospitalName.outerHTML;
            innerCard.innerHTML = time.outerHTML;
            innerCard.innerHTML += content.outerHTML;
            cardDisplay.appendChild(innerCard);

        }); 
    } catch(e) {

    }
}


const reportView = document.getElementById('reportView');
const userEmail = localStorage.getItem('userEmail');
console.log(userEmail);
if(!reportView){
document.addEventListener('DOMContentLoaded', async () => {
    try {
        fetchQuery(userEmail);
    } catch (error) {
        console.error('Error fetching patient details or reports:', error);
    }
});
}


if (reportView) {
    try{
        var reportID = localStorage.getItem('reportId');
        console.log(reportID);
        const patientCollection = collection(db, "patients");
        const docCollection = query(patientCollection, where("email", "==", userEmail), where("__name__", "==", reportID));
        const querySnapshot = await getDocs(docCollection);
        querySnapshot.forEach((doc) => {
            const name = doc.data().name;
            const age = doc.data().age;
            const weight = doc.data().weight;
            const height = doc.data().height;
            const doctorName = doc.data().doctorName;
            const symptoms = doc.data().symptoms;
            const prescription = doc.data().prescription;
            const diag = doc.data().diag;
            const hospitalName = doc.data().hospital;
            const date = doc.data().date;
            const month = doc.data().month;
            document.getElementById('date').innerHTML = date;
            document.getElementById('month').innerHTML = month;
            document.getElementById('hospital').value = hospitalName;
            document.getElementById('name').value = name;
            document.getElementById('age').value = age;
            document.getElementById('weight').value = weight;
            document.getElementById('height').value = height;
            document.getElementById('doctorName').innerHTML = "Dr. " + doctorName;
            document.getElementById('symp').value = symptoms;
            document.getElementById('diag').value = diag;
            document.getElementById('pres').value = prescription;
            image.innerHTML = `<img src="${doc.data().file}" width="90%" height="90%">`;

        });
    }
    catch(e){
        console.log(e);
    }
}

const scanner = document.getElementById('scanner');
if(scanner) {
    scanner.addEventListener('click', () => {
        window.location.href = "scanner.html";
    });
}
const logout = document.getElementById('logout');
if(logout) {
    logout.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = "doctorlogin.html";
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}

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

document.getElementById("addReport").addEventListener("click", function() {
    window.localStorage.setItem('userEmail', userEmail);
    window.location.href = "doctorentry.html";
});
document.getElementById("end-session").addEventListener("click", async function(e) {
    e.preventDefault();
    try{
        const usersRef = ref(db2, 'sockets'); 
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
              update(ref(db2, nodePath), newData)
                  .then(() => {
                      console.log("Attribute updated successfully!");
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
    window.location.href = "doctordashboard.html";
});