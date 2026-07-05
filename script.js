const filterButtons = document.querySelectorAll(".filter-button");
const cards = document.querySelectorAll(".toolkit-card");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");
const tabButtons = document.querySelectorAll(".tab-button");
const copyButtons = document.querySelectorAll(".copy-button");
const navLinks = document.querySelectorAll(".nav-list a");

let activeFilter = "all";

function normalize(value) {
  return value.toLowerCase().trim();
}

function applyFilters() {
  const term = normalize(searchInput?.value || "");

  cards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.type === activeFilter;
    const matchesSearch = !term || normalize(card.textContent).includes(term);
    card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    applyFilters();
  });
});

searchInput?.addEventListener("input", applyFilters);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".script-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(`tab-${button.dataset.tab}`)?.classList.add("active");
  });
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(text);
      showToast("تم النسخ");
    } catch {
      showToast("تعذر النسخ");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-30% 0px -62% 0px", threshold: 0.01 }
);

document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
