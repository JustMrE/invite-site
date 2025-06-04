// /js/ui/modals.js
import { saveNewGuest, saveEditedGuest } from "../logic/guest-form.js";
import { allGuests } from "../state.js";
import { handleExcelImport } from "../logic/excel-import.js";

document.getElementById("excelFileInput").addEventListener("change", (e) => {
  handleExcelImport(e.target);
});

export function createAddGuestModal() {
  const nameInput = document.getElementById("guestName");
  nameInput.value = "";

  const saveBtn = document.getElementById("saveGuestBtn");
  saveBtn.onclick = () => saveNewGuest();
}

export function openEditModal(id, guest) {
  document.getElementById("editGuestName").value = guest.guestName || "";
  document.getElementById("editInviteNumber").value = guest.inviteNumber || "";

  const saveBtn = document.getElementById("editSaveGuestBtn");
  const deleteBtn = document.getElementById("deleteGuestBtn");

  saveBtn.onclick = () => saveEditedGuest(id);
  deleteBtn.onclick = () => {
    if (confirm("Удалить гостя?")) {
      firebase.database().ref(`guests/${id}`).remove().then(() => {
        bootstrap.Modal.getInstance(document.getElementById("editGuestModal")).hide();
        location.reload();
      });
    }
  };

  const modal = new bootstrap.Modal(document.getElementById("editGuestModal"));
  modal.show();
}
