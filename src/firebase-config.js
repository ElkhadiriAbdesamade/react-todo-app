import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
import {getAuth,GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBI7n7o_n6XeRt3wtcL-ckgd6ZmT523xiM",
    authDomain: "todo-firebase-94ca0.firebaseapp.com",
    projectId: "todo-firebase-94ca0",
    storageBucket: "todo-firebase-94ca0.appspot.com",
    messagingSenderId: "718538193915",
    appId: "1:718538193915:web:c0ce8690ab816e283de95e",
    measurementId: "G-S7X8YTX225"
  };

  const app = initializeApp(firebaseConfig);
  const auth=getAuth(app);
  const provider=new GoogleAuthProvider();

  export const db =getFirestore(app);
  export {auth,provider};