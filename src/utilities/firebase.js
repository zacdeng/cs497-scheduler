
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
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