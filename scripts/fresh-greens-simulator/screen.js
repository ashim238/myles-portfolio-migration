(() => {
  const screen = document.getElementById("screen");
  const status = document.getElementById("status");
  const headers = {"x-fg-preview": "1"};
  let image;
  let start;
  let visible = true;
  let sending = 0;
  let queue = Promise.resolve();
  let characters = "";
  let typingTimer;
  let frameFailures = 0;
  let reportedState;
  const referrer = document.referrer ? new URL(document.referrer).origin : window.location.ancestorOrigins?.[0];
  const parentOrigin = ["http://127.0.0.1:4391", "http://127.0.0.1:4396"].includes(referrer) ? referrer : undefined;
  function report(state) {
    if (reportedState === state || !parentOrigin || parent === window) return;
    reportedState = state;
    parent.postMessage({type:"fresh-greens-" + state}, parentOrigin);
  }
  const wait = ms => new Promise(done => setTimeout(done, ms));
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  observer.observe(document.getElementById("device"));

  async function redraw() {
    try {
      if (document.hidden || !visible || sending) return;
      const res = await fetch("/frame", {headers, cache:"no-store"});
      if (res.status === 409) return;
      if (!res.ok) throw Error();
      const next = URL.createObjectURL(await res.blob());
      const old = image;
      image = next;
      screen.src = next;
      if (old) URL.revokeObjectURL(old);
      frameFailures = 0;
      report("ready");
      status.textContent = "";
    } catch {
      if (!document.hidden && visible && !sending) {
        status.textContent = "Waiting for the Fresh Greens app…";
        if (++frameFailures >= 5) report("unavailable");
      }
    }
    finally { setTimeout(redraw, document.hidden || !visible ? 800 : 150); }
  }

  function send(payload) {
    sending++;
    queue = queue.then(async () => {
      for (let retry = 0; retry < 30; retry++) {
        const r = await fetch("/input", {method:"POST", headers:{...headers,"content-type":"application/json"}, body:JSON.stringify(payload)});
        if (r.ok) return;
        if (r.status !== 409) break;
        await wait(110);
      }
      status.textContent = "Select a control in Fresh Greens and try again.";
    }).catch(() => { status.textContent = "Waiting for the Fresh Greens app…"; }).finally(() => sending--);
  }
  function flush() {
    clearTimeout(typingTimer);
    if (characters) { send({operation:"text", text:characters}); characters = ""; }
  }
  function position(event) {
    const rect = screen.getBoundingClientRect();
    return [(event.clientX-rect.left)/rect.width, (event.clientY-rect.top)/rect.height];
  }
  screen.addEventListener("pointerdown", e => {
    if (!e.isPrimary || e.button !== 0) return;
    flush();
    screen.focus({preventScroll:true});
    start = position(e);
    screen.setPointerCapture(e.pointerId);
  });
  screen.addEventListener("pointercancel", () => { start = undefined; });
  screen.addEventListener("pointerup", e => {
    if (!start || !e.isPrimary) return;
    const end = position(e);
    const from = start;
    start = undefined;
    const inside = ([x,y]) => x >= 0 && x <= 1 && y >= .052 && y <= .975;
    if (!inside(from) || !inside(end)) return;
    if (Math.hypot(end[0]-from[0],end[1]-from[1]) > .025) send({operation:"drag",points:[...from,...end]});
    else send({operation:"tap",points:from});
  });
  screen.addEventListener("keydown", e => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return;
    if (["Backspace","Enter"].includes(e.key)) {
      e.preventDefault(); flush(); send({operation:e.key === "Enter" ? "return" : "backspace"});
    } else if ([...e.key].length === 1) {
      e.preventDefault(); characters += e.key;
      clearTimeout(typingTimer);
      if (characters.length >= 100) flush(); else typingTimer = setTimeout(flush, 180);
    }
  });
  screen.addEventListener("paste", e => {
    const text = (e.clipboardData?.getData("text/plain") || "").replace(/\p{Cc}/gu," ").slice(0,120);
    if (text) { e.preventDefault(); flush(); send({operation:"text",text}); }
  });
  redraw();
})();
