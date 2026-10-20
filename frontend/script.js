// Application status check: sends a real HEAD request to the server that served this page.
const els = {
  badge: document.getElementById("statusBadge"),
  status: document.getElementById("mStatus"),
  latency: document.getElementById("mLatency"),
  server: document.getElementById("mServer"),
  time: document.getElementById("mTime"),
  note: document.getElementById("statusNote"),
  btn: document.getElementById("checkBtn"),
};

function setBadge(kind, text) {
  els.badge.className = "badge badge-" + kind;
  els.badge.textContent = text;
}

async function checkApp() {
  setBadge("wait", "Checking...");
  els.btn.disabled = true;
  els.note.textContent = "";

  if (window.location.protocol === "file:") {
    setBadge("wait", "Open through a web server");
    els.note.textContent = "The status check needs the page to be served over HTTP (for example from Nginx), not opened as a local file.";
    els.btn.disabled = false;
    return;
  }

  const start = performance.now();
  try {
    const res = await fetch(window.location.pathname, { method: "HEAD", cache: "no-store" });
    const ms = Math.round(performance.now() - start);

    els.status.textContent = res.status + " " + (res.statusText || (res.ok ? "OK" : ""));
    els.latency.textContent = ms + " ms";
    els.server.textContent = res.headers.get("server") || "Not exposed";
    els.time.textContent = new Date().toLocaleTimeString();

    if (res.ok) {
      setBadge("ok", "Online");
      els.note.textContent = "The server answered this request successfully.";
    } else {
      setBadge("bad", "Error " + res.status);
      els.note.textContent = "The server responded, but with an error status.";
    }
  } catch (err) {
    setBadge("bad", "Offline");
    els.status.textContent = "-";
    els.latency.textContent = "-";
    els.server.textContent = "-";
    els.time.textContent = new Date().toLocaleTimeString();
    els.note.textContent = "Could not reach the server. Check your connection and try again.";
  } finally {
    els.btn.disabled = false;
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
els.btn.addEventListener("click", checkApp);
checkApp();