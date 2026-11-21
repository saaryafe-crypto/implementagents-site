// "Get in touch" form: every booking button opens it. Full name, phone number, company.
// FormSubmit emails Saar instantly so he can call right away, and copies saar@implementagents.com so the engine counts it.
(function () {
  var ENDPOINT = "https://formsubmit.co/ajax/947f141781a631b55cedc5695221a66e"; // FormSubmit emails each lead to Saar
  var css =
    ".lf-bg{position:fixed;inset:0;background:rgba(10,22,64,.55);display:none;align-items:center;justify-content:center;z-index:999;padding:16px}.lf-bg.on{display:flex}" +
    ".lf{background:#fff;border-radius:22px;width:100%;max-width:400px;padding:24px 22px 20px;box-shadow:0 30px 80px -20px rgba(10,22,64,.5);position:relative;font-family:Inter,-apple-system,sans-serif;color:#0b1530}" +
    ".lf h3{margin:0 0 4px;font:600 1.4rem 'Inter Tight',Inter,sans-serif;letter-spacing:-.02em}.lf .s{margin:0 0 14px;color:#5b6680;font-size:.95rem}" +
    ".lf .x{position:absolute;top:10px;right:12px;background:none;border:0;color:#5b6680;font-size:1.6rem;cursor:pointer;padding:4px 8px}" +
    ".lf .go{width:100%;height:56px;border:0;border-radius:14px;background:#2f5bff;color:#fff;font-size:1.08rem;font-weight:600;cursor:pointer}.lf .go:disabled{background:#c9d4ff;cursor:default}" +
    ".lf label{display:block;font-size:.85rem;color:#5b6680;margin:4px 0 6px}" +
    ".lf input.ph{height:60px;font-size:22px;text-align:center;letter-spacing:.03em}.lf input{width:100%;height:52px;border:1px solid #e3e8f2;border-radius:14px;padding:0 14px;font-size:17px;box-sizing:border-box;color:#0b1530;margin-bottom:12px}.lf input:focus{outline:none;border-color:#2f5bff}" +
    ".lf .bars{display:flex;gap:6px;margin:6px 44px 18px 0}.lf .bars i{flex:1;height:5px;border-radius:3px;background:#e3e8f2;transition:background .3s}.lf .bars i.on{background:#2f5bff}" +
    ".lf .bk{width:100%;margin-top:8px;height:40px;border:0;background:none;color:#5b6680;font-size:.95rem;cursor:pointer}.lf .ok b{font:600 1.5rem 'Inter Tight',Inter,sans-serif;letter-spacing:-.02em}.lf .hp{position:absolute;left:-9999px}.lf .go{margin-top:6px}.lf .f{margin:10px 0 0;color:#5b6680;font-size:.82rem;text-align:center}.lf .ok{text-align:center;padding:26px 0 14px}.lf .ok b{display:block;font-size:1.3rem;margin-bottom:6px}" +
    "@media(max-width:560px){.lf-bg{align-items:flex-end;padding:0}.lf{max-width:none;border-radius:22px 22px 0 0;max-height:94dvh;overflow:auto;padding:22px 18px calc(18px + env(safe-area-inset-bottom))}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var bg = document.createElement("div"); bg.className = "lf-bg"; document.body.appendChild(bg);
  var digits = "";

  function fmt(d) {
    if (!d) return "";
    if (d.length <= 3) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 3) + ") " + d.slice(3);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6, 10);
  }
  var STEPS = [
    { key: "name", label: "Full name", attrs: 'autocomplete="name" autocapitalize="words"' },
    { key: "phone", label: "Phone number", attrs: 'type="tel" inputmode="tel" autocomplete="tel"' },
    { key: "business", label: "Company", attrs: 'autocomplete="organization" autocapitalize="words"' }];
  var vals = {}, at = 0;
  function step1() { vals = {}; at = 0; render(); }
  function render() {
    var st = STEPS[at], last = at === STEPS.length - 1;
    bg.innerHTML = '<form class="lf" novalidate><button type="button" class="x" aria-label="Close">&times;</button>' +
      '<div class="bars">' + STEPS.map(function (_, i) { return '<i class="' + (i <= at ? "on" : "") + '"></i>'; }).join("") + "</div>" +
      '<h3>Get in touch</h3><p class="s">Let\'s make your business run itself.</p>' +
      '<label for="lf-i">' + st.label + '</label><input id="lf-i" ' + st.attrs + ' enterkeyhint="' + (last ? "send" : "next") + '">' +
      '<input class="hp" name="website" tabindex="-1" autocomplete="off">' +
      '<button type="submit" class="go">' + (last ? "Send" : "Next") + "</button>" +
      (at ? '<button type="button" class="bk">Back</button>' : "") + "</form>";
    var f = bg.querySelector("form"), inp = f.querySelector("#lf-i");
    inp.value = st.key === "phone" ? fmt(vals.phone || "") : (vals[st.key] || "");
    if (st.key === "phone") inp.addEventListener("input", function () {
      var d = inp.value.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10); inp.value = fmt(d); vals.phone = d;
    });
    var bk = f.querySelector(".bk"); if (bk) bk.addEventListener("click", function () { at--; render(); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (st.key !== "phone") vals[st.key] = inp.value.trim();
      var ok = st.key === "phone" ? (vals.phone || "").length === 10 : !!vals[st.key];
      if (!ok) { inp.focus(); inp.style.borderColor = "#e5484d"; return; }
      if (!last) { at++; render(); return; }
      send(f);
    });
    wireClose(); inp.focus();
  }
  function send(f) {
    var go = f.querySelector(".go"); go.disabled = true; go.textContent = "Sending...";
    var d = { name: vals.name, phone: fmt(vals.phone), business: vals.business, website: f.website.value, page: location.pathname,
      src: new URLSearchParams(location.search).get("utm_source") || document.referrer || "" };
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ Name: d.name, Phone: d.phone, Company: d.business, Page: d.page, Source: d.src, _honey: d.website, _subject: "Call now: " + d.phone + " " + d.business, _template: "table", _captcha: "false", _cc: "saar@implementagents.com" }) })
      .then(function (r) {
        if (!r.ok) throw 0;
        f.innerHTML = '<button type="button" class="x" aria-label="Close">&times;</button>' +
          '<div class="bars"><i class="on"></i><i class="on"></i><i class="on"></i></div>' +
          '<div class="ok"><b>Something great starts now.</b>Thanks, ' + vals.name.split(" ")[0].replace(/[<>&]/g, "") + '. We will call you shortly.</div>';
        wireClose();
      })
      .catch(function () { go.disabled = false; go.textContent = "Send"; });
  }
  function wireClose() { var x = bg.querySelector(".x"); if (x) x.addEventListener("click", close); }
  function open(e) { if (e) e.preventDefault(); digits = ""; bg.classList.add("on"); document.documentElement.style.overflow = "hidden"; step1(); }
  function close() { bg.classList.remove("on"); document.documentElement.style.overflow = ""; }
  bg.addEventListener("click", function (e) { if (e.target === bg) close(); });
  document.addEventListener("keydown", function (e) { if (bg.classList.contains("on") && e.key === "Escape") close(); });
  document.querySelectorAll('a[href*="cal.com/implementagents"]').forEach(function (a) {
    a.removeAttribute("target"); a.setAttribute("href", "#call"); a.addEventListener("click", open);
  });
  if (location.hash === "#call") open();
})();
