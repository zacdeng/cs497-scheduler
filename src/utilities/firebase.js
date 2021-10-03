
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Default firebaseConfig from Firebase Web Console 
const firebaseConfig = {
    apiKey: "AIzaSyCgHUCMopCTDYxv7v39jXSiTpZibzpn6yc",
    authDomain: "zachary-cs-scheduler.firebaseapp.com",
    databaseURL: "https://zachary-cs-scheduler-default-rtdb.firebaseio.com",
    projectId: "zachary-cs-scheduler",
    storageBucket: "zachary-cs-scheduler.appspot.com",
    messagingSenderId: "790970255783",
    appId: "1:790970255783:web:188033846a91b69fbb0e82",
    measurementId: "G-0D4WF8L8XY"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// 1. Access the data with a database reference not a URL.
// 2. You don't get data directly. Instead, you subscribe to the database, by giving Firebase a function to call when the data changes. 
//    That function normally will update a state variable.
export const useData = (path, transform) => {
    // Define three state variables: data, loading, error
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);

      //This code below prints to the browser console whenever data is requested from Firebase. 
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`devMode loading path : ${path}`); }

      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        //This code below prints to the browser console whenever data is requested from Firebase. 
        if (devMode) { console.log(val); }

        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
  
    return [user];
};