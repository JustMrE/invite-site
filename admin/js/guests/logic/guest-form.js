import { db } from './firebase.js';

function saveGuest() {
  const name = document.getElementById("guestName").value.trim();
  const invite = document.getElementById("inviteNumber").value.trim();
  if (!name) return;

  const newGuestRef = db.ref("guests").push();
  newGuestRef.set({ guestName: name, invite });
  document.getElementById("guestName").value = "";
  document.getElementById("inviteNumber").value = "";
}

function loadGuests() {
  const tbody = document.querySelector("#guestTable tbody");
  tbody.innerHTML = "";
  db.ref("guests").once("value", (snapshot) => {
    const guests = snapshot.val();
    if (!guests) return;
    Object.entries(guests).forEach(([id, guest], index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${index + 1}</td><td>${guest.guestName}</td><td>${guest.invite}</td><td></td>`;
      tbody.appendChild(tr);
    });
  });
}

export { saveGuest, loadGuests };