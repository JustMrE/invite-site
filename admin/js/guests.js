// Guests.js — логика работы страницы гостей

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAXb5k4WAUbXI3zlXt-J0jPprO837zr8v8",
  authDomain: "toiinvite2025.firebaseapp.com",
  databaseURL: "https://toiinvite2025-default-rtdb.firebaseio.com",
  projectId: "toiinvite2025",
  storageBucket: "toiinvite2025.appspot.com",
  messagingSenderId: "228773799390",
  appId: "1:228773799390:web:2ae10163590ff87e1c294f",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Элементы
const tbody = document.getElementById("guestTableBody");
const sortField = document.getElementById("sortField");
const searchInput = document.getElementById("searchInput");
const toggleColumnsBtn = document.getElementById("toggleColumnsBtn");
const tableHead = document.getElementById("tableHead");

// Модалка редактирования
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const modalInviteId = document.getElementById("modalInviteId");
const guestInputsContainer = document.getElementById("guestInputsContainer");
const addGuestBtn = document.getElementById("addGuestBtn");
const saveInviteBtn = document.getElementById("saveInviteBtn");
const deleteInviteBtn = document.getElementById("deleteInviteBtn");
const shareInviteBtn = document.getElementById("shareInviteBtn");

// Модалка колонок
const columnSettingsModal = new bootstrap.Modal(
  document.getElementById("columnSettingsModal")
);
const columnSettingsBody = document.getElementById("columnSettingsBody");

let currentEditingId = null;
let invitesCache = [];
let columnVisibility = { created: true, name: true, type: true, status: true };

// Редактирование гостей
addGuestBtn.onclick = () => {
  const div = document.createElement("div");
  div.className = "input-group mb-2";
  div.innerHTML = `
    <input type="text" class="form-control" placeholder="Имя гостя" />
    <button class="btn btn-outline-danger" type="button">✕</button>
  `;
  div.querySelector("button").onclick = () => div.remove();
  guestInputsContainer.appendChild(div);
};

saveInviteBtn.onclick = () => {
  if (!currentEditingId) return;
  const guestNames = Array.from(guestInputsContainer.querySelectorAll("input"))
    .map((input) => input.value.trim())
    .filter((name) => name);

  db.ref(`invites/${currentEditingId}/guests`)
    .set(guestNames)
    .then(() => {
      editModal.hide();
      loadAndRender();
    });
};

deleteInviteBtn.onclick = () => {
  if (!currentEditingId) return;
  if (confirm("Удалить это приглашение?")) {
    db.ref(`invites/${currentEditingId}`)
      .remove()
      .then(() => {
        editModal.hide();
        loadAndRender();
      });
  }
};

shareInviteBtn.onclick = () => {
  const link = `${location.origin}/invite.html?invite=${currentEditingId}`;
  navigator.share
    ? navigator.share({ title: "Приглашение", url: link })
    : prompt("Скопируйте ссылку:", link);
};

function openEditModal(id, data) {
  currentEditingId = id;
  modalInviteId.textContent = id;
  guestInputsContainer.innerHTML = "";
  (data.guests || []).forEach((name) => {
    const div = document.createElement("div");
    div.className = "input-group mb-2 guest-input";
    div.innerHTML = `
      <span class="input-group-text drag-handle">☰</span>
      <input type="text" class="form-control" value="${name}" />
      <button class="btn btn-outline-danger" type="button">✕</button>
    `;
    div.querySelector("button").onclick = () => div.remove();
    guestInputsContainer.appendChild(div);
  });
  editModal.show();
}

new Sortable(guestInputsContainer, {
  handle: ".drag-handle",
  animation: 150,
});

const statusMap = {
  yes: { text: "Қатысады", class: "status-yes" },
  no: { text: "Қатыспайды", class: "status-no" },
  pending: { text: "Жауап жоқ", class: "status-pending" },
};

