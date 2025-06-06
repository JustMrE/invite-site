export function createAddGuestModal() {
  const modalHtml = `
    <div class="modal fade" id="addGuestModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Добавить гостя</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="text" class="form-control" placeholder="Имя гостя">
        </div>
      </div></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}