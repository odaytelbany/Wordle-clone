import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'; 


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCApxzdQ4qMpdNVSfIVLk2b8sFwaJDXUpk",
    authDomain: "wordle-clone-d0a1d.firebaseapp.com",
    projectId: "wordle-clone-d0a1d",
    storageBucket: "wordle-clone-d0a1d.firebasestorage.app",
    messagingSenderId: "204608826958",
    appId: "1:204608826958:web:819347366dc96838cf5d1f"
};

const app = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(app);
