export function createGuestTableHeader(thead, guestSample) {
  const fields = Object.keys(guestSample).filter(
    (key) => key !== "id" && key !== "relations"
  );

  const columns = ["№", ...fields.map(mapFieldName), ""];

  for (const name of columns) {
    const th = document.createElement("th");
    th.textContent = name;
    thead.appendChild(th);
  }
}

export function createGuestRow(guest, index, onEdit) {
  const tr = document.createElement("tr");

  const numberCell = document.createElement("td");
  numberCell.textContent = index;
  tr.appendChild(numberCell);

  for (const key in guest) {
    if (key === "id" || key === "relations") continue;

    const td = document.createElement("td");
    td.textContent = guest[key] || "";
    tr.appendChild(td);
  }

  const editCell = document.createElement("td");
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-sm btn-warning";
  editBtn.textContent = "✏️";
  editBtn.addEventListener("click", () => onEdit(guest.id));
  editCell.appendChild(editBtn);
  tr.appendChild(editCell);

  tr.dataset.guestId = guest.id;
  tr.draggable = true;

  return tr;
}

function mapFieldName(key) {
  switch (key) {
    case "guestName":
    case "name":
      return "Имя";
    case "inviteNumber":
      return "Приглашение";
    default:
      return key;
  }
}
