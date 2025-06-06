import { guestsFlat } from "../index.js";
import { loadGuestsFromFirebase } from "../index.js";
import { db } from "../firebase.js";
import { syncGuestRelations } from "../logic/relations.js";

export function createAddGuestModal() {
  // ничего не создаём здесь динамически — HTML уже содержит модалку
  // но можно добавить обработчик на создание нового поля связи
  document
    .querySelector("#manualForm")
    ?.appendChild(createRelationSection());
}

export function openEditModal(guestId) {
  const guest = guestsFlat.find((g) => g.id === guestId);
  if (!guest) return;

  const modalEl = document.getElementById("editGuestModal");
  const nameInput = modalEl.querySelector("#editGuestName");
  const inviteInput = modalEl.querySelector("#editInviteNumber");

  nameInput.value = guest.guestName || "";
  inviteInput.value = guest.inviteNumber || "";

  // Удаляем старую секцию связи и создаём новую
  const container = modalEl.querySelector(".modal-body");
  container.querySelector(".relation-section")?.remove();
  container.appendChild(createRelationSection(guest));

  // Сохраняем текущий ID для редактирования
  modalEl.dataset.guestId = guestId;

  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function createRelationSection(guest = null) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("relation-section", "mb-3");

  const label = document.createElement("label");
  label.textContent = "Добавить связь";
  label.classList.add("form-label");

  const select = document.createElement("select");
  select.className = "form-select mb-2";
  select.innerHTML = `
    <option value="">Тип связи</option>
    <option value="spouse">Муж / Жена</option>
    <option value="children">Дети</option>
    <option value="parent">Родитель</option>
  `;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control";
  input.placeholder = "Введите имя или выберите из списка";

  // Подсказки
  input.addEventListener("input", () => {
    const term = input.value.toLowerCase();
    const datalistId = `datalist-${Math.random().toString(36).slice(2)}`;

    let datalist = document.getElementById(datalistId);
    if (!datalist) {
      datalist = document.createElement("datalist");
      datalist.id = datalistId;
      document.body.appendChild(datalist);
      input.setAttribute("list", datalistId);
    }

    datalist.innerHTML = guestsFlat
      .filter((g) => g.guestName.toLowerCase().includes(term) && (!guest || g.id !== guest.id))
      .map((g) => `<option value="${g.guestName}">`)
      .join("");
  });

  wrapper.append(label, select, input);
  return wrapper;
}
