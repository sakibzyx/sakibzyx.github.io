// ADD NEW PHOTOS HERE: copy one block, change the values, keep the commas.
const photos = [
  {
    src: "assets/img/Certificate-Low-Carbon%20Concrete.webp",
    title: "Low-Carbon Concrete certificate",
    desc: "ACI University certificate program, completed August 18, 2026.",
    category: "Certificates",
    date: "Aug 2026",
    fit: "contain",
    alt: "ACI University Certificate Program awarded to Md Sakibul Hasan for successfully completing the Low-Carbon Concrete: Fundamentals, Materials, and Innovations program on August 18, 2026."
  },
  {
    src: "assets/img/DND-Project-Site-Visit.webp",
    title: "DND Project site visit",
    desc: "Shimrail Pump Station, Dhaka–Narayanganj–Demra Project, BWDB.",
    category: "Site visits",
    date: "",
    fit: "cover",
    alt: "Group photo of DUET students during a site visit to Shimrail Pump Station under the Dhaka–Narayanganj–Demra (DND) Project of the Bangladesh Water Development Board (BWDB)."
  }
];

const $ = id => document.getElementById(id);
const grid = $("grid"), filters = $("filters"), search = $("search"), status = $("status");
const viewer = $("viewer");
let activeCat = "All", query = "", visible = [], current = 0, lastFocus = null;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

function buildFilters() {
  const cats = ["All", ...new Set(photos.map(p => p.category))];
  filters.replaceChildren(...cats.map(c => {
    const count = c === "All" ? photos.length : photos.filter(p => p.category === c).length;
    const b = el("button", "chip", `${c} (${count})`);
    b.type = "button";
    b.setAttribute("aria-pressed", String(c === activeCat));
    b.onclick = () => { activeCat = c; buildFilters(); render(); };
    return b;
  }));
}

function render() {
  const q = query.trim().toLowerCase();
  visible = photos.filter(p =>
    (activeCat === "All" || p.category === activeCat) &&
    (!q || (p.title + " " + p.desc + " " + p.category).toLowerCase().includes(q)));

  grid.replaceChildren(...visible.map((p, i) => {
    const card = el("button", "card");
    card.type = "button";
    card.setAttribute("aria-label", "Open " + p.title);
    const frame = el("span", "frame" + (p.fit === "contain" ? " doc" : ""));
    const img = el("img");
    img.src = p.src; img.alt = p.alt; img.loading = "lazy";
    img.onload = () => img.classList.add("in");
    if (img.complete) img.classList.add("in");
    img.onerror = () => frame.classList.add("missing");
    frame.append(img);
    const meta = el("span", "meta");
    meta.append(el("span", "tag", p.category), el("strong", "", p.title));
    if (p.date) meta.append(el("small", "", p.date));
    card.append(frame, meta);
    card.onclick = () => open(i);
    return card;
  }));

  status.textContent = visible.length
    ? `Showing ${visible.length} of ${photos.length} photos`
    : "No photos match your search. Try another word or category.";
}

function show(i) {
  current = (i + visible.length) % visible.length;
  const p = visible[current];
  $("vimg").src = p.src; $("vimg").alt = p.alt;
  $("vtitle").textContent = p.title;
  $("vdesc").textContent = p.desc;
  $("vcount").textContent = `${current + 1} / ${visible.length}`;
  const multi = visible.length > 1;
  $("vprev").hidden = $("vnext").hidden = !multi;
}
function open(i) { lastFocus = document.activeElement; show(i); viewer.showModal(); }

$("vclose").onclick = () => viewer.close();
$("vprev").onclick = () => show(current - 1);
$("vnext").onclick = () => show(current + 1);
viewer.addEventListener("click", e => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener("close", () => lastFocus && lastFocus.focus());
document.addEventListener("keydown", e => {
  if (!viewer.open) return;
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});
// Swipe on touch screens
let x0 = null;
viewer.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
viewer.addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  x0 = null;
});

search.addEventListener("input", () => { query = search.value; render(); });
buildFilters();
render();
