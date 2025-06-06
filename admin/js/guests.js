// ✅ Firebase инициализация
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

// ✅ Глобальный список всех гостей
let allGuests = {};

// ✅ Загрузка и отображение гостей
function loadGuestsFromFirebase() {
  db.ref("guests").once("value").then((snapshot) => {
    const data = snapshot.val();
    allGuests = data || {};
    const tbody = document.querySelector("#guestTable tbody");
    tbody.innerHTML = "";

    if (!data) return;

    const entries = Object.entries(data);
    const firstGuest = entries[0][1];
    createTableHeader(firstGuest);

    entries.forEach(([key, guest], index) => {
      const tr = createGuestRow(index, key, guest);
      tr.setAttribute("draggable", "true");
      tr.dataset.id = key;

      tr.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("guestId", key);
      });

      tr.addEventListener("dragover", (e) => {
        e.preventDefault();
        tr.classList.add("bg-warning-subtle");
      });

      tr.addEventListener("dragleave", () => {
        tr.classList.remove("bg-warning-subtle");
      });

      tr.addEventListener("drop", (e) => {
        e.preventDefault();
        tr.classList.remove("bg-warning-subtle");

        const sourceId = e.dataTransfer.getData("guestId");
        const targetId = tr.dataset.id;

        if (sourceId === targetId) return;

        showRelationModal(sourceId, targetId);
      });

      tbody.appendChild(tr);

    });
  });
}

// ✅ Создание заголовка таблицы
function createTableHeader(guest) {
  const thead = document.querySelector("#guestTable thead");
  thead.innerHTML = `
    <tr>
      <th>№</th>
      ${Object.keys(guest).map(k => k !== 'relations' ? `<th>${k}</th>` : '').join('')}
      <th></th>
    </tr>
  `;
}

// ✅ Создание строки гостя
function createGuestRow(index, key, guest) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${index + 1}</td>
    ${Object.entries(guest).map(([k, v]) =>
    k !== 'relations' ? `<td>${v || ""}</td>` : ''
  ).join('')}
    <td>
      <button class="btn btn-sm btn-warning edit-btn"
        data-id="${key}"
        data-name="${guest.name || ""}">
        Редактировать
      </button>
    </td>
  `;

  tr.querySelector(".edit-btn").addEventListener("click", () => {
    openEditModal(key, guest);
  });

  return tr;
}

// ✅ Обработка кнопки "Добавить гостя"
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addGuestButton").addEventListener("click", createAddGuestModal);
  loadGuestsFromFirebase();
});

// ✅ Модалка "Добавить гостя"
function createAddGuestModal() {
  const existing = document.getElementById("addGuestModal");
  if (existing) existing.remove();
  if (document.activeElement) document.activeElement.blur();

  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = `
    <div class="modal fade" id="addGuestModal" tabindex="-1" aria-labelledby="addGuestLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addGuestLabel">Добавить гостя</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form id="manualForm">
              <div class="mb-3">
                <label for="guestName" class="form-label">Имя</label>
                <input type="text" class="form-control" id="guestName" required />
              </div>
              <div id="relationsContainer" class="mb-3"></div>
              <button type="button" class="btn btn-outline-secondary btn-sm" id="addRelationBtn">+ Добавить родственника</button>
            </form>
          </div>
          <div class="modal-footer">
            <button id="saveGuestBtn" class="btn btn-primary">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);
  const modalElement = document.getElementById("addGuestModal");
  modalElement.removeAttribute("aria-hidden");

  requestAnimationFrame(() => {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  });

  setTimeout(() => {
    document.getElementById("saveGuestBtn").addEventListener("click", saveNewGuest);
    document.getElementById("addRelationBtn").addEventListener("click", addRelationField);
  }, 0);
}

