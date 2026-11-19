// nav border once scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;

// hero: crossfade the stage videos. Each clip plays its own length (between 7 and 14 seconds).
const stage = document.getElementById('stage');
if (stage && stage.querySelectorAll('video').length > 1) {
  const vids = [...stage.querySelectorAll('video')];
  const MIN = 7, MAX = 14;
  let i = 0, timer;
  vids.forEach(v => { v.loop = true; });
  const show = n => {
    i = n;
    vids.forEach((v, k) => { if (k === n) { v.currentTime = 0; v.play().catch(() => {}); v.classList.add('on'); } else { v.classList.remove('on'); } });
    if (still) return;
    const v = vids[n];
    const next = () => { clearTimeout(timer); const d = Math.min(MAX, Math.max(MIN, v.duration || MIN)); timer = setTimeout(() => show((i + 1) % vids.length), d * 1000); };
    if (v.readyState >= 1) next(); else v.addEventListener('loadedmetadata', next, { once: true });
  };
  show(0);
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
