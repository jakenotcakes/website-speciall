document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      const expanded = mainNav.classList.contains("open");
      navToggle.setAttribute("aria-expanded", String(expanded));
    });
  }

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target)
          target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Countdown timer with reveal logic
  const countdown = document.getElementById("countdown");
  const countdownCover = document.getElementById("countdown-cover");
  const mainContent = document.getElementById("main-content");
  const revealHint = document.getElementById("reveal-hint");

  if (countdown && countdown.dataset.date) {
    const targetDate = new Date(countdown.dataset.date);
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    let isFinished = false;

    const countdownLock = true;
    // Change clickLock to True to disable click reveal before countdown ends
    const clickLock = true;

    function revealContent() {
      if (!isFinished) {
        isFinished = true;
        countdownCover.classList.add("hidden");
        if (mainContent) {
          mainContent.classList.remove("hidden");
        }
        const heroArea = document.querySelector(".hero");
        if (heroArea) {
          heroArea.classList.add("revealed");
        }
        // Trigger hero text animation
        setTimeout(() => animateHeroText(), 100);
      }
    }

    function updateCountdown() {
      const now = new Date();
      let diff = Math.max(0, targetDate - now);
      if (diff <= 0 || typeof countdownLock === "undefined" || !countdownLock) {
        daysEl.textContent = "0";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        clearInterval(timerId);
        revealHint.textContent = "Time's up! Revealing the page...";
        revealContent();
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      daysEl.textContent = String(days);
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    if (countdownCover) {
      countdownCover.addEventListener("click", () => {
        if (!isFinished && typeof clickLock !== "undefined" && clickLock) {
          alert("Not time yet — Please Wait");
          return;
        }
        revealContent();
      });
    }
  }

  // Hero character animation
  function animateHeroText() {
    const leadEl = document.querySelector(".hero .lead");
    const heroTextEl = document.getElementById("hero-text");

    function splitAndAnimate(el) {
      if (!el) return;
      const text = el.textContent.trim();
      el.innerHTML = "";
      el.style.display = "flex";
      el.style.flexWrap = "wrap";
      el.style.justifyContent = "center";
      el.style.gap = "0.2rem";

      const chars = text.split("");
      chars.forEach((char, idx) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.setProperty("--delay", `${idx * 0.05}s`);
        span.style.animationDelay = `${idx * 0.05}s`;
        el.appendChild(span);
      });
    }

    splitAndAnimate(leadEl);
    splitAndAnimate(heroTextEl);
  }

  // Hero text click scroll
  const heroText = document.getElementById("hero-text");
  function smoothScrollTo(element, duration = 1000) {
    const startY = window.scrollY;
    const targetY = element.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  if (heroText) {
    heroText.style.cursor = "pointer";
    heroText.addEventListener("click", () => {
      const notesSection = document.getElementById("notes");
      if (notesSection) {
        smoothScrollTo(notesSection, 1200);
      }
    });
  }

  // Hero text size control
  const fontSizeRange = document.getElementById("font-size-range");
  const fontSizeValue = document.getElementById("font-size-value");

  const heroSizeSelect = document.getElementById("hero-size-select");

  if (heroText && fontSizeRange && fontSizeValue) {
    fontSizeRange.addEventListener("input", () => {
      heroText.style.fontSize = `${fontSizeRange.value}px`;
      fontSizeValue.textContent = `${fontSizeRange.value}px`;
    });
  }

  if (heroText && heroSizeSelect) {
    heroSizeSelect.addEventListener("change", () => {
      heroText.classList.remove("h1", "h2", "h3", "normal");
      heroText.classList.add(heroSizeSelect.value);
      if (heroSizeSelect.value === "normal") {
        heroText.style.fontSize = `${fontSizeRange.value}px`;
      }
    });
  }

  // RSVP form handling
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpResult = document.getElementById("rsvp-result");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name =
        rsvpForm.name?.value?.trim() ||
        rsvpForm.querySelector("#rname")?.value?.trim() ||
        "Guest";
      const email =
        rsvpForm.email?.value?.trim() ||
        rsvpForm.querySelector("#remail")?.value?.trim() ||
        "";
      const guests =
        rsvpForm.guests?.value ||
        rsvpForm.querySelector("#guests")?.value ||
        "0";

      const entry = {
        name,
        email,
        guests: Number(guests),
        time: new Date().toISOString(),
      };

      try {
        const stored = JSON.parse(localStorage.getItem("rsvps") || "[]");
        stored.push(entry);
        localStorage.setItem("rsvps", JSON.stringify(stored));
        rsvpResult.textContent = `Thanks ${name}! Your RSVP for ${entry.guests} guest(s) is recorded.`;
        rsvpForm.reset();
      } catch (err) {
        rsvpResult.textContent = "Sorry, could not save your RSVP locally.";
      }
    });
  }

  // --------------------
  // Fireworks animation
  // --------------------
  const fireworksCanvas = document.getElementById("fireworks-canvas");
  const heroSection = document.querySelector(".hero");
  if (fireworksCanvas) {
    const ctx = fireworksCanvas.getContext("2d");
    const particles = [];
    const rockets = [];
    const maxRockets = 5;
    let width, height;

    function resizeFireworks() {
      width = fireworksCanvas.width = window.innerWidth;
      height = fireworksCanvas.height = window.innerHeight;
    }

    function heroIsVisible() {
      if (!heroSection) return true;
      const rect = heroSection.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    window.addEventListener("resize", resizeFireworks);
    resizeFireworks();

    class Rocket {
      constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.trail = [];
      }
      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
      }
      draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        for (let i = this.trail.length - 1; i > 0; i--) {
          const p1 = this.trail[i];
          const p2 = this.trail[i - 1];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
      }
    }

    class Particle {
      constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alpha = 1;
        this.color = color;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.alpha -= 0.015;
      }
      draw() {
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function randomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 100%, 65%)`;
    }

    function launchRocket() {
      const x = Math.random() * width * 0.8 + width * 0.1;
      const y = height + 10;
      const vx = (Math.random() - 0.5) * 2;
      const vy = -(Math.random() * 7 + 13);
      rockets.push(new Rocket(x, y, vx, vy, randomColor()));
    }

    function explode(rocket) {
      const count = 25 + Math.floor(Math.random() * 35);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(rocket.x, rocket.y, vx, vy, rocket.color));
      }
    }

    function updateFireworks() {
      const isHeroVisible = heroIsVisible();
      if (!isHeroVisible) {
        rockets.length = 0;
        particles.length = 0;
        ctx.clearRect(0, 0, width, height);
        requestAnimationFrame(updateFireworks);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (rockets.length < maxRockets && Math.random() < 0.08) {
        launchRocket();
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        rocket.update();
        rocket.draw();
        if (rocket.vy >= 0 || rocket.y < height * 0.25) {
          explode(rocket);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        if (particle.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          particle.draw();
        }
      }

      requestAnimationFrame(updateFireworks);
    }

    updateFireworks();
  }
});
