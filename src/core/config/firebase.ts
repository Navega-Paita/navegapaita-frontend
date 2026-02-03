// src/core/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA3G-mTYMF7D9SxM7iXvsLHGitSVNhhpSo",
    authDomain: "navega-paita-b7c91.firebaseapp.com",
    databaseURL: "https://navega-paita-b7c91-default-rtdb.firebaseio.com",
    projectId: "navega-paita-b7c91",
    storageBucket: "navega-paita-b7c91.firebasestorage.app",
    messagingSenderId: "1091887332208",
    appId: "1:1091887332208:web:b2465b49bfd88aa0f06db5"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);