// ✅ Кнопка "Добавить родственника"
function addRelationField() {
  const container = document.getElementById("relationsContainer");
  const relationId = `relation-${Date.now()}`;
  const wrapper = document.createElement("div");

  wrapper.className = "mb-2 d-flex gap-2 align-items-center";
  wrapper.innerHTML = `
    <select class="form-select form-select-sm" style="width: 120px;" data-type>
      <option value="husband">Муж</option>
      <option value="wife">Жена</option>
      <option value="father">Отец</option>
      <option value="mother">Мать</option>
      <option value="child">Ребёнок</option>
    </select>
    <input type="text" class="form-control form-control-sm" placeholder="Имя гостя..." list="${relationId}" data-name />
    <datalist id="${relationId}">
      ${Object.values(allGuests).map(g => `<option value="${g.name}">`).join("")}
    </datalist>
    <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(wrapper);
}

// ✅ Сохранение гостя и связей
function saveNewGuest() {
  const name = document.getElementById("guestName").value.trim();
  if (!name) return alert("Введите имя");

  const relations = {};
  const relatedUpdates = [];

  const relationWrappers = document.querySelectorAll("#relationsContainer > div");

  relationWrappers.forEach(wrapper => {
    const type = wrapper.querySelector("[data-type]").value;
    const input = wrapper.querySelector("[data-name]");
    const relatedName = input.value.trim();
    if (!relatedName) return;

    const existing = Object.entries(allGuests).find(([gid, g]) => g.name === relatedName);
    let relatedId;

    if (existing) {
      relatedId = existing[0];
    } else {
      relatedId = db.ref("guests").push().key;
      db.ref(`guests/${relatedId}`).set({
        name: relatedName,
        uploadedAt: new Date().toISOString()
      });
    }

    if (type === "child") {
      relations.children = relations.children || [];
      relations.children.push(relatedId);
    } else {
      relations[type] = relatedId;
    }

    const reverseType = {
      husband: "wife",
      wife: "husband",
      mother: "children",
      father: "children",
      child: "parent"
    }[type];

    relatedUpdates.push({ relatedId, reverseType });
  });

  const guestRef = db.ref("guests").push();
  const newGuestId = guestRef.key;

  guestRef.set({
    name,
    relations,
    uploadedAt: new Date().toISOString()
  }).then(() => {
    syncGuestRelations(newGuestId, relatedUpdates, "addGuestModal");
  });
}


function openEditModal(id, guest) {
  const existing = document.getElementById("editGuestModal");
  if (existing) existing.remove();
  if (document.activeElement) document.activeElement.blur();

  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = `
    <div class="modal fade" id="editGuestModal" tabindex="-1" aria-labelledby="editGuestModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editGuestModalLabel">Редактировать гостя</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form id="editForm">
              <div class="mb-3">
                <label for="editGuestName" class="form-label">Имя</label>
                <input type="text" class="form-control" id="editGuestName" value="${guest.name || ""}" required />
              </div>
              <div id="editRelationsContainer" class="mb-3"></div>
              <button type="button" class="btn btn-outline-secondary btn-sm" id="editAddRelationBtn">+ Добавить родственника</button>
            </form>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn btn-danger" id="deleteGuestBtn">Удалить</button>
            <button type="button" class="btn btn-primary" id="editSaveGuestBtn">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);
  const modalElement = document.getElementById("editGuestModal");
  modalElement.removeAttribute("aria-hidden");

  requestAnimationFrame(() => {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  });

  // 🔗 Отобразим уже существующие связи
  if (guest.relations) {
    Object.entries(guest.relations).forEach(([type, value]) => {
      if (Array.isArray(value)) {
        value.forEach(id => addRelationFieldEdit(type, id));
      } else {
        addRelationFieldEdit(type, value);
      }
    });
  }

  // 🧩 Обработчики
  setTimeout(() => {
    document.getElementById("editAddRelationBtn").addEventListener("click", () => addRelationFieldEdit());
    document.getElementById("editSaveGuestBtn").addEventListener("click", () => saveEditedGuest(id));
    document.getElementById("deleteGuestBtn").addEventListener("click", () => {
      if (confirm("Удалить этого гостя?")) {
        db.ref(`guests/${id}`).remove().then(() => {
          bootstrap.Modal.getInstance(modalElement).hide();
          loadGuestsFromFirebase();
        });
      }
    });
  }, 0);
}

