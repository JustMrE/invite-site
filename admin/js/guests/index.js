import { initializeFirebase, db } from './logic/firebase.js';
import { saveGuest, loadGuests } from './logic/guest-form.js';

initializeFirebase();
document.getElementById("saveGuestBtn").addEventListener("click", saveGuest);
window.addEventListener("DOMContentLoaded", loadGuests);