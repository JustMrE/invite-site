// /js/logic/drag-relations.js
import { db } from "../firebase.js";
import { loadGuestsFromFirebase } from "../main.js";

let draggedId = null;

export function enableGuestDragAndDrop(tr, guestId) {
  tr.setAttribute("draggable", "true");

  tr.addEventListener("dragstart", () => {
    draggedId = guestId;
  });

  tr.addEventListener("dragover", (e) => {
    e.preventDefault();
    tr.classList.add("table-active");
  });

  tr.addEventListener("dragleave", () => {
    tr.classList.remove("table-active");
  });

  tr.addEventListener("drop", () => {
    tr.classList.remove("table-active");
    if (draggedId && draggedId !== guestId) {
      const confirmType = prompt("Введите тип связи (например: wife, husband, child):");
      if (confirmType) {
        applyDragRelation(draggedId, guestId, confirmType);
      }
    }
  });
}

function applyDragRelation(fromId, toId, type) {
  const updates = {};
  updates[`guests/${fromId}/relations/${type}`] = toId;
  db.ref().update(updates).then(() => {
    loadGuestsFromFirebase();
  });
}
