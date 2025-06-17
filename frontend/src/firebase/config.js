// frontend/src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAk3iTsGwdruGQ_-qTMoB8Hn2yX3i69HFs",
  authDomain: "turmux-chat.firebaseapp.com",
  databaseURL: "https://turmux-chat-default-rtdb.firebaseio.com",
  projectId: "turmux-chat",
  storageBucket: "turmux-chat.firebasestorage.app",
  messagingSenderId: "748625868137",
  appId: "1:748625868137:web:1c0162540dbd38d95879f8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };