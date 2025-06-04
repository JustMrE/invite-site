// /js/ui/table.js
import { allGuests } from "../state.js";
import { openEditModal } from "../ui/modals.js";

export function createTableHeader(guest) {
  const thead = document.querySelector("#guestTable thead");
  thead.innerHTML = `
    <tr>
      <th>№</th>
      ${Object.keys(guest).map(k => k !== 'relations' ? `<th>${k}</th>` : '').join('')}
      <th></th>
    </tr>
  `;
}

export function createGuestRow(index, key, guest) {
  const tr = document.createElement("tr");
  tr.setAttribute("draggable", "true");
  tr.dataset.id = key;

  tr.innerHTML = `
    <td>${index + 1}</td>
    ${Object.entries(guest).map(([k, v]) =>
    k !== 'relations' ? `<td>${v || ""}</td>` : ''
  ).join('')}
    <td>
      <button class="btn btn-sm btn-warning edit-btn" data-id="${key}">
        Редактировать
      </button>
    </td>
  `;

  tr.querySelector(".edit-btn").addEventListener("click", () => openEditModal(key, guest));

  return tr;
}
