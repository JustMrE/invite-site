const params = new URLSearchParams(window.location.search);
const guest = params.get('guest');
if (guest) {
  document.getElementById('guestName').value = decodeURIComponent(guest);
  document.getElementById('guestName').readOnly = true;
}

document.getElementById('rsvpForm').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('thanksMsg').style.display = 'block';
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
});

function denyAttendance() {
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('thanksMsg').style.display = 'none';
  document.getElementById('sorryMsg').style.display = 'block';
}

function toggleLang() {
  const isKazakh = document.documentElement.lang === 'kk';
  document.documentElement.lang = isKazakh ? 'ru' : 'kk';

  document.getElementById('mainTitle').innerText = isKazakh
    ? 'Приглашение на той'
    : 'Тойға шақыру';

  const description = document.querySelector('#eventDescription');
  if (description) {
    const content = isKazakh
      ? `<h2>Дорогой гость!</h2>
        <p>Приглашаем Вас разделить нашу радость:</p>
        <ul>
          <li>7-летие нашей дочери и её поступление в школу — Тілашар</li>
          <li>Сүндет той нашего сына</li>
          <li>Рождение нашей младшей дочери — Бесік той</li>
        </ul>
        <p><strong>Организаторы:</strong> Бауржан, Қамар</p>`
      : `<h2>Құрметті қонақ!</h2>
        <p>Сізді біздің қуанышымызға ортақтасуға шақырамыз:</p>
        <ul>
          <li>Қызымыздың 7 жасқа толып, мектепке баруы — Тілашар</li>
          <li>Ұлымыздың сүндетке отырғызуы</li>
          <li>Кішкентай ханшайымымыздың дүниеге келуі — Бесік той</li>
        </ul>
        <p><strong>Той иелері:</strong> Бауржан, Қамар</p>`;

    const staticRainbow = description.querySelector('.rainbow-overlay');
    description.innerHTML = content;
    if (staticRainbow) description.appendChild(staticRainbow);
  }

  const details = document.querySelector('#eventDetails');
  if (details) {
    const content = isKazakh
      ? `<h2>Дата и место</h2>
        <p><strong>15 июня 2025, 14:00</strong></p>
        <p>Ресторан "Алтын Ел", пр. Дулати 55</p>
        <iframe class='map' src='https://widgets.2gis.com/widget?type=firm&regionId=56&firmId=70000001025292888'></iframe>`
      : `<h2>Кездесу орны мен уақыты</h2>
        <p><strong>15 маусым 2025, 14:00</strong></p>
        <p>Ресторан "Алтын Ел", пр. Дулати 55</p>
        <iframe class='map' src='https://widgets.2gis.com/widget?type=firm&regionId=56&firmId=70000001025292888'></iframe>`;
    details.innerHTML = content;
  }

  document.getElementById('guestNameLabel').innerText = isKazakh ? 'Ваше имя:' : 'Сіздің атыңыз:';
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

const style = document.createElement('style');
style.innerHTML = `
@keyframes eraseArc {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 800; }
}`;
document.head.appendChild(style);

function startCountdown() {
  const targetDate = new Date('2025-06-15T14:00:00+05:00'); // Точное время начала
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  update();
  setInterval(update, 1000);
}

startCountdown();

function revealSectionsOnScroll() {
  const sections = document.querySelectorAll('.section');
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < windowHeight - 50) {
      section.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('load', revealSectionsOnScroll);

function createFallingStars(count = 20) {
  const container = document.getElementById('fallingStars');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.width = star.style.height = `${5 + Math.random() * 5}px`;
    container.appendChild(star);
  }
}

createFallingStars(30);
