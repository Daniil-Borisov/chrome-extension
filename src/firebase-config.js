// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDKtB6DaL6jzoPajKLK0sLpgjoz2VpH98I',
  authDomain: 'parity-70570.firebaseapp.com',
  projectId: 'parity-70570',
  storageBucket: 'parity-70570.appspot.com',
  messagingSenderId: '709142109069',
  appId: '1:709142109069:web:097ebaae9543be39f27bc4',
  measurementId: 'G-YEJCK0KJ68',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
