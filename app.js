const defaults = {
  name: "Sofiqul Islam",
  role: "N8N AUTOMATION · API & AI INTEGRATIONS",
  intro: "I connect the moving parts—so good ideas can move on their own. Practical automations, carefully built from first trigger to final alert.",
  email: "Sofiqulsohan2017@gmail.com",
  linkedin: "https://www.linkedin.com/in/sofiqul-islam-6b7b5a217/",
  projectTitle: "Feedback Intake & Weekly Digest",
  projectDescription: "Validates and normalizes submissions, deduplicates by email, classifies written feedback, alerts on low ratings, and sends a scheduled weekly summary.",
  scene: "mist",
  accent: "#a7caff"
};

const saved = (() => {
  try { return JSON.parse(localStorage.getItem("sofiqul-portfolio-customization-v1") || "{}"); }
  catch { return {}; }
})();
let current = { ...defaults, ...saved };
const scenes = [...document.querySelectorAll("[data-scene]")];
const track = document.getElementById("journey-track");
const stage = document.getElementById("journey-stage");
const caption = document.getElementById("scene-caption");
const topbar = document.querySelector(".topbar");
const sceneNames = ["01 / INTRO", "02 / PROJECTS", "03 / ABOUT", "04 / QUALITY", "05 / CONTACT"];
const sceneLinks = [...document.querySelectorAll("[data-scene-link]")];
const particleField = document.getElementById("particle-field");
const motionPreferenceKey = "sofiqul-portfolio-motion-v1";
const themePreferenceKey = "sofiqul-portfolio-theme-v1";
let theme = (() => {
  try { return localStorage.getItem(themePreferenceKey) === "light" ? "light" : "dark"; }
  catch { return "dark"; }
})();
const motionPreference = (() => {
  try { return localStorage.getItem(motionPreferenceKey); }
  catch { return null; }
})();
let reduceMotion = motionPreference === "on"
  ? false
  : motionPreference === "off"
    ? true
    : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// This page maps scroll position to scenes. Let that mapping handle fragment links
// instead of allowing the browser to restore an unrelated scroll position.
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)).join(",");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[character]);
}

function render(data) {
  current = { ...data };
  document.getElementById("header-name").textContent = current.name;
  document.getElementById("hero-heading").innerHTML = escapeHtml(current.name).replace(/\s+/, "<br />") + '<span class="hero-period">.</span>';
  document.getElementById("hero-role").textContent = current.role;
  document.getElementById("hero-description").textContent = current.intro;
  document.getElementById("project-title").textContent = current.projectTitle;
  document.getElementById("project-description").textContent = current.projectDescription;
  document.getElementById("contact-email").textContent = current.email;
  document.getElementById("contact-email-link").href = "mailto:" + current.email;
  const linkedinLink = document.getElementById("contact-linkedin");
  const linkedinUrl = String(current.linkedin || "").trim();
  const validLinkedIn = /^https:\/\/(www\.)?linkedin\.com\//i.test(linkedinUrl);
  linkedinLink.hidden = !validLinkedIn;
  if (validLinkedIn) linkedinLink.href = linkedinUrl;
  document.body.dataset.landscape = current.scene;
  document.documentElement.style.setProperty("--accent", current.accent);
  document.documentElement.style.setProperty("--accent-rgb", hexToRgb(current.accent));
}

function syncMotionControl() {
  const motionToggle = document.getElementById("motion-toggle");
  document.body.classList.toggle("motion-reduced", reduceMotion);
  document.body.classList.toggle("motion-enabled", !reduceMotion);
  motionToggle.setAttribute("aria-pressed", String(!reduceMotion));
  motionToggle.setAttribute("aria-label", reduceMotion ? "Enable portfolio motion" : "Turn portfolio motion off");
  motionToggle.innerHTML = reduceMotion ? "✦ Enable motion" : "✦ Motion on";
}

function syncThemeControl() {
  const isLight = theme === "light";
  const themeToggle = document.getElementById("theme-toggle");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.setProperty("--accent", isLight ? "#4d739d" : "#a7caff");
  document.documentElement.style.setProperty("--accent-rgb", isLight ? "77,115,157" : "167,202,255");
  document.querySelector('meta[name="theme-color"]').content = isLight ? "#eef3f7" : "#080a0d";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.textContent = isLight ? "◐ Dark" : "☼ Light";
}

