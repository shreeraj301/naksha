/* Mounts live Naksha components into [data-nk] spans: {"$c": name, "p": props}. Used by the direction mock-ups only. */
(function () {
  var h = React.createElement;
  function val(v) {
    if (v === "$noop") return function () {};
    if (typeof v === "string" && v[0] === "$" && window.__ctl && window.__ctl[v.slice(1)]) return window.__ctl[v.slice(1)];
    if (Array.isArray(v)) return v.map(val);
    if (v && typeof v === "object") { if (v.$c) return el(v); var o = {}; for (var k in v) o[k] = val(v[k]); return o; }
    return v;
  }
  function el(s) { var p = {}; for (var k in s.p || {}) p[k] = val(s.p[k]); return h(Naksha[s.$c], p); }
  document.querySelectorAll("[data-nk]").forEach(function (n) {
    ReactDOM.createRoot(n).render(el(JSON.parse(n.getAttribute("data-nk"))));
  });
})();