function renderTable() {
  tbody.innerHTML = "";
  const field = sortField.value;
  let list = [...invitesCache];

  // Фильтрация
  const search = searchInput.value.toLowerCase();
  if (search) {
    list = list.filter((inv) =>
      inv.guests.some((g) => g.toLowerCase().includes(search))
    );
  }

  // Сортировка
  list.sort((a, b) => {
    if (field === "name")
      return (a.guests[0] || "").localeCompare(b.guests[0] || "");
    if (field === "created") return new Date(b.created) - new Date(a.created);
    if (field === "type") return a.type.localeCompare(b.type);
    if (field === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  for (const { id, created, guests, type, status } of list) {
    const createdStr = new Date(created).toLocaleString();
    const statusInfo = statusMap[status] || statusMap.pending;
    const typeText = type === "named" ? "Именной" : "Неименной";

    const groupHeader = document.createElement("tr");
    groupHeader.className = "group-header";
    groupHeader.innerHTML = `
      <td colspan="5">
        <span class="me-2">Пригласительный #${id}</span>
        <button class="btn btn-sm btn-outline-primary float-end " onclick="window.open('${
          location.origin
        }/invite.html?invite=${id}', '_blank')">Открыть</button>
        <button class="btn btn-sm btn-outline-primary float-end me-2" onclick="navigator.share ? navigator.share({ title: 'Приглашение', url: '${
          location.origin
        }/invite.html?invite=${id}' }) : alert('Поддержка недоступна')")">Поделиться</button>
        <button class="btn btn-sm btn-outline-secondary float-end" onclick='openEditModal("${id}", ${JSON.stringify(
      { guests }
    )})'>Редактировать</button>
      </td>`; //<button class="btn btn-sm btn-outline-primary float-end me-2" onclick="navigator.clipboard.writeText('${location.origin}/invite.html?invite=${id}')">Поделиться</button>
    tbody.appendChild(groupHeader);

    guests.forEach((name) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        ${columnVisibility.created ? `<td>${createdStr}</td>` : ""}
        ${columnVisibility.name ? `<td>${name}</td>` : ""}
        ${columnVisibility.type ? `<td>${typeText}</td>` : ""}
        ${
          columnVisibility.status
            ? `<td><span class='${statusInfo.class}'>${statusInfo.text}</span></td>`
            : ""
        }
      `;
      tbody.appendChild(tr);
    });
  }

  updateTableHeader();
}

function updateTableHeader() {
  const ths = tableHead.querySelector("tr").children;
  Array.from(ths).forEach((th) => {
    const col = th.dataset.column;
    if (!col || columnVisibility[col]) th.style.display = "";
    else th.style.display = "none";
  });
}

function openColumnSettings() {
  columnSettingsBody.innerHTML = "";
  for (const [key, visible] of Object.entries(columnVisibility)) {
    const id = `col-${key}`;
    const label =
      key === "created"
        ? "Дата"
        : key === "name"
        ? "Имя"
        : key === "type"
        ? "Тип"
        : "Статус";
    columnSettingsBody.innerHTML += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="${id}" ${
      visible ? "checked" : ""
    }>
        <label class="form-check-label" for="${id}">${label}</label>
      </div>
    `;
  }
  columnSettingsModal.show();
}

document
  .getElementById("columnSettingsModal")
  .addEventListener("change", (e) => {
    const id = e.target.id?.replace("col-", "");
    if (id && id in columnVisibility) {
      columnVisibility[id] = e.target.checked;
      renderTable();
    }
  });

toggleColumnsBtn.onclick = openColumnSettings;
sortField.onchange = renderTable;
searchInput.oninput = renderTable;

function loadAndRender() {
  db.ref("invites")
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val() || {};
      invitesCache = Object.entries(data).map(([id, invite]) => ({
        id,
        created: invite.created || new Date().toISOString(),
        guests: invite.guests || [],
        type: invite.type || "named",
        status: invite.status || "pending",
      }));
      renderTable();
    });
}

loadAndRender();
