/* ============================================
   牛牛老蘇補給站 — 漢堡選單開關
   ============================================ */
(function () {
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var overlay = document.getElementById("nav-overlay");
  if (!toggle || !menu) return;

  function setMenu(open) {
    toggle.classList.toggle("active", open);
    menu.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", function () {
    setMenu(!menu.classList.contains("open"));
  });
  if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
})();
