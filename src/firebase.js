// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAXH1yBaYvCRdeGD8Drj24-Y5adpxHT-0U",
  authDomain: "my-recommend-f4a69.firebaseapp.com",
  databaseURL: "https://my-recommend-f4a69-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-recommend-f4a69",
  storageBucket: "my-recommend-f4a69.firebasestorage.app",
  messagingSenderId: "945476678727",
  appId: "1:945476678727:web:a098873bbe26e83d662d62"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);