import {initializeApp}  from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {collection, doc,getDoc,setDoc, getFirestore} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import {getStorage,getDownloadURL, ref, uploadBytesResumable, uploadBytes} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const firebaseConfig = {

};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


 const weight = document.getElementById("weight");
const height = document.getElementById("height");
const age =  document.getElementById("age");

const diag = document.getElementById("diag");
const doctName = sessionStorage.getItem("doctorNameReport");
const email = localStorage.getItem("userEmail");
console.log(email);
const hosp = document.getElementById("hospital"); 
const name = localStorage.getItem("userName");
console.log(name);
document.getElementById("name").value = name;
const symp = document.getElementById("symp");
const pres = document.getElementById("pres");
const subBtn = document.getElementById('form-submit');

subBtn.addEventListener("click",async(e)=>{
  e.preventDefault();
try {
  
  const date = new Date();
  const usersCollection = collection(db, "patients");
  const userDocRef = doc(usersCollection);
  console.log(usersCollection);

  // Assuming 'upfile' is an input element of type 'file'
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

  // Check if a file is selected
  if (file) {
      try {
        const storage = getStorage();
          // Upload the file to Firebase Storage
          const storageRef = ref(storage, 'user_images/' + file.name);
          const uploadTask = uploadBytesResumable(storageRef, file);
  
          // Wait for the upload to complete
          await uploadTask;
  
          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);
                  const newData = {
                    age:age.value,
                      date:date.getUTCDate(),
                      diag:diag.value,
                      doctorName:doctName,
                      email:email,
                      hospital:hosp.value,
                    month: `${date.toLocaleString("default",{month:"short"})} ${date.getUTCFullYear()}`,
                    name: name,
                    prescription:pres.value,
                    symptoms: symp.value,
                    weight:weight.value,
                    height:height.value,
                    
                
                    
                    
                      file: downloadURL,
                  };
          
                  await setDoc(userDocRef, newData);
                  document.getElementById('p1').reset();
                  document.getElementById('p2').reset();
                  console.log('New document created successfully!');
              }catch (error) {
          console.error('Error uploading file:', error);
      }
  } else {
      try {
          
              const newData = {
                age:age.value,
                  date:date.getUTCDate(),
                  diag:diag.value,
                  doctorName:doctName,
                  email:email,
                  hospital:hosp.value,
                    month: `${date.toLocaleString("default",{month:"short"})} ${date.getUTCFullYear()}`,
                   name:name,
                   
                    prescription:pres.value,
                    symptoms: symp.value,
                    
                    weight:weight.value,
                    height:height.value,
                    
                  file: '',
              };
          
              await setDoc(userDocRef, newData);
              document.getElementById('p1').reset();
              document.getElementById('p2').reset();
              console.log('New document created successfully!');
          } catch (error) {
          console.error('Error updating document:', error);
      }
  }
  
} catch (error) {
  console.error('Error getting document:', error);
}
});
