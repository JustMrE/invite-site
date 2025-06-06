import { db } from "../firebase.js";
import { guestsFlat, loadGuestsFromFirebase } from "../index.js";
import { syncGuestRelations } from "./relations.js";

export function saveNewGuest() {
  const name = document.getElementById("guestName").value.trim();
  if (!name) return alert("Введите имя");

  const inviteNumber = document.getElementById("inviteNumber").value.trim();
  const guestRef = db.ref("guests").push();
  const newGuestId = guestRef.key;

  const guest = {
    guestName: name,
    inviteNumber: inviteNumber || "",
    relations: {},
  };

  const modal = document.getElementById("addGuestModal");
  const relationSection = modal.querySelector(".relation-section");
  const type = relationSection.querySelector("select")?.value;
  const relatedName = relationSection.querySelector("input")?.value.trim();

  const relatedGuest = guestsFlat.find(
    (g) => g.guestName.toLowerCase() === relatedName.toLowerCase()
  );

  guestRef.set(guest).then(() => {
    if (relatedGuest && type) {
      syncGuestRelations(newGuestId, type, relatedGuest.id).then(() => {
        bootstrap.Modal.getInstance(modal).hide();
        loadGuestsFromFirebase();
      });
    } else if (relatedName && !relatedGuest && type) {
      const newRelatedRef = db.ref("guests").push();
      const newRelatedId = newRelatedRef.key;

      newRelatedRef
        .set({ guestName: relatedName, relations: {} })
        .then(() => syncGuestRelations(newGuestId, type, newRelatedId))
        .then(() => {
          bootstrap.Modal.getInstance(modal).hide();
          loadGuestsFromFirebase();
        });
    } else {
      bootstrap.Modal.getInstance(modal).hide();
      loadGuestsFromFirebase();
    }
  });
}

export function saveEditedGuest() {
  const modal = document.getElementById("editGuestModal");
  const id = modal.dataset.guestId;
  const name = document.getElementById("editGuestName").value.trim();
  const invite = document.getElementById("editInviteNumber").value.trim();

  if (!id || !name) return alert("Имя обязательно");

  const updates = {
    guestName: name,
    inviteNumber: invite,
  };

  db.ref(`guests/${id}`).update(updates).then(() => {
    const relationSection = modal.querySelector(".relation-section");
    const type = relationSection.querySelector("select")?.value;
    const relatedName = relationSection.querySelector("input")?.value.trim();

    if (!type || !relatedName) {
      bootstrap.Modal.getInstance(modal).hide();
      loadGuestsFromFirebase();
      return;
    }

    const relatedGuest = guestsFlat.find(
      (g) => g.guestName.toLowerCase() === relatedName.toLowerCase()
    );

    if (relatedGuest) {
      syncGuestRelations(id, type, relatedGuest.id).then(() => {
        bootstrap.Modal.getInstance(modal).hide();
        loadGuestsFromFirebase();
      });
    } else {
      const newRelatedRef = db.ref("guests").push();
      const newRelatedId = newRelatedRef.key;

      newRelatedRef
        .set({ guestName: relatedName, relations: {} })
        .then(() => syncGuestRelations(id, type, newRelatedId))
        .then(() => {
          bootstrap.Modal.getInstance(modal).hide();
          loadGuestsFromFirebase();
        });
    }
  });
}
