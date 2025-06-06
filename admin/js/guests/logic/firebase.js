let db = null;

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyAXb5k4WAUbXI3zlXt-J0jPprO837zr8v8",
    authDomain: "toiinvite2025.firebaseapp.com",
    databaseURL: "https://toiinvite2025-default-rtdb.firebaseio.com",
    projectId: "toiinvite2025",
    storageBucket: "toiinvite2025.appspot.com",
    messagingSenderId: "228773799390",
    appId: "1:228773799390:web:2ae10163590ff87e1c294f",
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
}

export { initializeFirebase, db };