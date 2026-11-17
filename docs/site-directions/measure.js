/* Direction B mock-up only. Renders a live Naksha component into [data-spec] and draws
   dimension strings around it. Every number is read from the rendered element, then matched
   to the token that produced it, so the drawing cannot drift from the code. */
(function () {
  var h = React.createElement;
  var TOKENS = ["space-2", "space-4", "space-6", "space-8", "space-12", "space-16", "space-20", "space-24",
    "size-control-sm", "size-control-md", "size-control-lg", "size-control-touch-sm", "size-control-touch-md",
    "size-control-touch-lg", "size-icon-sm", "size-icon-md"];
  var STATES = [null, "hover", "active", "focus"];
  var STATE_NAMES = { null: "Rest", hover: "Hover", active: "Pressed", focus: "Focus" };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  function token(px, prefix) {
    var root = getComputedStyle(document.documentElement);
    var rem = parseFloat(root.fontSize);
    for (var i = 0; i < TOKENS.length; i++) {
      if (TOKENS[i].indexOf(prefix) !== 0) continue;
      var v = parseFloat(root.getPropertyValue("--" + TOKENS[i])) * rem;
      if (Math.abs(v - px) < 0.5) return TOKENS[i];
    }
    return null;
  }
  function svg(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, main, sub, anchor) {
    var t = svg("text", { x: x, y: y, "text-anchor": anchor || "start", class: "dim-t" }, parent);
    t.textContent = main;
    if (sub) { var s = svg("text", { x: x, y: y + 14, "text-anchor": anchor || "start", class: "dim-s" }, parent); s.textContent = sub; }
  }
  /* A dimension string: extension lines, the line itself, 45-degree ticks at both ends. */
  function dim(g, x1, y1, x2, y2) {
    svg("line", { x1: x1, y1: y1, x2: x2, y2: y2, class: "dim-l" }, g);
    [[x1, y1], [x2, y2]].forEach(function (p) {
      svg("line", { x1: p[0] - 4, y1: p[1] + 4, x2: p[0] + 4, y2: p[1] - 4, class: "dim-k" }, g);
    });
  }
  function ext(g, x1, y1, x2, y2) { svg("line", { x1: x1, y1: y1, x2: x2, y2: y2, class: "dim-e" }, g); }

  function draw(host) {
    var old = host.querySelector("svg.dims"); if (old) old.remove();
    var el = host.querySelector(host.dataset.measure); if (!el) return;
    var hr = host.getBoundingClientRect(), r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    var scale = parseFloat(cs.zoom) || 1; /* the specimen is drawn larger with CSS zoom, never transform: Button owns its transform */
    var x0 = r.left - hr.left, y0 = r.top - hr.top, x1 = x0 + r.width, y1 = y0 + r.height;
    var g = svg("svg", { class: "dims", width: hr.width, height: hr.height, "aria-hidden": "true" }, host);
    var hpx = r.height / scale, wpx = r.width / scale;
    var pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight);
    /* height, right side */
    var dx = x1 + 28; ext(g, x1 + 4, y0, dx + 6, y0); ext(g, x1 + 4, y1, dx + 6, y1); dim(g, dx, y0, dx, y1);
    text(g, dx + 14, (y0 + y1) / 2 - 2, Math.round(hpx) + "", token(hpx, "size-control") || "");
    /* padding, above */
    var dy = y0 - 28;
    ext(g, x0, y0 - 4, x0, dy - 6); ext(g, x0 + pl * scale, y0 - 4, x0 + pl * scale, dy - 6);
    ext(g, x1 - pr * scale, y0 - 4, x1 - pr * scale, dy - 6); ext(g, x1, y0 - 4, x1, dy - 6);
    dim(g, x0, dy, x0 + pl * scale, dy); dim(g, x1 - pr * scale, dy, x1, dy);
    text(g, x0, dy - 26, Math.round(pl) + "", token(pl, "space"));
    text(g, x1, dy - 26, Math.round(pr) + "", token(pr, "space"), "end");
    /* width, below: no token, it hugs the label */
    var by = y1 + 28; ext(g, x0, y1 + 4, x0, by + 6); ext(g, x1, y1 + 4, x1, by + 6); dim(g, x0, by, x1, by);
    text(g, (x0 + x1) / 2, by + 20, Math.round(wpx) + "", "hugs the label", "middle");
    /* notes with leaders: only where there is room for them */
    if (hr.width < 560) return;
    var fs = parseFloat(cs.fontSize), fw = cs.fontWeight;
    var note = host.dataset.note || "";
    svg("polyline", { points: [x0 + 6, y1 - 6, x0 - 40, y1 + 64, x0 - 120, y1 + 64].join(" "), class: "dim-e lead" }, g);
    svg("circle", { cx: x0 + 6, cy: y1 - 6, r: 2.5, class: "dim-dot" }, g);
    text(g, x0 - 120, y1 + 84, "Label " + Math.round(fs) + " / " + fw, "label-m, Archivo", "start");
    svg("polyline", { points: [x0, y0, x0 - 48, y0 - 48, x0 - 120, y0 - 48].join(" "), class: "dim-e lead" }, g);
    svg("circle", { cx: x0, cy: y0, r: 2.5, class: "dim-dot" }, g);
    text(g, x0 - 120, y0 - 70, "Corners " + parseFloat(cs.borderTopLeftRadius), note || "radius-control", "start");
  }

  function mount(host) {
    var spec = JSON.parse(host.dataset.spec);
    var stage = host.querySelector(".spec-stage");
    var label = host.querySelector("[data-state-label]");
    var root = ReactDOM.createRoot(stage);
    var i = 0;
    function render(state) {
      var p = Object.assign({}, spec.p); if (state) p.forceState = state;
      root.render(h(Naksha[spec.$c], p));
      if (label) label.textContent = STATE_NAMES[state];
      (host.closest("figure") || host).querySelectorAll("[data-step]").forEach(function (s) { s.toggleAttribute("data-on", s.dataset.step === String(state)); });
      requestAnimationFrame(function () { requestAnimationFrame(function () { draw(host); }); });
    }
    host._render = function (patch) { Object.assign(spec.p, patch); render(STATES[i]); };
    document.fonts.ready.then(function () { render(null); });
    if (!reduce && host.hasAttribute("data-cycle")) {
      setInterval(function () { i = (i + 1) % STATES.length; render(STATES[i]); }, 1800);
    }
    window.addEventListener("resize", function () { draw(host); });
  }
  document.querySelectorAll("[data-spec]").forEach(mount);
  window.NakshaMeasure = { draw: draw };
})();
