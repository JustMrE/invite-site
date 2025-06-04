import { db } from "./firebase.js";
import { createGuestRow, createGuestTableHeader } from "./ui/table.js";
import { createAddGuestModal, openEditModal } from "./ui/modals.js";
import { saveNewGuest, saveEditedGuest } from "./logic/guest-form.js";
import { handleExcelImport } from "./logic/excel-import.js";
import { enableGuestDragAndDrop } from "./logic/drag-relations.js";

export let guestsFlat = [];

export function loadGuestsFromFirebase() {
  db.ref("guests").once("value", (snapshot) => {
    const data = snapshot.val() || {};
    guestsFlat = Object.entries(data).map(([id, guest]) => ({ id, ...guest }));

    const tbody = document.querySelector("#guestTable tbody");
    const thead = document.querySelector("#guestTable thead");

    tbody.innerHTML = "";
    thead.innerHTML = "";
    thead.appendChild(createGuestTableHeader(guestsFlat));

    guestsFlat.forEach((guest, index) => {
      const tr = createGuestRow(guest, index);
      enableGuestDragAndDrop(tr, guest.id);
      tbody.appendChild(tr);
    });
  });
}

window.openEditModal = openEditModal;

document.addEventListener("DOMContentLoaded", () => {
  createAddGuestModal(); // создание модалки
  loadGuestsFromFirebase();

  document
    .getElementById("saveGuestBtn")
    ?.addEventListener("click", () => saveNewGuest());

  document
    .getElementById("editSaveGuestBtn")
    ?.addEventListener("click", () => saveEditedGuest());

  document
    .getElementById("excelFileInput")
    ?.addEventListener("change", (e) => handleExcelImport(e.target));
});
