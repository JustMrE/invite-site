document.addEventListener("DOMContentLoaded", () => {
  const eventDate = new Date("2025-06-15T14:00:00+0500");
  const elements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  document.getElementById("rsvpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("rsvpForm").style.display = "none";
    document.getElementById("thanksMsg").style.display = "block";
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  });

  function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    elements.days.textContent = days;
    elements.hours.textContent = hours;
    elements.minutes.textContent = minutes;
    elements.seconds.textContent = seconds;
  }

  function generateBalloons() {
    const container = document.getElementById("balloonContainer");
    const colors = ["#f99", "#9cf", "#fc9", "#cfc", "#ff9", "#ccf"];

    for (let i = 0; i < 10; i++) {
      const balloon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      balloon.setAttribute("width", "40");
      balloon.setAttribute("height", "60");
      balloon.setAttribute("viewBox", "0 0 40 60");
      balloon.classList.add("balloon");
      balloon.style.left = Math.random() * 100 + "%";
      balloon.style.animationDuration = 5 + Math.random() * 5 + "s";

      const ellipse = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse"
      );
      ellipse.setAttribute("cx", "20");
      ellipse.setAttribute("cy", "30");
      ellipse.setAttribute("rx", "15");
      ellipse.setAttribute("ry", "25");
      ellipse.setAttribute(
        "fill",
        colors[Math.floor(Math.random() * colors.length)]
      );
      balloon.appendChild(ellipse);

      container.appendChild(balloon);
    }
  }

  function launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.3 },
    });
    generateBalloons();
  }

  function createFallingStars(count = 20) {
    const container = document.getElementById("fallingStars");
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      star.style.left = `${Math.random() * 100}vw`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.width = star.style.height = `${5 + Math.random() * 5}px`;
      container.appendChild(star);
    }
  }

  document.getElementById("toggleLang").addEventListener("click", function (e) {
    const isKazakh = document.documentElement.lang === "kk";
    document.documentElement.lang = isKazakh ? "ru" : "kk";

    document.getElementById("mainTitle").innerText = isKazakh
      ? "Приглашение на той"
      : "Тойға шақыру";
    document.getElementById("lang-1").innerHTML = isKazakh
      ? `<div class="greeting greeting-1">
          <img src="./img/asset1.png" alt="Юрта" class="invite-icon" />
          <h2 class="text-center">
            Уважаемые родные и близкие, братья, сестры, дяди и племянники, друзья и соседи!
          </h2>
        </div>
        <div class="greeting greeting-2">
          <p class="text-center">
            Приглашаем вас стать почётным гостем за нашим ақ дастархан, посвящённым празднику наших внуков!
          </p>
          <img src="./img/asset2.png" alt="Баурсақ" class="invite-icon" />
        </div>
        <div class="greeting greeting-3">
          <p class="text-center">
            <strong>Организаторы:</strong><br />
          <strong>Бауржан, Қамар</strong>
          </p>
          <img src="./img/asset3.png" alt="Домбыра" class="invite-icon" />
        </div>`
      : `<div class="greeting greeting-1">
          <img src="./img/asset1.png" alt="Юрта" class="invite-icon" />
          <h2 class="text-center">
            Құрметті Ағайын-туыс, бауырлар, құда-жекжат, нағашы-жиен,
            бөлелер, дос-жарандар, көршілер!
          </h2>
        </div>
        <div class="greeting greeting-2">
          <p class="text-center">
            Сіздерді немерелеріміздің тойларына арналған ақ дастарханымыздың
            қадірменді қонағы болуға шақырамыз!
          </p>
          <img src="./img/asset2.png" alt="Баурсақ" class="invite-icon" />
        </div>
        <div class="greeting greeting-3">
          <p class="text-center">
            <strong>Той иелері:</strong><br />
            <strong>Бауржан, Қамар</strong>
          </p>
          <img src="./img/asset3.png" alt="Домбыра" class="invite-icon" />
        </div>`;

    document.getElementById("address-lang-1").innerText = isKazakh
      ? "Мероприятие состоится:"
      : "Той салтанаты:";
    document.getElementById("address-lang-2").innerText = isKazakh
      ? "15 ияюня 2025 г, 14:00 часов"
      : "15 маусым 2025 ж, 14:00";
    document.getElementById("address-lang-3").innerText = isKazakh
      ? "показать на карте"
      : "қартада ашу";

    document.getElementById("rsvp-lang-1").innerText = isKazakh
      ? "Просим подтвердить ваше присутствие в мероприятии"
      : "Тойға келетіңізді растауыңызды сұраймыз";
    document.getElementById("rsvp-lang-2").placeholder = isKazakh
      ? "Ваше имя"
      : "Сіздің атыңыз";
    document.getElementById("rsvp-lang-3").innerText = isKazakh
      ? "Приеду с радостью"
      : "Әрине келемін";

    document.getElementById("rsvp-lang-4").innerText = isKazakh
      ? "Не смогу"
      : "Өкінішке орай келе алмаймын";
  });

  setInterval(updateCountdown, 1000);
  updateCountdown();
  createFallingStars(30);
  launchConfetti();

  const blocks = document.querySelectorAll('.block');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // если нужно один раз
      }
    });
  }, {
    threshold: 0.1 // 10% блока видно — запускаем
  });

  blocks.forEach(block => observer.observe(block));

})
