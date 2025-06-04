document.addEventListener("DOMContentLoaded", () => {
  const navList = document.getElementById("navbar");
  navList.innerHTML = `
      <a class="navbar-brand" href="#">Пригласительные</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-3">
          <li class="nav-item">
            <a class="nav-link" href="create.html">Создать</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="invites.html">Пригласительные</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="guests.html">Список гостей</a>
          </li>
        </ul>
      </div>
      `;
});