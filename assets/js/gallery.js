const categoryOrder = ["Projects", "Certificates", "Site visits"];

// To add a photo, copy one block, change the values, and add a comma between blocks.
const photos = [
  {
    src: "/assets/img/RC-Beam-Failure-Pattern-Project.webp",
    title: "RC Beam Failure Pattern Project",
    desc: "Civil Engineering students conducting a two-point loading test on a RC Beam using a UTM as part of the Beam Failure Pattern Project under the Mechanics of Solids–II course.",
    category: "Projects",
    date: "Aug 30, 2026",
    fit: "contain",
    alt: "Civil Engineering students conducting a two-point loading test on a RC Beam using a UTM as part of the Beam Failure Pattern Project under the Mechanics of Solids–II course."
  },
  {
    src: "/assets/img/DND-Project-Site-Visit.webp",
    title: "DND Project site visit",
    desc: "Group photo of Civil Engineering Department students from DUET during a site visit to Shimrail Pump Station under the Dhaka–Narayanganj–Demra (DND) Project of the Bangladesh Water Development Board (BWDB).",
    category: "Site visits",
    date: "Aug 22, 2026",
    fit: "contain",
    alt: "Group photo of Civil Engineering Department students from DUET during a site visit to Shimrail Pump Station under the Dhaka–Narayanganj–Demra (DND) Project of the Bangladesh Water Development Board (BWDB)."
  },
  {
    src: "/assets/img/Certificate-Low-Carbon%20Concrete.webp",
    title: "Low-Carbon Concrete certificate",
    desc: "ACI University Certificate Program awarded to Md Sakibul Hasan for successfully completing the Low-Carbon Concrete: Fundamentals, Materials, and Innovations program on August 18, 2026.",
    category: "Certificates",
    date: "Aug 18, 2026",
    fit: "contain",
    alt: "ACI University Certificate Program awarded to Md Sakibul Hasan for successfully completing the Low-Carbon Concrete: Fundamentals, Materials, and Innovations program on August 18, 2026."
  },
  {
    src: "/assets/img/Slab-Beam-Reinforcement-Inspection-Bijoy24-Hall-DUET.webp",
    title: "Slab & Beam Reinforcement Inspection – Bijoy 24 Hall, DUET",
    desc: "We are inspecting slab and beam reinforcement, including hooks, bends, corner reinforcement, and other reinforcement detailing during the upward extension work of Bijoy 24 Hall at DUET.",
    category: "Site visits",
    date: "Jul 22, 2026",
    fit: "contain",
    alt: "We are inspecting slab and beam reinforcement, including hooks, bends, corner reinforcement, and other reinforcement detailing during the upward extension work of Bijoy 24 Hall at DUET."
  },
  {
    src: "/assets/img/Certificate-Basic-Programming-with-Python.webp",
    title: "Basic Programming with Python Certificate",
    desc: "Certificate awarded to Md Sakibul Hasan for successfully completing the Basic Programming with Python training from April to May 2026 under the EDGE Project of Bangladesh Computer Council and ICT Division.",
    category: "Certificates",
    date: "Jul 19, 2026",
    fit: "contain",
    alt: "Certificate awarded to Md Sakibul Hasan for successfully completing the Basic Programming with Python training from April to May 2026 under the EDGE Project of Bangladesh Computer Council and ICT Division."
  }
];

const $ = (id) => document.getElementById(id);
const grid = $("grid"), filters = $("filters"), search = $("search"), statusEl = $("status");
const viewer = $("viewer");
let activeCat = "All", query = "", visible = [], current = 0, lastFocus = null;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

function buildFilters() {
  const cats = ["All", ...new Set([...categoryOrder, ...photos.map((p) => p.category)])];
  filters.replaceChildren(...cats.map((c) => {
    const count = c === "All" ? photos.length : photos.filter((p) => p.category === c).length;
    const b = el("button", "chip", `${c} (${count})`);
    b.type = "button";
    b.setAttribute("aria-pressed", String(c === activeCat));
    b.onclick = () => { activeCat = c; buildFilters(); render(); };
    return b;
  }));
}

function render() {
  const q = query.trim().toLowerCase();
  visible = photos.filter((p) =>
    (activeCat === "All" || p.category === activeCat) &&
    (!q || (p.title + " " + p.desc + " " + p.category).toLowerCase().includes(q)));

  grid.replaceChildren(...visible.map((p, i) => {
    const col = el("div", "col-6 col-md-4 col-lg-3");
    const card = el("button", "card gcard h-100");
    card.type = "button";
    card.setAttribute("aria-label", "Open " + p.title);
    const frame = el("span", "frame" + (p.fit === "contain" ? " doc" : ""));
    const img = el("img");
    img.alt = p.alt; img.loading = "lazy";
    img.onload = () => img.classList.add("in");
    img.onerror = () => frame.classList.add("missing");
    img.src = p.src;
    frame.append(img);
    const meta = el("span", "meta");
    meta.append(el("span", "tag", p.category), el("strong", "cap-title", p.title), el("span", "cap-desc", p.desc));
    if (p.date) {
      const d = el("span", "cap-date");
      const icon = el("i", "bi bi-calendar3 me-2");
      icon.setAttribute("aria-hidden", "true");
      d.append(icon, p.date);
      meta.append(d);
    }
    card.append(frame, meta);
    card.onclick = () => openViewer(i);
    col.append(card);
    return col;
  }));

  statusEl.textContent = visible.length
    ? `Showing ${visible.length} of ${photos.length} photos`
    : (!query.trim() && activeCat !== "All")
      ? `No photos in "${activeCat}" yet. They will appear here soon.`
      : "No photos match your search. Try another word or category.";
}

function show(i) {
  current = (i + visible.length) % visible.length;
  const p = visible[current];
  $("vimg").src = p.src; $("vimg").alt = p.alt;
  $("vtitle").textContent = p.title;
  $("vdesc").textContent = p.desc;
  $("vcount").textContent = `${current + 1} / ${visible.length}`;
  $("vprev").hidden = $("vnext").hidden = visible.length < 2;
}
function openViewer(i) { lastFocus = document.activeElement; show(i); viewer.showModal(); }

$("vclose").onclick = () => viewer.close();
$("vprev").onclick = () => show(current - 1);
$("vnext").onclick = () => show(current + 1);
viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener("close", () => lastFocus && lastFocus.focus());
document.addEventListener("keydown", (e) => {
  if (!viewer.open || visible.length < 2) return;
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// Swipe on touch screens
let x0 = null;
viewer.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
viewer.addEventListener("touchend", (e) => {
  if (x0 === null || visible.length < 2) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  x0 = null;
});

search.addEventListener("input", () => { query = search.value; render(); });
buildFilters();
render();

// Footer year, hero slider, back-to-top
$("copyright-year").textContent = new Date().getFullYear();
const heroSlides = document.querySelectorAll(".hero-slide");
let heroIdx = 0;
if (heroSlides.length > 1) setInterval(() => {
  heroSlides[heroIdx].classList.remove("active");
  heroIdx = (heroIdx + 1) % heroSlides.length;
  heroSlides[heroIdx].classList.add("active");
}, 4000);
const topBtn = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => { topBtn.style.display = window.scrollY > 300 ? "block" : "none"; });
topBtn.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
