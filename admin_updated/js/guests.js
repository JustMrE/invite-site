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
const baseLink = `${location.origin}/invite-site`;
const tbody = document.getElementById("guestTableBody");
const sortField = document.getElementById("sortField");
const searchInput = document.getElementById("searchInput");
const tableHead = document.getElementById("tableHead");
const groupGuestsToggle = document.getElementById("groupGuestsToggle");
groupGuestsToggle.onchange = renderGuests;

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
let columnVisibility = {
  index: true,
  group: true,
  created: true,
  name: true,
  type: true,
  status: true,
  actions: true,
};

function renderColumnSettings() {
  columnSettingsBody.innerHTML = "";
  for (const key in columnVisibility) {
    const labelMap = {
      index: "№",
      group: "Номер приглашения",
      created: "Дата",
      name: "Имя",
      type: "Тип",
      status: "Статус",
      actions: "Действия",
    };
    const row = document.createElement("div");
    row.className = "form-check";
    row.innerHTML = `
      <input class="form-check-input" type="checkbox" value="${key}" id="col-${key}" ${
      columnVisibility[key] ? "checked" : ""
    }>
      <label class="form-check-label" for="col-${key}">${labelMap[key]}</label>
    `;
    row.querySelector("input").addEventListener("change", (e) => {
      columnVisibility[key] = e.target.checked;
      renderGuests();
    });
    columnSettingsBody.appendChild(row);
  }
}

document.getElementById("toggleColumnsBtn").onclick = () => {
  renderColumnSettings();
  columnSettingsModal.show();
};

function updateTableHeader() {
  const ths = tableHead.querySelector("tr").children;
  Array.from(ths).forEach((th) => {
    const col = th.dataset.column;
    if (!col || columnVisibility[col]) th.style.display = "";
    else th.style.display = "none";
  });
}

function renderGuests() {
  tbody.innerHTML = "";

  const guestsFlat = [];
  invitesCache.forEach((invite) => {
    invite.guests.forEach((guest) => {
      guestsFlat.push({
        groupId: invite.id,
        created: invite.created,
        type: invite.type,
        guestName: guest,
        guestStatus: invite.status || "pending",
      });
    });
  });

  const searchTerm = searchInput.value.toLowerCase();

  let filtered;

  if (groupGuestsToggle.checked) {
    // Шаг 1: находим группы, где хотя бы один гость совпадает
    const matchingGroupIds = new Set();

    guestsFlat.forEach((g) => {
      if (g.guestName.toLowerCase().includes(searchTerm)) {
        matchingGroupIds.add(g.groupId);
      }
    });

    // Шаг 2: берём всех гостей из найденных групп
    filtered = guestsFlat.filter((g) => matchingGroupIds.has(g.groupId));
  } else {
    // Обычный поиск
    filtered = guestsFlat.filter((g) =>
      g.guestName.toLowerCase().includes(searchTerm)
    );
  }

  const sortKey = sortField.value;
  // Сортировка
  if (groupGuestsToggle.checked) {
    // Шаг 1: обычная сортировка по выбранному полю
    filtered.sort((a, b) => {
      if (sortKey === "name")
        return (a.guestName || "").localeCompare(b.guestName || "");
      if (sortKey === "created")
        return new Date(b.created) - new Date(a.created);
      if (sortKey === "type") return a.type.localeCompare(b.type);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });

    // Шаг 2: сгруппировать в порядке появления по groupId
    const grouped = {};
    filtered.forEach((g) => {
      if (!grouped[g.groupId]) grouped[g.groupId] = [];
      grouped[g.groupId].push(g);
    });

    // Собираем обратно, но уже с группами подряд
    filtered = Object.values(grouped).flat();
  } else {
    // Простая сортировка без группировки
    filtered.sort((a, b) => {
      if (sortKey === "name")
        return (a.guestName || "").localeCompare(b.guestName || "");
      if (sortKey === "created")
        return new Date(b.created) - new Date(a.created);
      if (sortKey === "type") return a.type.localeCompare(b.type);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return 0;
    });
  }

  const statusMap = {
    yes: { text: "Қатысады", class: "status-yes" },
    no: { text: "Қатыспайды", class: "status-no" },
    pending: { text: "Жауап жоқ", class: "status-pending" },
  };
  let lastGroupId = null;

  filtered.forEach((guest, index) => {
    const tr = document.createElement("tr");
    const statusInfo = statusMap[guest.guestStatus] || statusMap.pending;

    // Обводка, если новый groupId (и включён чекбокс группировки)
    if (groupGuestsToggle.checked && guest.groupId !== lastGroupId) {
      tr.classList.add("grouped-row");
    }
    lastGroupId = guest.groupId;

    if (columnVisibility.index) tr.innerHTML += `<td>${index + 1}</td>`;
    if (columnVisibility.group) tr.innerHTML += `<td>${guest.groupId}</td>`;
    if (columnVisibility.created) tr.innerHTML += `<td>${guest.created}</td>`;
    if (columnVisibility.name) tr.innerHTML += `<td>${guest.guestName}</td>`;
    if (columnVisibility.type)
      tr.innerHTML += `<td>${
        guest.type === "named" ? "Именной" : "Неименной"
      }</td>`;

    if (columnVisibility.status) {
      tr.innerHTML += `<td><span class='${statusInfo.class}'>${statusInfo.text}</span></td>`;
    }

    if (columnVisibility.actions) {
      const td = document.createElement("td");

      td.innerHTML = `
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-primary" onclick="openInvite('${guest.groupId}')">Открыть</button>
          <button class="btn btn-sm btn-secondary" onclick="shareInvite('${guest.groupId}')">Поделиться</button>
          <button class="btn btn-sm btn-warning" onclick="editInvite('${guest.groupId}')">Редактировать</button>
        </div>`;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });

  updateTableHeader();
}

function openInvite(id) {
  const link = `${baseLink}/index.html?invite=${id}`;
  window.open(link, "_blank");
}

function shareInvite(id) {
  const link = `${baseLink}/index.html?invite=${id}`;
  navigator.share
    ? navigator.share({ title: "Приглашение", url: link })
    : prompt("Скопируйте ссылку:", link);
}

function editInvite(id) {
  currentEditingId = id;
  const data = invitesCache.find((i) => i.id === id);
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
  const guests = Array.from(guestInputsContainer.querySelectorAll("input"))
    .map((input) => ({
      name: input.value.trim(),
      status: "pending",
    }))
    .filter((g) => g.name);
  db.ref("invites/" + currentEditingId).update({ guests });
  editModal.hide();
};

deleteInviteBtn.onclick = () => {
  if (confirm("Удалить приглашение?")) {
    db.ref("invites/" + currentEditingId).remove();
    editModal.hide();
  }
};

shareInviteBtn.onclick = () => {
  shareInvite(currentEditingId);
  // const link = `${location.origin}/invite-site/invite.html?invite=${currentEditingId}`;
  // navigator.share
  //   ? navigator.share({ title: "Приглашение", url: link })
  //   : prompt("Скопируйте ссылку:", link);
};

searchInput.oninput = renderGuests;
sortField.onchange = renderGuests;

db.ref("invites").on("value", (snapshot) => {
  invitesCache = [];
  snapshot.forEach((child) => {
    invitesCache.push({ id: child.key, ...child.val() });
  });
  renderGuests();
});
