const BADGE_ID = "threadpulse-overlay";

function injectBadge() {
  if (document.getElementById(BADGE_ID)) return;

  const el = document.createElement("div");
  el.id = BADGE_ID;
  el.innerHTML =
    '<span>ThreadPulse</span> <small>monitoring active</small>';
  document.body.appendChild(el);
}

injectBadge();
