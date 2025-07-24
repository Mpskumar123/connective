import { initializeApp } from "firebase/app"; 
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyArUuqHrOLD7tOvKB-nzEFxGoYz_1peMv0",
  authDomain: "connect-you-8edbf.firebaseapp.com",
  projectId: "connect-you-8edbf",
  storageBucket: "connect-you-8edbf.appspot.com",
  messagingSenderId: "263548267571",
  appId: "1:263548267571:web:5e675d8f14f5bba5f90746",
  measurementId: "G-98ZB5ZQNLG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


// Export auth and providers
export { auth, googleProvider, facebookProvider };
