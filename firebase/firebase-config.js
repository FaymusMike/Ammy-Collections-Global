// /firebase/firebase-config.js
// Firebase Configuration File

const firebaseConfig = {
  apiKey: "AIzaSyDglHnShrm1XUNoqTwQDHfINQBynYTgD8Q",
  authDomain: "myfilesync-2ac31.firebaseapp.com",
  databaseURL: "https://myfilesync-2ac31-default-rtdb.firebaseio.com",
  projectId: "myfilesync-2ac31",
  storageBucket: "myfilesync-2ac31.firebasestorage.app",
  messagingSenderId: "1059822630282",
  appId: "1:1059822630282:web:8ab303732ff172f7e54473"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Enable offline persistence for better performance
db.enablePersistence()
    .then(() => console.log('Firestore persistence enabled'))
    .catch(err => console.log('Persistence error:', err));

console.log('Firebase initialized successfully');