function setActiveScene(index) {
  sceneLinks.forEach((link) => {
    const active = Number(link.dataset.sceneLink) === index;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  caption.textContent = sceneNames[index];
}

let scrollTween = 0;
function scrollToScene(index, immediate = false) {
  if (scrollTween) window.cancelAnimationFrame(scrollTween);
  const maxIndex = scenes.length - 1;
  const range = Math.max(1, track.offsetHeight - stage.offsetHeight);
  const trackTop = track.getBoundingClientRect().top + window.scrollY;
  const start = window.scrollY;
  const destination = trackTop + range * (index / maxIndex);
  if (reduceMotion || immediate) {
    window.scrollTo(0, destination);
    return;
  }
  const startedAt = performance.now();
  const duration = clamp(Math.abs(destination - start) * 0.42, 320, 720);
  const animateScroll = (now) => {
    const progress = clamp((now - startedAt) / duration);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + (destination - start) * eased);
    if (progress < 1) scrollTween = window.requestAnimationFrame(animateScroll);
    else scrollTween = 0;
  };
  scrollTween = window.requestAnimationFrame(animateScroll);
}

// A fresh wheel/touch gesture takes control immediately if a scene jump is in progress.
const stopSceneJump = () => {
  if (scrollTween) window.cancelAnimationFrame(scrollTween);
  scrollTween = 0;
};
window.addEventListener("wheel", stopSceneJump, { passive: true });
window.addEventListener("touchstart", stopSceneJump, { passive: true });

document.querySelectorAll("[data-scene-link], [data-go-scene]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const rawIndex = link.dataset.sceneLink ?? link.dataset.goScene;
    if (rawIndex === undefined) return;
    event.preventDefault();
    const index = Number(rawIndex);
    if (link.dataset.sceneLink !== undefined) {
      const sceneId = scenes[index]?.id;
      if (sceneId) window.history.replaceState(null, "", "#" + sceneId);
    }
    scrollToScene(index);
  });
});
window.addEventListener("hashchange", () => {
  const sceneIndex = scenes.findIndex((scene) => "#" + scene.id === window.location.hash);
  if (sceneIndex >= 0) scrollToScene(sceneIndex, true);
});

// Build a small deterministic particle field once, then update only transforms as the user scrolls.
const particles = [];
for (let index = 0; index < 42; index += 1) {
  const particle = document.createElement("i");
  const angle = index * 2.399963;
  const distance = 100 + (index % 7) * 48;
  const dx = Math.cos(angle) * distance * 1.55;
  const dy = Math.sin(angle) * distance;
  particle.className = "particle";
  particleField.appendChild(particle);
  particles.push({ element: particle, dx, dy, size: index % 5 === 0 ? 4 : 2 });
}

const splitLeft = document.querySelector(".split-left");
const splitRight = document.querySelector(".split-right");
const contactPortal = document.querySelector(".contact-portal");
let frameRequest = 0;
let pointerFrame = 0;
let pointerTargetX = 0;
let pointerTargetY = 0;
let pointerX = 0;
let pointerY = 0;

function animatePointer() {
  pointerFrame = 0;
  pointerX += (pointerTargetX - pointerX) * 0.16;
  pointerY += (pointerTargetY - pointerY) * 0.16;
  if (Math.abs(pointerTargetX - pointerX) + Math.abs(pointerTargetY - pointerY) > 0.01) {
    pointerFrame = window.requestAnimationFrame(animatePointer);
  } else {
    pointerX = pointerTargetX;
    pointerY = pointerTargetY;
  }
  requestJourneyUpdate();
}

