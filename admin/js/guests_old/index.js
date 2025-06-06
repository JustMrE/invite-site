import { initFirebase } from "./firebase.js";
import { createAddGuestModal, openEditModal } from "./ui/modals.js";
import { createGuestRow, createGuestTableHeader } from "./ui/table.js";
import { saveNewGuest, saveEditedGuest } from "./logic/guest-form.js";
import { handleExcelImport } from "./logic/excel-import.js";
import { initDragRelations } from "./logic/drag-relations.js";

export let guestsFlat = [];

window.guestsFlat = guestsFlat; // для глобального поиска

document.addEventListener("DOMContentLoaded", async () => {
  initFirebase();
  await loadGuestsFromFirebase();
  createAddGuestModal();
  initDragRelations();

  document
    .getElementById("saveGuestBtn")
    ?.addEventListener("click", saveNewGuest);

  document
    .getElementById("editSaveGuestBtn")
    ?.addEventListener("click", saveEditedGuest);

  document
    .getElementById("excelFileInput")
    ?.addEventListener("change", handleExcelImport);
});

export async function loadGuestsFromFirebase() {
  const snapshot = await firebase.database().ref("guests").once("value");
  const data = snapshot.val() || {};
  guestsFlat = Object.entries(data).map(([id, guest]) => ({ ...guest, id }));
  window.guestsFlat = guestsFlat;

  renderGuestTable(guestsFlat);
}

function renderGuestTable(guests) {
  const tbody = document.querySelector("#guestTable tbody");
  const thead = document.querySelector("#guestTable thead tr");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (guests.length === 0) return;

  createGuestTableHeader(thead, guests[0]);

  guests.forEach((guest, index) => {
    const row = createGuestRow(guest, index + 1, openEditModal);
    tbody.appendChild(row);
  });
}
