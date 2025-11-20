// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk-5SCVwPovjDczDTcybyFbZ_em47tORw",
  authDomain: "rodriguezortizjonathanobed.firebaseapp.com",
  projectId: "rodriguezortizjonathanobed",
  storageBucket: "rodriguezortizjonathanobed.firebasestorage.app",
  messagingSenderId: "109191632952",
  appId: "1:109191632952:web:b1b838015c8445366e6ecd",
  measurementId: "G-2CE4NTT3GT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth - ¡ASÍ SE HACE CORRECTAMENTE!
export const auth = getAuth(app);

// Opcional: exportar la app también