stage.addEventListener("pointermove", (event) => {
  const bounds = stage.getBoundingClientRect();
  pointerTargetX = clamp((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointerTargetY = clamp((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  stage.style.setProperty("--pointer-x", ((pointerTargetX + 1) * 50).toFixed(1) + "%");
  stage.style.setProperty("--pointer-y", ((pointerTargetY + 1) * 50).toFixed(1) + "%");
  if (!pointerFrame && !reduceMotion) pointerFrame = window.requestAnimationFrame(animatePointer);
});
stage.addEventListener("pointerleave", () => {
  pointerTargetX = 0;
  pointerTargetY = 0;
  if (!pointerFrame && !reduceMotion) pointerFrame = window.requestAnimationFrame(animatePointer);
});

// Project cards act like small glass tiles: the pointer tilts each card and moves its light.
document.querySelectorAll(".project-card").forEach((card) => {
  card.classList.add("interactive-card");
  card.addEventListener("pointermove", (event) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * 5;
    const rotateX = (0.5 - y) * 4;
    card.style.setProperty("--spot-x", (x * 100).toFixed(1) + "%");
    card.style.setProperty("--spot-y", (y * 100).toFixed(1) + "%");
    card.style.transform = "perspective(1100px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-3px)";
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
    card.style.removeProperty("--spot-x");
    card.style.removeProperty("--spot-y");
  });
});

/*
 * The page is one pinned canvas with five overlapping scenes. Scroll position becomes
 * a 0–4 scene coordinate. Adjacent scenes cross-fade at each boundary, so the same
 * math naturally plays backward when the visitor scrolls upward.
 */
function updateJourney() {
  frameRequest = 0;
  const scrollRange = Math.max(1, track.offsetHeight - stage.offsetHeight);
  const trackTop = track.getBoundingClientRect().top + window.scrollY;
  const progress = clamp((window.scrollY - trackTop) / scrollRange);
  const scenePosition = progress * (scenes.length - 1);
  // Keep the current tab selected until the incoming scene is actually visible.
  const activeIndex = Math.min(scenes.length - 1, Math.floor(scenePosition + 0.5));
  topbar.classList.toggle("scrolled", window.scrollY > 18);
  setActiveScene(activeIndex);
  scenes.forEach((scene, index) => {
    const local = scenePosition - index;
    // Crossfade adjacent scenes with the same eased curve so their light never drops out.
    // The handoff sits in the middle of each scroll interval, leaving each scene room to breathe.
    const transitionStart = 0.35;
    const transitionEnd = 0.65;
    const opacity = local < 0
      ? smoothstep((local + 1 - transitionStart) / (transitionEnd - transitionStart))
      : 1 - smoothstep((local - transitionStart) / (transitionEnd - transitionStart));
    const inner = scene.querySelector(".scene-inner");
    const backdrop = scene.querySelector(".scene-backdrop");
    // Fade copy in sequence while the landscapes overlap, preventing doubled headlines.
    const contentOpacity = local < 0
      ? smoothstep((local + 0.54) / 0.24)
      : 1 - smoothstep((local - 0.22) / 0.24);
    const entering = smoothstep((local + 0.65) / 0.65);
    const xDirection = index % 2 === 0 ? -1 : 1;
    const translateX = local < 0 ? (1 - entering) * xDirection * 24 : 0;
    const translateY = local < 0 ? (1 - entering) * 16 : -Math.min(24, local * 28);

    scene.style.opacity = String(opacity);
    scene.style.visibility = opacity > 0.005 ? "visible" : "hidden";
    inner.style.opacity = String(contentOpacity);
    scene.style.pointerEvents = index === activeIndex ? "auto" : "none";
    scene.setAttribute("aria-hidden", String(index !== activeIndex));
    if ("inert" in scene) scene.inert = index !== activeIndex;

    if (!reduceMotion) {
      inner.style.transform = "translate(" + Math.round(translateX - pointerX * 5) + "px," + Math.round(translateY - pointerY * 4) + "px)";
      backdrop.style.transform = "scale(" + (1.04 + Math.abs(local) * 0.02).toFixed(3) + ") translate3d(" + (pointerX * -10).toFixed(1) + "px," + (pointerY * -8 + local * -24).toFixed(1) + "px,0)";
    } else {
      inner.style.transform = "none";
      backdrop.style.transform = "none";
    }
  });

  // Scene 1 divides into two shutters, exposing Scene 2 through the opening.
  const split = reduceMotion ? 0 : smoothstep((scenePosition - 0.35) / 0.3);
  splitLeft.style.transform = "translate3d(" + (-split * 108) + "%,0,0)";
  splitRight.style.transform = "translate3d(" + (split * 108) + "%,0,0)";
  splitLeft.style.opacity = String(split);
  splitRight.style.opacity = String(split);

  // Scene 3 throws particles outward as Scene 4 emerges underneath.
  const particleProgress = reduceMotion ? 0 : smoothstep((scenePosition - 2.35) / 0.3);
  particles.forEach(({ element, dx, dy, size }) => {
    element.style.opacity = String(particleProgress * (1 - particleProgress * 0.28));
    element.style.width = size + "px";
    element.style.height = size + "px";
    element.style.transform = "translate3d(" + (dx * particleProgress).toFixed(1) + "px," + (dy * particleProgress).toFixed(1) + "px,0)";
  });

  // The final scene arrives through a quiet moonlike aperture.
  const portalProgress = reduceMotion ? 0 : smoothstep((scenePosition - 3.35) / 0.3);
  contactPortal.style.transform = "translate(-50%,-50%) scale(" + (0.1 + portalProgress * 5.8).toFixed(3) + ")";
  contactPortal.style.opacity = String(1 - portalProgress * 0.72);
}

function requestJourneyUpdate() {
  if (!frameRequest) frameRequest = window.requestAnimationFrame(updateJourney);
}

document.getElementById("motion-toggle").addEventListener("click", () => {
  reduceMotion = !reduceMotion;
  localStorage.setItem(motionPreferenceKey, reduceMotion ? "off" : "on");
  syncMotionControl();
  updateJourney();
});
document.getElementById("theme-toggle").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  try { localStorage.setItem(themePreferenceKey, theme); } catch {}
  syncThemeControl();
});
window.addEventListener("scroll", requestJourneyUpdate, { passive: true });
window.addEventListener("resize", requestJourneyUpdate, { passive: true });
document.getElementById("year").textContent = new Date().getFullYear();
render(current);
syncMotionControl();
syncThemeControl();
updateJourney();
const directScene = scenes.findIndex((scene) => "#" + scene.id === window.location.hash);
if (directScene >= 0) {
  const alignSceneToFragment = () => window.requestAnimationFrame(() => {
    scrollToScene(directScene, true);
    updateJourney();
  });
  if (document.readyState === "complete") alignSceneToFragment();
  else window.addEventListener("load", alignSceneToFragment, { once: true });
}
