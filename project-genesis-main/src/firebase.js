// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB7hW3ZotG6Hgz-j9ebT6E9Xf6s2aP4bLM",
    authDomain: "stock-advisor-efb38.firebaseapp.com",
    projectId: "stock-advisor-efb38",
    storageBucket: "stock-advisor-efb38.firebasestorage.app",
    messagingSenderId: "381037834728",
    appId: "1:381037834728:web:52be524ea57cbeb530345d",
    measurementId: "G-0RKSW6NCJD"
};

console.log("FIREBASE CONFIG (runtime):", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKey: firebaseConfig.apiKey ? "present" : "missing",
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);