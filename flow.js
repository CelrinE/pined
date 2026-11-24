/* PINed flow helper, shared by index.html (wrapper), prototype.html (main) and the two sub pages.
   Pages never navigate on their own: they ask the wrapper's router (PINRouter) to run a transition.
   Opened without the wrapper, they fall back to a plain page load. */
(function () {
  'use strict';
  var URLS = { main: 'prototype.html', 'sub-light': 'sub-light.html', 'sub-dark': 'sub-dark.html' };

  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { /* private mode: flow still works, just without memory */ } return null; }
  function visited() { try { return JSON.parse(store('pined.visited') || '[]'); } catch (e) { return []; } }
  function addVisited(list) {
    if (!list || !list.length) return;
    var s = visited(); list.forEach(function (n) { if (s.indexOf(n) < 0) s.push(n); });
    store('pined.visited', JSON.stringify(s));
  }
  // dest: 'main' | 'sub-light' | 'sub-dark'; o: { theme:'L'|'D', y:number } for main
  function url(dest, o) {
    o = o || {};
    var u = URLS[dest] || dest;
    if (dest === 'main') {
      var p = new URLSearchParams({ nointro: '1', resume: '1', theme: o.theme || 'L', y: String(Math.round(o.y || 0)) });
      var v = visited(); if (v.length) p.set('visited', v.join(','));
      u += '?' + p.toString();
    }
    return u;
  }
  function router() { try { return window.parent !== window && window.parent.PINRouter; } catch (e) { return null; } }
  function go(dest, o) {
    o = o || {};
    addVisited(o.visit);
    var r = router();
    if (r) r.go(dest, o); else location.href = url(dest, o);
  }
  window.PIN_URL = url;
  window.PIN_GO = go;
  window.PIN_VISITED = visited;
  window.PIN_STORE = store;
  // a page tells the wrapper it has drawn its first frame
  window.PIN_READY = function () { document.documentElement.setAttribute('data-ready', '1'); };
})();
