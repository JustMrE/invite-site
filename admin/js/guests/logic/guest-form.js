// /js/logic/guest-form.js
import { db } from "../firebase.js";
import { syncGuestRelations } from "./relations.js";
import { loadGuestsFromFirebase } from "../main.js";

export function saveNewGuest() {
  const name = document.getElementById("guestName").value.trim();
  if (!name) return alert("Введите имя");

  const id = db.ref("guests").push().key;
  const guest = { guestName: name };

  db.ref(`guests/${id}`).set(guest).then(() => {
    bootstrap.Modal.getInstance(document.getElementById("addGuestModal")).hide();
    loadGuestsFromFirebase();
  });
}

export function saveEditedGuest(id) {
  const name = document.getElementById("editGuestName").value.trim();
  const invite = document.getElementById("editInviteNumber").value.trim();

  const updatedGuest = {
    guestName: name,
    inviteNumber: invite,
  };

  db.ref(`guests/${id}`).update(updatedGuest).then(() => {
    syncGuestRelations(id).then(() => {
      bootstrap.Modal.getInstance(document.getElementById("editGuestModal")).hide();
      loadGuestsFromFirebase();
    });
  });
}
