// script.js

const params = new URLSearchParams(window.location.search);
const guest = params.get('guest');
if (guest) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guestName').value = decodeURIComponent(guest);
    document.getElementById('guestName').readOnly = true;
  });
}

function renderTextContent(lang) {
  const isKazakh = lang === 'kk';

  document.getElementById('mainTitle').innerText = isKazakh ? 'Тойға шақыру' : 'Приглашение на той';

  document.getElementById('eventDescription').innerHTML = isKazakh ? `
    <h2>Құрметті қонақ!</h2>
    <p>Сізді біздің қуанышымызға ортақтасуға шақырамыз:</p>
    <ul>
      <li>Қызымыздың 7 жасқа толып, мектепке баруы — Тілашар</li>
      <li>Ұлымыздың сүндетке отырғызуы</li>
      <li>Кішкентай ханшайымымыздың дүниеге келуі — Бесік той</li>
    </ul>
    <p><strong>Той иелері:</strong> Бауржан, Қамар</p>
  ` : `
    <h2>Дорогой гость!</h2>
    <p>Приглашаем Вас разделить нашу радость:</p>
    <ul>
      <li>7-летие нашей дочери и её поступление в школу — Тілашар</li>
      <li>Сүндет той нашего сына</li>
      <li>Рождение нашей младшей дочери — Бесік той</li>
    </ul>
    <p><strong>Организаторы:</strong> Бауржан, Қамар</p>
  `;

  document.getElementById('eventDetails').innerHTML = isKazakh ? `
    <h2>Кездесу орны мен уақыты</h2>
    <p><strong>15 маусым 2025, 14:00</strong></p>
    <p>Ресторан "Алтын Ел", пр. Дулати 55</p>
    <iframe class='map' src='https://widgets.2gis.com/widget?type=firm&regionId=56&firmId=70000001025292888'></iframe>
  ` : `
    <h2>Дата и место</h2>
    <p><strong>15 июня 2025, 14:00</strong></p>
    <p>Ресторан "Алтын Ел", пр. Дулати 55</p>
    <iframe class='map' src='https://widgets.2gis.com/widget?type=firm&regionId=56&firmId=70000001025292888'></iframe>
  `;

  document.getElementById('rsvp').innerHTML = isKazakh ? `
    <h2>Қатысатыныңызды растаңыз</h2>
    <form id="rsvpForm" class="needs-validation" novalidate>
      <div class="mb-3">
        <label id="guestNameLabel" class="form-label">Сіздің атыңыз:</label>
        <input type="text" class="form-control" id="guestName" placeholder="Атыңыз" required />
      </div>
      <button type="submit" class="btn btn-success">Қатысамын</button>
      <button type="button" class="btn btn-outline-secondary ms-2" onclick="denyAttendance()">Қатыспаймын</button>
    </form>
    <p id="thanksMsg" class="mt-3 text-success fw-bold" style="display: none">Рақмет, күтеміз!</p>
    <p id="sorryMsg" class="mt-3 text-danger fw-bold" style="display: none">Қап, өкінішті. Келесі жолы!</p>
  ` : `
    <h2>Подтвердите участие</h2>
    <form id="rsvpForm" class="needs-validation" novalidate>
      <div class="mb-3">
        <label id="guestNameLabel" class="form-label">Ваше имя:</label>
        <input type="text" class="form-control" id="guestName" placeholder="Ваше имя" required />
      </div>
      <button type="submit" class="btn btn-success">Приду</button>
      <button type="button" class="btn btn-outline-secondary ms-2" onclick="denyAttendance()">Не смогу</button>
    </form>
    <p id="thanksMsg" class="mt-3 text-success fw-bold" style="display: none">Спасибо, ждём вас!</p>
    <p id="sorryMsg" class="mt-3 text-danger fw-bold" style="display: none">Жаль, до встречи в другой раз!</p>
  `;

  document.getElementById('countdownTitle').innerText = isKazakh ? 'Тойға дейін қалды:' : 'До праздника осталось:';
}

function toggleLang() {
  const current = document.documentElement.lang;
  const newLang = current === 'kk' ? 'ru' : 'kk';
  document.documentElement.lang = newLang;
  renderTextContent(newLang);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTextContent(document.documentElement.lang);

  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'rsvpForm') {
      e.preventDefault();
      document.getElementById('rsvpForm').style.display = 'none';
      document.getElementById('thanksMsg').style.display = 'block';
      document.getElementById('sorryMsg').style.display = 'none';
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  });
});

function denyAttendance() {
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('thanksMsg').style.display = 'none';
  document.getElementById('sorryMsg').style.display = 'block';
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.3 }
  });
  generateBalloons();
}

function generateBalloons() {
  const container = document.getElementById('balloonContainer');
  const colors = ['#f99', '#9cf', '#fc9', '#cfc', '#ff9', '#ccf'];
  for (let i = 0; i < 10; i++) {
    const balloon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    balloon.setAttribute("width", "40");
    balloon.setAttribute("height", "60");
    balloon.setAttribute("viewBox", "0 0 40 60");
    balloon.classList.add("balloon");
    balloon.style.left = Math.random() * 100 + "%";
    balloon.style.animationDuration = (5 + Math.random() * 5) + "s";

    const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    ellipse.setAttribute("cx", "20");
    ellipse.setAttribute("cy", "30");
    ellipse.setAttribute("rx", "15");
    ellipse.setAttribute("ry", "25");
    ellipse.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
    balloon.appendChild(ellipse);

    container.appendChild(balloon);
  }
}

let rainbowAnimated = false;
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

function revealOverlayRainbow() {
  const section = document.querySelector('#eventDescription');
  const rainbowGroup = document.querySelector('.rainbow-group');
  if (!section || !rainbowGroup) return;

  const top = section.getBoundingClientRect().top;
  const bottom = section.getBoundingClientRect().bottom;
  const windowHeight = window.innerHeight;

  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollingDown = currentScrollTop > lastScrollTop;
  const scrollingUp = currentScrollTop < lastScrollTop;
  lastScrollTop = currentScrollTop;

  if (scrollingDown && !rainbowAnimated && top < windowHeight && bottom > 0) {
    rainbowGroup.querySelectorAll('path').forEach((path, i) => {
      path.style.animation = `drawArc 1.5s ease-out forwards`;
      path.style.animationDelay = `${i * 0.1}s`;
    });
    rainbowAnimated = true;
  }

  if (scrollingUp && rainbowAnimated && top < windowHeight && bottom > 0) {
    rainbowGroup.querySelectorAll('path').forEach((path) => {
      path.style.animation = `eraseArc 1.2s ease-out forwards`;
      path.style.animationDelay = '0s';
    });
    rainbowAnimated = false;
  }
}

window.addEventListener('scroll', revealOverlayRainbow);

const extraStyle = document.createElement('style');
extraStyle.innerHTML = `@keyframes eraseArc { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 800; }}`;
document.head.appendChild(extraStyle);

// Countdown
function updateCountdown() {
  const eventDate = new Date('2025-06-15T14:00:00');
  const now = new Date();
  const diff = eventDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('timer').textContent = `${days} күн ${hours} сағат ${minutes} минут ${seconds} секунд`;
  setTimeout(updateCountdown, 1000);
}
updateCountdown();
