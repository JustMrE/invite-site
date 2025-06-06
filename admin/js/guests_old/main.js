// /js/main.js
import { db } from "./firebase.js";
import { setAllGuests } from "./state.js";
import { createAddGuestModal } from "./ui/modals.js";
import { createGuestRow, createGuestTableHeader } from "./ui/table.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addGuestButton").addEventListener("click", createAddGuestModal);
  loadGuestsFromFirebase();
});

export function loadGuestsFromFirebase() {
  db.ref("guests").once("value").then((snapshot) => {
    const data = snapshot.val();
    setAllGuests(data || {});
    const tbody = document.querySelector("#guestTable tbody");
    tbody.innerHTML = "";

    if (!data) return;

    const entries = Object.entries(data);
    const firstGuest = entries[0][1];
    createGuestTableHeader(firstGuest);
    entries.forEach(([key, guest], index) => {
      const tr = createGuestRow(index, key, guest);
      tbody.appendChild(tr);
    });
  });
}
