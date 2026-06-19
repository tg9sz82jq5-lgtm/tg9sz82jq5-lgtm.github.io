/* ─── Tiled SVG Viewer ─────────────────────────────────────────
   Architecture: same as Google Maps / Calculating Empires.
   Instead of scaling one giant image, the visible area is split
   into 512 px tiles.  Each tile renders a small SVG slice at the
   EXACT pixel density needed — so text is always crisp.
   The SVG itself is drawn once at low quality as an instant
   background; crisp tiles paint over it as they arrive.         */
(function () {
  /* ── constants ── */
  var SVG_PATH = 'public/diagram.svg';
  var SVG_W    = 8503.94;
  var SVG_H    = 3401.57;
  var DPR      = Math.min(window.devicePixelRatio || 1, 2);
  var TILE     = 512;          /* logical px per tile edge */
  var MAX_TILES = 96;          /* LRU cache limit          */

  /* ── state ── */
  var svgImg     = null;
  var svgLoading = false;
  var scale      = 1;
  var minScale   = 1;          /* height fills viewport – can't zoom out past this */
  var maxScale   = 1;          /* 5 × min                                          */
  var ox = 0, oy = 0;         /* diagram top-left in viewport logical px           */
  var rafPending = false;

  /* tile cache */
  var cache      = {};         /* key → <canvas>  */
  var cacheOrder = [];         /* insertion order for LRU eviction */
  var inFlight   = {};         /* key → true while rendering       */

  /* input */
  var dragging      = false;
  var dragX0, dragY0, oxAtDrag, oyAtDrag;
  var lastPinchDist = null;

  /* ── DOM ── */
  var overlay   = document.getElementById('pdf-overlay');
  var viewport  = document.getElementById('pdf-viewport');
  var loading   = document.getElementById('pdf-loading');
  var zoomLabel = document.getElementById('pdf-zoom-label');

  /* main canvas */
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;position:absolute;top:0;left:0;';
  viewport.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  /* ── helpers ── */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function vr() { return viewport.getBoundingClientRect(); }

  function resizeCanvas() {
    var r = vr();
    canvas.width  = Math.round(r.width  * DPR);
    canvas.height = Math.round(r.height * DPR);
    canvas.style.width  = r.width  + 'px';
    canvas.style.height = r.height + 'px';
  }

  function computeLimits() {
    var r = vr();
    /* Minimum zoom: diagram height exactly equals viewport height.
       You cannot zoom out further — the diagram always fills the screen
       top-to-bottom and you scroll left/right to navigate.            */
    minScale = r.height / SVG_H;
    maxScale = minScale * 5;
  }

  /* ── pan clamping ──────────────────────────────────────────────
     No empty space ever appears around the diagram.
     When the diagram is narrower than the viewport it is centred;
     otherwise it is clamped so its edges never pass the viewport. */
  function clampPan() {
    var r  = vr();
    var dw = SVG_W * scale;
    var dh = SVG_H * scale;

    ox = (dw <= r.width)  ? (r.width  - dw) / 2 : clamp(ox, r.width  - dw, 0);
    oy = (dh <= r.height) ? (r.height - dh) / 2 : clamp(oy, r.height - dh, 0);
  }

  /* ── public API ── */
  window.openPdfViewer = function () {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    resizeCanvas();
    computeLimits();
    if (!svgImg && !svgLoading) { loadSvg(); }
    else if (svgImg)            { initView(); }
  };

  window.closePdfViewer = function () {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.pdfZoom = function (delta) { zoomFromCenter(scale * (1 + delta)); };
  window.pdfFit  = function ()      { initView(); };

  /* Start at minimum zoom (height fills viewport), left side in view */
  function initView() {
    computeLimits();
    scale = minScale;
    var r = vr();
    ox = 0;                             /* left-aligned  */
    oy = (r.height - SVG_H * scale) / 2; /* vertically centred (≈ 0) */
    clampPan();
    /* clear stale tiles from a previous session */
    cache = {}; cacheOrder = []; inFlight = {};
    scheduleFrame();
  }

  /* ── zoom (always from viewport centre) ── */
  function zoomFromCenter(newScale) {
    newScale = clamp(newScale, minScale, maxScale);
    var r  = vr();
    var cx = r.width  / 2;
    var cy = r.height / 2;
    ox = cx - (cx - ox) * (newScale / scale);
    oy = cy - (cy - oy) * (newScale / scale);
    scale = newScale;
    clampPan();
    scheduleFrame();
  }

  /* ── SVG load ── */
  function loadSvg() {
    svgLoading = true;
    loading.style.display = 'flex';

    svgImg = new Image();
    svgImg.onload = function () {
      svgLoading = false;
      loading.style.display = 'none';
      initView();
    };
    svgImg.onerror = function () {
      loading.textContent = 'Could not load diagram — check public/diagram.svg';
    };
    svgImg.src = SVG_PATH;
  }

  /* ── tile system ────────────────────────────────────────────────
     Key insight: each tile canvas is small (~512 px).
     ctx.drawImage(svgImg, 0, 0, fullW, fullH) on a small canvas
     causes WebKit to clip the SVG render to the canvas bounds, so
     only the visible slice is rasterised — at full native quality. */

  /* Snap scale to ½% buckets so nearby zoom levels share tiles. */
  function snapScale(s) { return Math.round(s * 200) / 200; }
  function tileKey(s, tx, ty) {
    return snapScale(s).toFixed(3) + '_' + tx + '_' + ty;
  }

  function visibleTiles() {
    var r  = vr();
    var dw = SVG_W * scale, dh = SVG_H * scale;
    var l  = Math.max(0, -ox),          t  = Math.max(0, -oy);
    var ri = Math.min(dw, r.width  - ox), b  = Math.min(dh, r.height - oy);
    if (ri <= l || b <= t) return [];

    var tiles = [];
    var tx0 = Math.floor(l / TILE), ty0 = Math.floor(t / TILE);
    var tx1 = Math.ceil (ri/ TILE), ty1 = Math.ceil (b / TILE);
    for (var ty = ty0; ty < ty1; ty++)
      for (var tx = tx0; tx < tx1; tx++)
        tiles.push({ tx: tx, ty: ty });
    return tiles;
  }

  function enqueueTile(s, tx, ty) {
    var ss  = snapScale(s);
    var key = tileKey(s, tx, ty);
    if (cache[key] || inFlight[key]) return;
    inFlight[key] = true;

    /* Use requestIdleCallback when available so tile rendering
       yields to gestures and rAF, keeping scrolling at 60 fps. */
    var idle = window.requestIdleCallback
      ? function (fn) { requestIdleCallback(fn, { timeout: 200 }); }
      : function (fn) { setTimeout(fn, 0); };

    idle(function () {
      if (!svgImg) { delete inFlight[key]; return; }

      /* Render the SVG slice for this tile */
      var tc   = document.createElement('canvas');
      tc.width  = TILE * DPR;
      tc.height = TILE * DPR;
      var tCtx = tc.getContext('2d');
      tCtx.imageSmoothingEnabled = true;
      tCtx.imageSmoothingQuality = 'high';
      tCtx.scale(DPR, DPR);
      /* Translate so that the SVG pixel matching this tile's origin
         lands at (0,0) of the tile canvas, then draw the whole SVG
         at the target scale.  WebKit clips to canvas bounds.       */
      tCtx.translate(-tx * TILE, -ty * TILE);
      tCtx.drawImage(svgImg, 0, 0, SVG_W * ss, SVG_H * ss);

      /* LRU eviction */
      if (cacheOrder.length >= MAX_TILES) {
        var evict = cacheOrder.shift();
        delete cache[evict];
      }
      cache[key] = tc;
      cacheOrder.push(key);
      delete inFlight[key];
      scheduleFrame();
    });
  }

  /* ── render loop ── */
  function scheduleFrame() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(paint);
  }

  function paint() {
    rafPending = false;
    if (!svgImg) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(DPR, DPR);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    var tiles = visibleTiles();

    /* Pass 1 — check whether all visible tiles are ready */
    var allReady = true;
    for (var i = 0; i < tiles.length; i++) {
      if (!cache[tileKey(scale, tiles[i].tx, tiles[i].ty)]) {
        allReady = false; break;
      }
    }

    /* Pass 2 — draw low-quality background only while tiles load */
    if (!allReady) {
      ctx.drawImage(svgImg, ox, oy, SVG_W * scale, SVG_H * scale);
    }

    /* Pass 3 — composite crisp tiles on top */
    for (var j = 0; j < tiles.length; j++) {
      var t   = tiles[j];
      var key = tileKey(scale, t.tx, t.ty);

      if (cache[key]) {
        /* Destination on main canvas */
        var dx = ox + t.tx * TILE;
        var dy = oy + t.ty * TILE;
        /* Clip to actual diagram extent (last row/column may be partial) */
        var dw = Math.min(TILE, SVG_W * scale - t.tx * TILE);
        var dh = Math.min(TILE, SVG_H * scale - t.ty * TILE);
        /* Source pixels inside the tile canvas */
        var sw = dw * DPR;
        var sh = dh * DPR;
        ctx.drawImage(cache[key], 0, 0, sw, sh, dx, dy, dw, dh);
      } else {
        enqueueTile(scale, t.tx, t.ty);
      }
    }

    ctx.restore();

    /* Label: 100 % = height fills viewport (minimum zoom) */
    zoomLabel.textContent = Math.round((scale / minScale) * 100) + '%';
  }

  /* ── input: mouse ── */
  viewport.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    dragging  = true;
    dragX0    = e.clientX; dragY0    = e.clientY;
    oxAtDrag  = ox;        oyAtDrag  = oy;
    viewport.classList.add('dragging');
  });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    ox = oxAtDrag + (e.clientX - dragX0);
    oy = oyAtDrag + (e.clientY - dragY0);
    clampPan();
    scheduleFrame();
  });

  window.addEventListener('mouseup', function () {
    dragging = false;
    viewport.classList.remove('dragging');
  });

  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomFromCenter(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  /* ── input: touch ── */
  viewport.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      dragging      = true;
      dragX0        = e.touches[0].clientX; dragY0 = e.touches[0].clientY;
      oxAtDrag      = ox; oyAtDrag = oy;
      lastPinchDist = null;
    } else if (e.touches.length === 2) {
      dragging = false;
      var dx = e.touches[1].clientX - e.touches[0].clientX;
      var dy = e.touches[1].clientY - e.touches[0].clientY;
      lastPinchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: false });

  viewport.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      ox = oxAtDrag + (e.touches[0].clientX - dragX0);
      oy = oyAtDrag + (e.touches[0].clientY - dragY0);
      clampPan();
      scheduleFrame();
    } else if (e.touches.length === 2 && lastPinchDist !== null) {
      var dx   = e.touches[1].clientX - e.touches[0].clientX;
      var dy   = e.touches[1].clientY - e.touches[0].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      zoomFromCenter(scale * (dist / lastPinchDist));
      lastPinchDist = dist;
    }
  }, { passive: false });

  viewport.addEventListener('touchend', function () {
    dragging = false; lastPinchDist = null;
  });

  /* ── input: keyboard ── */
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')             closePdfViewer();
    if (e.key === '+' || e.key === '=') pdfZoom(0.25);
    if (e.key === '-')                  pdfZoom(-0.25);
    if (e.key === '0')                  pdfFit();
  });

  /* ── resize ── */
  window.addEventListener('resize', function () {
    if (!overlay.classList.contains('open')) return;
    resizeCanvas();
    computeLimits();
    initView();
  });
}());
