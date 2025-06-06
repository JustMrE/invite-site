// /js/logic/excel-import.js
import { db } from "../firebase.js";
import { loadGuestsFromFirebase } from "../main.js";

export function handleExcelImport(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const guests = XLSX.utils.sheet_to_json(sheet);

    const updates = {};
    guests.forEach((guest) => {
      const id = db.ref("guests").push().key;
      updates[`guests/${id}`] = {
        guestName: guest["Имя"] || "",
        inviteNumber: guest["Приглашение"] || "",
      };
    });

    db.ref().update(updates).then(() => {
      bootstrap.Modal.getInstance(document.getElementById("addGuestModal")).hide();
      loadGuestsFromFirebase();
    });
  };

  reader.readAsArrayBuffer(file);
}
