// Minideas: remembers the reader's language and drives the swipeable card stack.
// Pages are fully rendered at build time; without this script the panels still scroll sideways.
(() => {
  const store = {
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  store.set("lang", document.documentElement.lang);

  // Light by default; the sun/moon button switches theme and remembers it (the page head applies it before paint).
  const themeBtn = document.getElementById("theme");
  if (themeBtn) {
    const root = document.documentElement;
    const label = () => { const dark = root.dataset.theme === "dark"; themeBtn.setAttribute("aria-label", dark ? themeBtn.dataset.light : themeBtn.dataset.dark); themeBtn.title = themeBtn.getAttribute("aria-label"); };
    themeBtn.hidden = false;
    label();
    themeBtn.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      store.set("theme", root.dataset.theme);
      label();
    });
  }

  // Switching language keeps you on the same panel.
  document.querySelectorAll(".lang a").forEach(a => a.addEventListener("click", () => {
    store.set("lang", a.hreflang);
    if (/^#p\d+$/.test(location.hash)) a.href = a.href.split("#")[0] + location.hash;
  }));

  // Share: the share sheet on touch screens (it lists Facebook, Messenger, Zalo… when installed); elsewhere a menu
  // of Facebook, LinkedIn and copy link, since computers' share sheets only offer system apps. Links keep the #pN panel.
  const share = document.getElementById("share");
  if (share) {
    const label = share.querySelector("span");
    const original = label.textContent;
    const menu = document.getElementById("share-menu");
    const link = () => location.origin + location.pathname + location.hash;
    const open = on => { menu.hidden = !on; share.setAttribute("aria-expanded", on); };
    async function copy() {
      const url = link();
      try { await navigator.clipboard.writeText(url); } catch (e) { window.prompt(share.dataset.copyPrompt, url); return; }
      label.textContent = share.dataset.copied;
      setTimeout(() => { label.textContent = original; }, 2000);
    }
    share.hidden = false;
    share.addEventListener("click", async () => {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        try { await navigator.share({ title: document.title, text: share.dataset.text, url: link() }); } catch (e) { /* closed the sheet */ }
        return;
      }
      if (!menu.hidden) return open(false);
      menu.querySelectorAll("a[data-to]").forEach(a => { a.href = a.dataset.to + encodeURIComponent(link()); });
      open(true);
      // under the button, right-aligned; flipped when that would leave the screen (row wrapped, or end of the page)
      const b = share.getBoundingClientRect();
      menu.classList.toggle("from-left", b.right < menu.offsetWidth + 8);
      menu.classList.toggle("up", b.bottom + menu.offsetHeight + 14 > innerHeight && b.top > menu.offsetHeight + 14);
      menu.querySelector("a, button").focus();
    });
    menu.addEventListener("click", e => {
      const item = e.target.closest("a, button");
      if (!item) return;
      if (item.hasAttribute("data-copy")) copy();
      open(false);
      share.focus();
    });
    document.addEventListener("click", e => { if (!menu.hidden && !e.target.closest(".share-wrap")) open(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !menu.hidden) { open(false); share.focus(); } });
  }

  // Copy buttons (the feed's address on the Follow page): copy, then show "Copied" for a moment. The button holds both
  // labels in one spot, so it keeps its width; the status next to it tells screen readers.
  document.querySelectorAll("[data-copy-text]").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copyText); } catch (e) { return; }
    const status = b.nextElementSibling;
    b.classList.add("copied"); status.textContent = b.querySelector(".done").textContent;
    setTimeout(() => { b.classList.remove("copied"); status.textContent = ""; }, 2000);
  }));

  // Follow by email: send the address to Kit in the background and say what happens next (Kit emails a link to
  // confirm). Without this, the browser posts the form and Kit shows its own page.
  const emailForm = document.getElementById("email-form");
  if (emailForm) {
    const status = emailForm.querySelector(".form-status"), send = emailForm.querySelector("button[type=submit]"), thanks = document.getElementById("email-thanks");
    emailForm.addEventListener("submit", async e => {
      e.preventDefault();
      const label = send.textContent;
      send.disabled = true; send.textContent = emailForm.dataset.sending; status.textContent = "";
      try {
        const res = await fetch(emailForm.action, { method: "POST", body: new FormData(emailForm), headers: { Accept: "application/json" } });
        if ((await res.json()).status !== "success") throw new Error();
        emailForm.reset(); emailForm.hidden = true; thanks.hidden = false;
      } catch (err) { status.textContent = emailForm.dataset.error; }
      send.disabled = false; send.textContent = label;
    });
  }

  // Suggest or send an article: send the form in the background and say thanks on the page (without this, the browser posts it
  // and Web3Forms shows its own page). data-ready is "no" until the build has a Web3Forms key.
  const form = document.getElementById("suggest-form");
  if (form) {
    const status = form.querySelector(".form-status"), send = form.querySelector("button[type=submit]"), thanks = document.getElementById("suggest-thanks");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (form.dataset.ready !== "yes") { status.textContent = form.dataset.error; return; }
      const label = send.textContent;
      send.disabled = true; send.textContent = form.dataset.sending; status.textContent = "";
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!(await res.json()).success) throw new Error();
        form.reset(); form.hidden = true; thanks.hidden = false;
      } catch (err) { status.textContent = form.dataset.error; }
      send.disabled = false; send.textContent = label;
    });
    document.getElementById("suggest-again").addEventListener("click", () => { thanks.hidden = true; form.hidden = false; form.querySelector("input[name=topic]").focus(); });
    // example questions: a tap puts one in the topic field (or the start of one, like "Book: ", for the reader to finish),
    // which keeps the focus, with the cursor at the end, so the reader sees it filled in
    const examples = form.querySelector(".examples"), topic = form.querySelector("input[name=topic]");
    examples.hidden = false;
    examples.addEventListener("click", e => {
      const b = e.target.closest("[data-example]");
      if (!b) return;
      topic.value = b.dataset.example;
      topic.focus();
      topic.setSelectionRange(topic.value.length, topic.value.length);
    });
  }

  // "New" marks show until their date (the build sets it), so a page built weeks ago doesn't keep calling old things new.
  const today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll(".new-mark").forEach(m => { m.hidden = today > m.dataset.until; });

  const viewer = document.getElementById("viewer");
  if (!viewer) return;
  const d = viewer.dataset;
  const track = document.getElementById("track");
  const dots = [...viewer.querySelectorAll(".dot")];
  const prev = document.getElementById("prev"), next = document.getElementById("next");
  const n = track.children.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let panel = -1;
  viewer.querySelector(".controls").hidden = false;

  function update(j) {
    if (j === panel) return;
    panel = j;
    dots.forEach((dot, k) => dot.setAttribute("aria-current", k === j ? "true" : "false"));
    prev.textContent = j === 0 && d.prevUrl ? d.tPrevIdea : d.tBack;
    prev.disabled = j === 0 && !d.prevUrl;
    next.textContent = j < n - 1 ? d.tNext : d.nextUrl ? d.tNextIdea : d.tDone;
    next.disabled = j === n - 1 && !d.nextUrl;
    try { history.replaceState(null, "", j ? `#p${j + 1}` : location.pathname + location.search); } catch (e) {}
  }
  const go = j => track.scrollTo({ left: j * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
  function step(dir) {
    const j = panel + dir;
    if (j >= 0 && j < n) go(j);
    else if (dir > 0 && d.nextUrl) location.href = d.nextUrl;
    else if (dir < 0 && d.prevUrl) location.href = d.prevUrl;
  }

  let raf = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => update(Math.round(track.scrollLeft / track.clientWidth)));
  }, { passive: true });
  dots.forEach((dot, k) => dot.addEventListener("click", () => go(k)));
  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  document.addEventListener("keydown", e => {
    if (e.altKey || e.metaKey || e.ctrlKey || /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });
  addEventListener("resize", () => { track.scrollLeft = panel * track.clientWidth; });

  const m = /^#p(\d+)$/.exec(location.hash);
  const start = m ? Math.min(Math.max(+m[1] - 1, 0), n - 1) : 0;
  track.scrollLeft = start * track.clientWidth;
  update(start);
})();
