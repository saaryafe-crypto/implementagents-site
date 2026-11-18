// nav border once scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;

// hero: type each industry and play its video on the big stage; tabs below show progress
const stage = document.getElementById('stage');
if (stage && window.HERO) {
  const vids = [...stage.querySelectorAll('video')];
  const tabs = [...document.querySelectorAll('#reelTabs button')];
  const rot = document.getElementById('rot');
  const DUR = 4000;
  document.documentElement.style.setProperty('--dur', DUR / 1000 + 's');
  let i = 0, typing, cycle;
  const show = n => {
    i = n;
    vids.forEach((v, k) => { if (k === n) { v.currentTime = 0; v.play().catch(() => {}); v.classList.add('on'); } else { v.classList.remove('on'); } });
    tabs.forEach((t, k) => { t.classList.remove('on'); void t.offsetWidth; if (k === n) t.classList.add('on'); });
    const word = window.HERO[n];
    clearInterval(typing);
    if (still) { rot.textContent = word; return; }
    let k = 0; rot.textContent = '';
    typing = setInterval(() => { rot.textContent = word.slice(0, ++k); if (k >= word.length) clearInterval(typing); }, 45);
  };
  const start = () => { clearInterval(cycle); if (!still) cycle = setInterval(() => show((i + 1) % vids.length), DUR); };
  tabs.forEach((t, k) => t.onclick = () => { show(k); start(); });
  show(0); start();
}

// industry picker
const inds = document.getElementById('inds');
if (inds) {
  const pick = k => {
    inds.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.ind === k));
    document.querySelectorAll('#cards .story').forEach(c => c.classList.toggle('hide', c.dataset.ind !== k));
  };
  inds.onclick = e => { const b = e.target.closest('button'); if (b) pick(b.dataset.ind); };
  const fromHash = () => { const m = location.hash.match(/^#ind-(\w+)/); if (m) { pick(m[1]); document.getElementById('problems').scrollIntoView(); } };
  addEventListener('hashchange', fromHash); fromHash();
}
