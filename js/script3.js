document.addEventListener("DOMContentLoaded", () => {
  let guestsRu1 =
    "Уважаемый(-ые) родные и близкие, братья, сестры, дяди и племянники, друзья и соседи!";
  let guestsKz1 =
    "Құрметті Ағайын-туыс, бауырлар, құда-жекжат, нағашы-жиен, бөлелер, дос-жарандар, көршілер!";
  let guestsRu2 = "";
  let guestsKz2 = "";
  let oneGuest = false;
  const eventDate = new Date("2025-06-14T17:00:00+0500");
  const elements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

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
    document.getElementById("guestGreeting").innerText = isKazakh
      ? `${guestsRu1}`
      : `${guestsKz1}`;
    document.getElementById("lang-1").innerHTML = isKazakh
      ? "Приглашаем Вас стать почётным гостем за нашим ақ дастархан, посвящённым празднику наших внуков!"
      : `${
          oneGuest ? "Сізді" : "Сіздерді"
        } немерелеріміздің тойларына арналған ақ дастарханымыздың қадірменді қонағы болуға шақырамыз!`;
    document.getElementById("lang-2").innerHTML = isKazakh
      ? "<strong>Организаторы:</strong><br /><strong>Бауржан, Қамар</strong>"
      : "<strong>Той иелері:</strong><br /><strong>Бауржан, Қамар</strong>";

    document.getElementById("address-lang-1").innerText = isKazakh
      ? "Мероприятие состоится:"
      : "Той салтанаты:";
    document.getElementById("address-lang-2").innerText = isKazakh
      ? "14 июня 2025 г, 17:00 часов"
      : "14 маусым 2025 ж, 17:00";
    document.getElementById("address-lang-3").innerText = isKazakh
      ? "показать на карте"
      : "қартада ашу";

    document.getElementById("submitCome").innerText = isKazakh
      ? `${guestsRu2} `
      : `${guestsKz2} `;
    document.getElementById("rsvp-lang-1").innerText = isKazakh
      ? "Просим подтвердить Ваше присутствие в мероприятии"
      : "Тойға келетіңізді растауыңызды сұраймыз";
    document.getElementById("nameBlock").placeholder = isKazakh
      ? "Ваше имя"
      : "Сіздің атыңыз";
    document.getElementById("rsvp-lang-3").innerText = isKazakh
      ? "Приеду с радостью"
      : "Әрине келемін";

    document.getElementById("rsvp-lang-4").innerText = isKazakh
      ? "Не смогу"
      : "Өкінішке орай келе алмаймын";

    document.getElementById("thanksMsg").innerText = isKazakh
      ? "Спасибо, ждем вас!"
      : "Рақмет, күтеміз!";
    document.getElementById("sorryMsg").innerText = isKazakh
      ? "Очень жаль."
      : "Қап, өкінішті. Келесі жолы!";
    document.getElementById("countdown-lang-1").innerText = isKazakh
      ? "До начала мероприятия:"
      : "Той салтанатына дейін:";
  });

  setInterval(updateCountdown, 1000);
  updateCountdown();
  createFallingStars(30);
  launchConfetti();

  const blocks = document.querySelectorAll(".block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target); // если нужно один раз
        }
      });
    },
    {
      threshold: 0.1, // 10% блока видно — запускаем
    }
  );

  blocks.forEach((block) => observer.observe(block));

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

  const btnYes = document.getElementsByClassName("btn-yes");
  const btnNo = document.getElementsByClassName("btn-no");
  const params = new URLSearchParams(location.search);
  let inviteId = params.get("invite");
  const isNamed = !!inviteId;

  const guestNameInput = document.getElementById("guestName");
  const nameBlock = document.getElementById("nameBlock");
  const form = document.getElementById("rsvpForm");
  const greeting = document.getElementById("guestGreeting");
  const submitCome = document.getElementById("submitCome");

  if (isNamed) {
    firebase
      .database()
      .ref("invites/" + inviteId)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        const greetingText = document.getElementById("lang-1");
        if (data && Array.isArray(data.guests) && data.guests.length > 0) {
          if (data.guests.length < 2) {
            oneGuest = true;
          }
          const isKazakh = document.documentElement.lang === "kk";
          const namesText = data.guests.join(", ");
          guestsKz1 = guestsKz2 = `Құрметті ${namesText}!`;
          guestsRu1 = guestsRu2 = `${
            oneGuest ? "Уважаемый(-ая)" : "Уважаемые"
          } ${namesText}!`;
          greeting.innerText = isKazakh ? `${guestsKz1}` : `${guestsRu1}`;
          submitCome.innerText = isKazakh ? `${guestsKz2} ` : `${guestsRu2} `;
          nameBlock.style.display = "none";
          greetingText.innerText = isKazakh
            ? `${
                oneGuest ? "Сізді" : "Сіздерді"
              } немерелеріміздің тойларына арналған ақ дастарханымыздың қадірменді қонағы болуға шақырамыз!`
            : "Приглашаем Вас стать почётным гостем за нашим ақ дастархан, посвящённым празднику наших внуков!";
        }
      });
  }

  btnYes[0].addEventListener("click", () => {
    sendRSVP("yes");
  });
  btnNo[0].addEventListener("click", () => {
    sendRSVP("no");
  });

  function sendRSVP(status) {
    const name = isNamed ? "" : guestNameInput.value.trim();

    if (!isNamed && name === "") {
      alert("Атыңызды енгізіңіз");
      return;
    } else if (isNamed) {
      const updateData = {
        status,
        respondedAt: new Date().toISOString(),
      };
      updateData.type = "named";
      firebase
        .database()
        .ref("invites/" + inviteId)
        .update(updateData)
        .then(() => {
          form.style.display = "none";
          if (status === "yes") {
            thanksMsg.style.display = "block";
          } else {
            sorryMsg.style.display = "block";
          }
        });
    } else {
      document.getElementById("rsvpForm").style.display = "none";
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (status === "yes")
        document.getElementById("thanksMsg").style.display = "block";
      else if (status === "no")
        document.getElementById("sorryMsg").style.display = "block";
      inviteId = Math.random().toString(36).substr(2, 9);
      const updateData = {
        status,
        respondedAt: new Date().toISOString(),
      };

      if (!isNamed && name !== "") {
        updateData.guests = firebase.database.ServerValue.arrayUnion
          ? firebase.database.ServerValue.arrayUnion(name)
          : [name]; // Fallback для совместимости
        updateData.type = "unnamed";
      }

      firebase
        .database()
        .ref("invites/" + inviteId)
        .update(updateData)
        .then(() => {
          form.style.display = "none";
          if (status === "yes") {
            thanksMsg.style.display = "block";
          } else {
            sorryMsg.style.display = "block";
          }
        });
    }
  }
});
