import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4PWHWsENLuUPnBVIzo8U8nkDXVA2fTqI",
  authDomain: "novo-placar-premiado.firebaseapp.com",
  projectId: "novo-placar-premiado",
  storageBucket: "novo-placar-premiado.firebasestorage.app",
  messagingSenderId: "597865499198",
  appId: "1:597865499198:web:fe2274064f70f681bd5f6f"
};

const app = initializeApp(firebaseConfig);

window.auth = getAuth(app);
window.db = getFirestore(app);

window.createUserWithEmailAndPassword =
  createUserWithEmailAndPassword;

window.signInWithEmailAndPassword =
  signInWithEmailAndPassword;

window.signOut = signOut;

window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
