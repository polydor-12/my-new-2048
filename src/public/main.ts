import { Board } from "./board";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBON6fZeF7ZhBfDqbF8dyryygDZuwIKK_s",
  authDomain: "my-new-2048.firebaseapp.com",
  projectId: "my-new-2048",
  storageBucket: "my-new-2048.firebasestorage.app",
  messagingSenderId: "98325527744",
  appId: "1:98325527744:web:45e48309790813cf49c125",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("main.ts loaded");

const board = new Board();