function addRelationFieldEdit(type = "husband", guestId = "") {
  const container = document.getElementById("editRelationsContainer");
  const relationId = `relation-${Date.now()}`;
  const name = allGuests[guestId]?.name || "";

  const wrapper = document.createElement("div");
  wrapper.className = "mb-2 d-flex gap-2 align-items-center";
  wrapper.innerHTML = `
    <select class="form-select form-select-sm" style="width: 120px;" data-type>
      <option value="husband" ${type === "husband" ? "selected" : ""}>Муж</option>
      <option value="wife" ${type === "wife" ? "selected" : ""}>Жена</option>
      <option value="father" ${type === "father" ? "selected" : ""}>Отец</option>
      <option value="mother" ${type === "mother" ? "selected" : ""}>Мать</option>
      <option value="child" ${type === "child" ? "selected" : ""}>Ребёнок</option>
    </select>
    <input type="text" class="form-control form-control-sm" placeholder="Имя гостя..." list="${relationId}" data-name value="${name}" />
    <datalist id="${relationId}">
      ${Object.values(allGuests).map(g => `<option value="${g.name}">`).join("")}
    </datalist>
    <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(wrapper);
}

function saveEditedGuest(id) {
  const name = document.getElementById("editGuestName").value.trim();
  if (!name) return alert("Введите имя");

  const relations = {};
  const relatedUpdates = [];
  const previousRelations = allGuests[id]?.relations || {};

  const relationWrappers = document.querySelectorAll("#editRelationsContainer > div");

  relationWrappers.forEach(wrapper => {
    const type = wrapper.querySelector("[data-type]").value;
    const input = wrapper.querySelector("[data-name]");
    const relatedName = input.value.trim();
    if (!relatedName) return;

    const existing = Object.entries(allGuests).find(([gid, g]) => g.name === relatedName);
    let relatedId;

    if (existing) {
      relatedId = existing[0];
    } else {
      relatedId = db.ref("guests").push().key;
      db.ref(`guests/${relatedId}`).set({
        name: relatedName,
        uploadedAt: new Date().toISOString()
      });
    }

    if (type === "child") {
      relations.children = relations.children || [];
      if (!relations.children.includes(relatedId)) relations.children.push(relatedId);
    } else {
      relations[type] = relatedId;
    }

    const reverseTypeMap = {
      husband: "wife",
      wife: "husband",
      mother: "children",
      father: "children",
      child: "parent"
    };

    const reverseType = reverseTypeMap[type];

    const previousTypeId = Object.entries(previousRelations)
      .find(([k, v]) => v === relatedId || (Array.isArray(v) && v.includes(relatedId)))?.[0];

    const oldReverseType = reverseTypeMap[previousTypeId];

    relatedUpdates.push({ relatedId, reverseType, oldReverseType });
  });

  db.ref(`guests/${id}`).update({ name, relations }).then(() => {
    syncGuestRelations(id, relatedUpdates, "editGuestModal");
  });
}


function showRelationModal(sourceId, targetId) {
  const guest1 = allGuests[sourceId];
  const guest2 = allGuests[targetId];

  const existing = document.getElementById("relationModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="modal fade" id="relationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Связать гостей</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Связать <b>${guest1.name}</b> с <b>${guest2.name}</b> как:</p>
            <select id="relationType" class="form-select">
              <option value="husband">Муж</option>
              <option value="wife">Жена</option>
              <option value="child">Ребёнок</option>
              <option value="father">Отец</option>
              <option value="mother">Мать</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button class="btn btn-primary" id="confirmRelationBtn">Связать</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalInstance = new bootstrap.Modal(document.getElementById("relationModal"));
  modalInstance.show();

  document.getElementById("confirmRelationBtn").onclick = () => {
    const type = document.getElementById("relationType").value;
    linkGuests(sourceId, targetId, type).then(() => {
      modalInstance.hide();
      loadGuestsFromFirebase();
    });
  };
}

function linkGuests(sourceId, targetId, type) {
  const guest1Ref = db.ref(`guests/${sourceId}/relations`);
  const guest2Ref = db.ref(`guests/${targetId}/relations`);

  const reverseType = {
    husband: "wife",
    wife: "husband",
    child: "parent",
    father: "children",
    mother: "children",
  }[type];

  return Promise.all([
    guest1Ref.once("value"),
    guest2Ref.once("value"),
  ]).then(([snap1, snap2]) => {
    const rel1 = snap1.val() || {};
    const rel2 = snap2.val() || {};

    // В source → target
    if (type === "child") {
      rel1.children = rel1.children || [];
      if (!rel1.children.includes(targetId)) rel1.children.push(targetId);
    } else {
      rel1[type] = targetId;
    }

    // В target → source
    if (reverseType === "children") {
      rel2.children = rel2.children || [];
      if (!rel2.children.includes(sourceId)) rel2.children.push(sourceId);
    } else {
      rel2[reverseType] = sourceId;
    }

    return Promise.all([
      guest1Ref.set(rel1),
      guest2Ref.set(rel2)
    ]);
  });
}

function syncGuestRelations(guestId, relatedUpdates, modalIdToClose = null) {
  const updatePromises = relatedUpdates.map(({ relatedId, reverseType, oldReverseType }) => {
    return db.ref(`guests/${relatedId}/relations`).once("value").then(snapshot => {
      const rel = snapshot.val() || {};

      // Удаление старой связи, если она изменилась
      if (oldReverseType && oldReverseType !== reverseType) {
        if (oldReverseType === "children" && rel.children) {
          rel.children = rel.children.filter(childId => childId !== guestId);
        } else if (rel[oldReverseType] === guestId) {
          delete rel[oldReverseType];
        }
      }

      // Добавление новой связи
      if (reverseType === "children") {
        rel.children = rel.children || [];
        if (!rel.children.includes(guestId)) rel.children.push(guestId);
      } else {
        rel[reverseType] = guestId;
      }

      return db.ref(`guests/${relatedId}/relations`).update(rel);
    });
  });

  return Promise.all(updatePromises).then(() => {
    const modal = document.getElementById(modalIdToClose || "editGuestModal");
    if (modal) bootstrap.Modal.getInstance(modal).hide();
    loadGuestsFromFirebase();
  });
}
