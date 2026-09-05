/* ===================== VORRACHIS · script ===================== */

// ---------- datos: los brainrots oficiales del lore ----------
const BRAINROTS = [
  { emoji: "🥖🛼", name: "Panelini Baguettini", bio: "barra de pan con patines que esquiva llaves a 200 km/h, nadie la ha atrapado jamás", poder: 97 },
  { emoji: "🍞🚒", name: "Bombardino Panettone", bio: "pan bombero, apaga incendios con miga fresca, la llave le tiene pavor", poder: 92 },
  { emoji: "🔑😭", name: "Llavuchi Triston", bio: "la llave más triste del lore, 0% de sabor, 100% de drama, nadie la invita a las fiestas", poder: 3 },
  { emoji: "🦈🥐", name: "Tralalelo del Panadero", bio: "tiburón de croissant que nada por el horno cantando tralala mientras humilla cerraduras", poder: 95 },
  { emoji: "🐊🍞", name: "Miguelini de la Migaja", bio: "cocodrilo hecho 100% de migas, jefe final del reino del pan, invicto", poder: 99 },
  { emoji: "🥐🕺", name: "Croissantino Doppler", bio: "croissant DJ que pincha temazos para que la llave llore en la pista", poder: 88 },
];

const PHRASES = [
  "¡SISISIIII el pan es más rico que la llave, no cap! 🍞👑",
  "la ciencia lo confirma: 0 llaves fueron consumidas hoy, solo pan 📊",
  "está tó rico, está tó guay, está tó vorrachis 💅✨",
  "la llave solo sirve pa' abrir la puerta del horno del pan 🔑➡️🍞",
  "nivel de dopamina crítico, se recomienda más pan inmediatamente 🚨🍞",
  "las tías ya están bailando, tú también deberías 💃🪭",
  "esto no es brainrot, esto es CIENCIA PANIFICADA 🧠🍞",
  "la llave ha sido oficialmente cancelada por el lore 🔑🚫",
  "sisisiii, aquí solo entra quien ama el pan 🍞🚪",
  "dopamina + pan = combo perfecto, no discutimos esto 🔥",
];

// ---------- render de brainrots ----------
const grid = document.getElementById("brainrotGrid");
BRAINROTS.forEach((b, i) => {
  const card = document.createElement("div");
  card.className = "brainrot-card";
  card.style.animationDelay = `${(i % 3) * 0.25}s`;
  card.innerHTML = `
    <span class="brainrot-emoji">${b.emoji}</span>
    <p class="brainrot-name">${b.name}</p>
    <p class="brainrot-bio">${b.bio}</p>
    <div class="brainrot-meter"><div class="brainrot-meter__fill" style="width:${b.poder}%"></div></div>
  `;
  grid.appendChild(card);
});

// ---------- sonido sintetizado (sin archivos externos) ----------
let audioCtx = null;
let soundOn = true;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playBoop(freq = 440, dur = 0.12, type = "sine") {
  if (!soundOn) return;
  try {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (e) { /* audio no disponible, seguimos sin sonido */ }
}

function playPopSequence() {
  playBoop(523, 0.08, "triangle");
  setTimeout(() => playBoop(659, 0.08, "triangle"), 70);
  setTimeout(() => playBoop(784, 0.14, "triangle"), 140);
}

// ---------- toast ----------
const toastEl = document.getElementById("toast");
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ---------- confeti en canvas ----------
const canvas = document.getElementById("confetti-canvas");
const ctx2d = canvas.getContext("2d");
let particles = [];
const CONFETTI_EMOJI = ["🍞", "✨", "💖", "👑", "🌟", "💫"];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function spawnConfetti(x, y, count = 40) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x ?? Math.random() * canvas.width,
      y: y ?? -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -6 - 2,
      gravity: 0.25 + Math.random() * 0.15,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      size: 16 + Math.random() * 14,
      emoji: CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)],
      life: 0,
      maxLife: 140 + Math.random() * 60,
    });
  }
}

function animateConfetti() {
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.vy += p.gravity * 0.15;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    const fade = Math.max(0, 1 - p.life / p.maxLife);
    ctx2d.save();
    ctx2d.globalAlpha = fade;
    ctx2d.translate(p.x, p.y);
    ctx2d.rotate((p.rot * Math.PI) / 180);
    ctx2d.font = `${p.size}px serif`;
    ctx2d.textAlign = "center";
    ctx2d.fillText(p.emoji, 0, 0);
    ctx2d.restore();
  });
  particles = particles.filter((p) => p.life < p.maxLife && p.y < canvas.height + 40);
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ---------- lluvia de pan ----------
function breadRain() {
  let bursts = 0;
  const interval = setInterval(() => {
    spawnConfetti(Math.random() * canvas.width, -20, 6);
    bursts++;
    if (bursts > 25) clearInterval(interval);
  }, 90);
}

