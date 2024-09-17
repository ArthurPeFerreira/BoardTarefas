import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADh2roPC7f4DOR6cFb7CScdcbl1vJK52k",
  authDomain: "nexttarefasplus.firebaseapp.com",
  projectId: "nexttarefasplus",
  storageBucket: "nexttarefasplus.appspot.com",
  messagingSenderId: "185765389941",
  appId: "1:185765389941:web:02928e47291997affbfa3c"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); 

export {db};