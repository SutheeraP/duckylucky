// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPYjRhm_hznbuYIg5z17lxPEPwTbn0-BI",
  authDomain: "ducky-lucky.firebaseapp.com",
  projectId: "ducky-lucky",
  storageBucket: "ducky-lucky.appspot.com",
  messagingSenderId: "122464436409",
  appId: "1:122464436409:web:81abbee5984e8c69b91b68",
  measurementId: "G-47YEQ6794Q"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();

export {app, auth}
// const analytics = getAnalytics(app);