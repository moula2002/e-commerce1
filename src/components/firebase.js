// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpjMz_gzDUtdLtBryB1hDBccT7vgqRYaE",
  authDomain: "sadhana-cart.firebaseapp.com",
  projectId: "sadhana-cart",
  storageBucket: "sadhana-cart.appspot.com",
  messagingSenderId: "126398142924",
  appId: "1:126398142924:web:9ff3415ca18ad24b85a569",
  measurementId: "G-GQ40SLFB85",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db };