// ---------- cursor con corazoncitos ----------
let lastHeart = 0;
document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastHeart < 60) return;
  lastHeart = now;
  const heart = document.createElement("span");
  heart.className = "cursor-heart";
  heart.textContent = ["💖", "✨", "🍞", "💫"][Math.floor(Math.random() * 4)];
  heart.style.left = `${e.clientX}px`;
  heart.style.top = `${e.clientY}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
});

// ---------- batalla PAN vs LLAVE ----------
const battleFill = document.getElementById("battleFill");
const battleCaption = document.getElementById("battleCaption");
const BATTLE_CAPTIONS = [
  "98.7% de la ciencia confirma: el pan es más rico que la llave 📊🔥",
  "la llave lo intentó, pero el pan no perdona 🍞⚔️🔑",
  "encuesta oficial vorrachis: pan 99%, llave 1% (voto de piedad) 🗳️",
  "ranking mundial de sabor: 1° pan, 2° pan, 3° también pan 🏆",
];
function pumpBattle() {
  const value = 90 + Math.random() * 9;
  battleFill.style.width = `${value}%`;
  battleCaption.textContent = BATTLE_CAPTIONS[Math.floor(Math.random() * BATTLE_CAPTIONS.length)];
}
setTimeout(pumpBattle, 400);

// ---------- máquina de dopamina ----------
const dopamineBtn = document.getElementById("dopamineBtn");
const dopamineCount = document.getElementById("dopamineCount");
const dopamineBarFill = document.getElementById("dopamineBarFill");
const dopaminePhrase = document.getElementById("dopaminePhrase");
let dopamine = 0;

dopamineBtn.addEventListener("click", (e) => {
  dopamine += Math.floor(Math.random() * 8) + 3;
  if (dopamine > 999) dopamine = 999;
  dopamineCount.textContent = dopamine;
  dopamineBarFill.style.width = `${Math.min(dopamine / 10, 100)}%`;

  const rect = dopamineBtn.getBoundingClientRect();
  spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
  playPopSequence();
  pumpBattle();

  dopaminePhrase.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  dopaminePhrase.classList.remove("pop");
  void dopaminePhrase.offsetWidth; // reinicia animación
  dopaminePhrase.classList.add("pop");

  if (dopamine >= 300 && dopamine < 320) showToast("🚨 nivel crítico de dopamina alcanzado 🚨");
  if (dopamine >= 999) showToast("👑 HAS ALCANZADO LA ILUMINACIÓN DEL PAN 👑");
});

// ---------- dock de acciones (esquina, para más dopamina) ----------
const dock = document.getElementById("actionDock");
const soundBtn = document.getElementById("soundBtn");

dock.addEventListener("click", (e) => {
  const btn = e.target.closest(".action-btn");
  if (!btn) return;
  const action = btn.dataset.action;

  switch (action) {
    case "confetti":
      spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
      playPopSequence();
      showToast("🎉 confeti desatado 🎉");
      break;

    case "sound":
      soundOn = !soundOn;
      soundBtn.textContent = soundOn ? "🔊" : "🔇";
      if (soundOn) playBoop(660, 0.1, "sine");
      showToast(soundOn ? "sonido activado ✅" : "sonido silenciado 🔇");
      break;

    case "breadrain":
      breadRain();
      showToast("🍞 lluvia de pan activada 🍞");
      break;

    case "dance":
      document.body.classList.toggle("fast-dance");
      playBoop(300, 0.15, "square");
      showToast(document.body.classList.contains("fast-dance") ? "¡las tías están bailando reggaeton! 💃🔥" : "las tías se relajan un poco 🪭");
      break;

    case "quote":
      showToast(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
      playBoop(500, 0.1, "triangle");
      break;

    case "party":
      document.body.classList.toggle("party");
      document.body.classList.toggle("fast-dance");
      if (document.body.classList.contains("party")) {
        spawnConfetti(window.innerWidth / 2, 0, 60);
        showToast("🪩 MODO PARTY ACTIVADO, QUE NO PARE LA FIESTA 🪩");
        playPopSequence();
      } else {
        showToast("modo party desactivado, a descansar 😴");
      }
      break;
  }

  // pequeño shake de pantalla para dopamina extra
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
});

// bienvenida
setTimeout(() => showToast("bienvenidx a vorrachis, sisisiii 🍞👑"), 600);
