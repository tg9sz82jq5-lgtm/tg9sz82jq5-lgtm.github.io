var SOFTWARE_CATEGORY_ORDER = [
  "Special Effects",
  "3D Software",
  "Plug-In",
  "Animation Software",
  "Editing Software",
  "Cutting Software"
];

var DATA = {
  producers: [
    { id:"pr1",  section:"Companies", name:"Temu", meta:"±2592 employees, ±838,4M revenue" },
    { id:"pr2",  section:"Companies", name:"T-Series", meta:"±1415 employees, ±110M revenue" },
    { id:"pr3",  section:"Companies", name:"Pinkfong", meta:"340 employees, 71,4M revenue" },
    { id:"pr4",  section:"Companies", name:"ChuChu TV", meta:"±100 employees, ±7M revenue" },
    { id:"pr13", section:"Companies", name:"LooLoo Kids", meta:"±100 employees, 120K revenue" },
    { id:"pr5",  section:"Companies", name:"London Alley", meta:"±60 employees, ±1-5M revenue" },
    { id:"pr6",  section:"Companies", name:"Mirada", meta:"±52 employees, ±11M revenue" },
    { id:"pr7",  section:"Companies", name:"Motion Theory", meta:"50 employees, Bankrupt" },
    { id:"pr8",  section:"Companies", name:"Doomsday Entertainment", meta:"±35 employees, ±1M revenue" },
    { id:"pr9",  section:"Companies", name:"Zach King", meta:"25 employees, No revenue data" },
    { id:"pr10", section:"Companies", name:"Jingle Toons", meta:"±22 employees, 190K revenue" },
    { id:"pr11", section:"Companies", name:"Cocomelon", meta:"±20 employees, 120M revenue" },
    { id:"pr12", section:"Companies", name:"Black Dog Films", meta:"±19 employees, ±6M revenue" },
    { id:"pr14", section:"Companies", name:"Elastic People", meta:"9 employees, No revenue data" },
    { id:"pr15", section:"Companies", name:"Kaktus Film", meta:"5 employees, No revenue data" },
    { id:"pr16", section:"Companies", name:"James Charles", meta:"2-4 employees, No revenue data" },
    { id:"pr30", section:"Parent Companies", name:"Moonbug Entertainment", meta:"567 employees, 53,8M revenue" },
    { id:"pr31", section:"Parent Companies", name:"Mora TV", meta:"12 employees, ±1M revenue" },
    { id:"pr17", section:"Individuals", name:"Justin Bieber, Scott Braun, Parris Goebel", meta:"3 individuals, No revenue data" },
    { id:"pr18", section:"Individuals", name:"Andrew Cedar, Charlie Puth", meta:"2 individuals, Cedar: No revenue data · Puth: ±2,5M revenue" },
    { id:"pr19", section:"Individuals", name:"Antonio Parada, Zak Powers", meta:"2 individuals, No revenue data" },
    { id:"pr20", section:"Individuals", name:"Dave Jensen", meta:"Individual, No revenue data" },
    { id:"pr21", section:"Individuals", name:"Cho Soo-Hyun", meta:"Individual, No revenue data" },
    { id:"pr22", section:"Individuals", name:"Cameron Duddy", meta:"Individual, No revenue data" },
    { id:"pr23", section:"Individuals", name:"ArtNoux", meta:"Individual, No revenue data" },
    { id:"pr24", section:"Individuals", name:"Honna Kimmerer", meta:"Individual, No revenue data" },
    { id:"pr25", section:"Individuals", name:"Leah Halton", meta:"Individual, No revenue data" },
    { id:"pr26", section:"Individuals", name:"Bella Poarch", meta:"Individual, No revenue data" },
    { id:"pr27", section:"Individuals", name:"Nyadollie", meta:"Individual, No revenue data" },
    { id:"pr28", section:"Individuals", name:"Sorrel Horse", meta:"Individual, No revenue data" },
    { id:"pr29", section:"Individuals", name:"Daexo", meta:"Individual, No revenue data" }
  ],

  projects: [
    { id:"mv1",  section:"Children Songs", name:"Baby Shark Dance", meta:"Pinkfong Baby Shark, 16.7B views, June 17, 2016, YouTube", producer:"pr3",  software:["sw4","sw12","sw13","sw14"], softwareCategories:["Special Effects","Animation Software","Editing Software"] },
    { id:"mv2",  section:"Children Songs", name:"Wheels on the Bus", meta:"Cocomelon, 8.59B views, May 24, 2018, YouTube", producer:"pr11", software:["sw4","sw6","sw7"], softwareUncertain:["sw4","sw6","sw7"], softwareCategories:["Special Effects","3D Software"] },
    { id:"mv3",  section:"Children Songs", name:"Bath Song", meta:"Cocomelon, 7.39B views, May 2, 2018, YouTube", producer:"pr11", software:["sw4","sw6","sw7"], softwareUncertain:["sw4","sw6","sw7"], softwareCategories:["Special Effects","3D Software"] },
    { id:"mv4",  section:"Children Songs", name:"Johny Johny Yes Papa", meta:"LooLoo Kids, 7.16B views, October 8, 2016, YouTube", producer:"pr13", software:[], softwareCategories:["Animation Software"] },
    { id:"mv5",  section:"Children Songs", name:"Phonics Song with Two Words", meta:"ChuChu TV, 6.89B views, March 6, 2014, YouTube", producer:"pr4",  software:[], softwareCategories:["Animation Software"] },
    { id:"mv6",  section:"Children Songs", name:"Baa Baa Black Sheep", meta:"Cocomelon, 4.74B views, June 25, 2018, YouTube", producer:"pr11", software:["sw4","sw6","sw7"], softwareUncertain:["sw4","sw6","sw7"], softwareCategories:["Special Effects","3D Software"] },
    { id:"mv7",  section:"Children Songs", name:"Lakdi Ki Kathi", meta:"Jingle Toons, 4.56B views, June 14, 2018, YouTube", producer:"pr10", software:[], softwareCategories:["Animation Software"] },

    { id:"mv8",  section:"Pop Music", name:"Despacito", meta:"Luis Fonsi, 8.95B views, January 12, 2017, YouTube", producer:"pr14", software:["sw15"], softwareCategories:["Editing Software"] },
    { id:"mv10", section:"Pop Music", name:"See You Again", meta:"Wiz Khalifa, 6.94B views, April 6, 2015, YouTube", producer:"pr18", software:[], softwareCategories:["Editing Software"] },
    { id:"mv11", section:"Pop Music", name:"Shape of You", meta:"Ed Sheeran, 6.67B views", producer:"pr24", software:[], softwareCategories:["Editing Software"] },
    { id:"mv12", section:"Pop Music", name:"Gangnam Style", meta:"Psy, 5.86B views, July 15, 2012, YouTube", producer:"pr21", software:[], softwareCategories:["Editing Software"] },
    { id:"mv13", section:"Pop Music", name:"Uptown Funk", meta:"Mark Ronson, 5.76B views, November 19, 2014, YouTube", producer:"pr22", software:[], softwareCategories:["Editing Software"] },
    { id:"mv14", section:"Pop Music", name:"Axel F", meta:"Crazy Frog, 5.57B views, June 16, 2009, YouTube", producer:"pr15", software:["sw9"], softwareCategories:["3D Software"] },
    { id:"mv9",  section:"Pop Music", name:"Dame Tu Cosita", meta:"Ultra Records, 5.36B views, YouTube", producer:"pr23", software:[], softwareCategories:["3D Software"] },
    { id:"mv15", section:"Pop Music", name:"Waka Waka (This Time for Africa)", meta:"Shakira, 4.46B views, June 4, 2010, YouTube", producer:"pr19", software:[], softwareCategories:["Editing Software"] },
    { id:"mv16", section:"Pop Music", name:"Counting Stars", meta:"OneRepublic, 4.37B views, May 31, 2013, YouTube", producer:"pr8",  software:["sw15"], softwareCategories:["Editing Software", "Special Effects"], softwareCategoryUncertain:["Special Effects"], softwareUncertain:["sw15"] },
    { id:"mv17", section:"Pop Music", name:"Sugar", meta:"Maroon 5, 4.35B views, January 14, 2015, YouTube", producer:"pr12", software:[], softwareCategories:["Editing Software"] },
    { id:"mv18", section:"Pop Music", name:"Roar", meta:"Katy Perry, 4.28B views, September 5, 2013, YouTube", producer:"pr7",  software:["sw5","sw3","sw1","sw2"], softwareCategories:["Special Effects"] },
    { id:"mv19", section:"Pop Music", name:"Dark Horse", meta:"Katy Perry, 4.13B views, February 20, 2014, YouTube", producer:"pr6",  software:["sw1","sw2","sw3","sw4","sw5","sw10","sw11","sw6","sw8"], softwareCategories:["Special Effects","3D Software","Plug-In"] },
    { id:"mv20", section:"Pop Music", name:"Perfect", meta:"Ed Sheeran, 4.12B views, November 9, 2017, YouTube", producer:"pr24", software:["sw14"], softwareCategories:["Editing Software"] },
    { id:"mv21", section:"Pop Music", name:"Sorry", meta:"Justin Bieber, 4.07B views, October 22, 2015, YouTube", producer:"pr17", software:[], softwareCategories:["Editing Software"] },
    { id:"mv22", section:"Pop Music", name:"Let Her Go", meta:"Passenger, 4.01B views, July 25, 2012, YouTube", producer:"pr20", software:[], softwareCategories:["Editing Software"] },
    { id:"mv23", section:"Pop Music", name:"Thinking Out Loud", meta:"Ed Sheeran, 3.98B views, October 7, 2014, YouTube", producer:"pr5",  software:[], softwareCategories:["Editing Software"] },

    { id:"mv24", section:"Religious", name:"Shree Hanuman Chalisa", meta:"T-Series Bhakti Sagar, 5.22B views, May 10, 2011, YouTube", producer:"pr2",  software:[], softwareCategories:["Editing Software"] },
    { id:"mv25", section:"Advertisement", name:"Temu's Big Game Ad", meta:"Temu, 4.38B views, February 12, 2024, YouTube", producer:"pr1",  software:[], softwareCategories:["Editing Software"] },

    { id:"mv26", section:"TikTok", name:"Becoming A Wizard Despite Hogwarts Rejection", meta:"Zach King, 2.4B views, December 9, 2019, TikTok", producer:"pr9",  software:["sw15","sw4"], softwareCategories:["Editing Software","Special Effects"] },
    { id:"mv27", section:"TikTok", name:"Welcome to the Sisters Christmas Party", meta:"James Charles, 1.7B views, December 8, 2019, TikTok", producer:"pr16", software:["sw16"], softwareCategories:["Cutting Software"] },
    { id:"mv28", section:"TikTok", name:"Magic Hide and Seek", meta:"Zach King, 1.1B views, December 3, 2019, TikTok", producer:"pr9",  software:["sw15","sw4"], softwareCategories:["Editing Software","Special Effects"] },
    { id:"mv29", section:"TikTok", name:"Inverted Lip Sync", meta:"Leah Halton, 988.2M views, February 6, 2024, TikTok", producer:"pr25", software:["sw16"], softwareCategories:["Cutting Software"] },
    { id:"mv30", section:"TikTok", name:"Glass Half Full", meta:"Zach King, 967.1M views, October 19, 2019, TikTok", producer:"pr9",  software:["sw15","sw4"], softwareCategories:["Editing Software","Special Effects"] },
    { id:"mv31", section:"TikTok", name:"M to the B", meta:"Bella Poarch, 847.3M views, August 18, 2020, TikTok", producer:"pr26", software:["sw16"], softwareCategories:["Cutting Software"] },
    { id:"mv32", section:"TikTok", name:"Wet Wall", meta:"Zach King, 660.5M views, October 9, 2019, TikTok", producer:"pr9",  software:["sw15","sw4"], softwareCategories:["Editing Software","Special Effects"] },
    { id:"mv33", section:"TikTok", name:"Beauty Tutorial", meta:"Nyadollie, 514.9M views, March 8, 2023, TikTok", producer:"pr27", software:["sw16"], softwareCategories:["Cutting Software"] },
    { id:"mv34", section:"TikTok", name:"Say It Right", meta:"Sorrel Horse, 456.9M views, January 28, 2022, TikTok", producer:"pr28", software:["sw16"], softwareCategories:["Cutting Software"] },
    { id:"mv35", section:"TikTok", name:"Baby Laughing", meta:"Daexo, 401.8M views, Deleted, TikTok", producer:"pr29", software:["sw16"], softwareCategories:["Cutting Software"] }
  ],

  software: [
    { id:"sw1",  section:"Special Effects",    name:"Foundry Nuke",             meta:"€5.799/y",               developer:"dev3" },
    { id:"sw2",  section:"Special Effects",    name:"Autodesk Flame",           meta:"€4.786/y",               developer:"dev9" },
    { id:"sw3",  section:"Special Effects",    name:"SideFX Houdini",           meta:"€2.907,45/y",            developer:"dev6" },
    { id:"sw4",  section:"Special Effects",    name:"Adobe After Effects",      meta:"€401,88/y",              developer:"dev8" },
    { id:"sw5",  section:"Special Effects",    name:"BorisFX SynthEyes",        meta:"€350,95/y",              developer:"dev4" },
    { id:"sw6",  section:"3D Software",        name:"Autodesk Maya",            meta:"€2.112/y",               developer:"dev9" },
    { id:"sw7",  section:"3D Software",        name:"Autodesk 3ds Max",         meta:"€2.112/y",               developer:"dev9" },
    { id:"sw8",  section:"3D Software",        name:"Maxon Cinema 4D",          meta:"€859,77/y",              developer:"dev7" },
    { id:"sw9",  section:"3D Software",        name:"LightWave 3D",             meta:"€±550/y",                developer:"dev5" },
    { id:"sw10", section:"3D Software",        name:"Maxon ZBrush",             meta:"€441,57/y",              developer:"dev7" },
    { id:"sw11", section:"Plug-In",            name:"Chaos V-Ray",              meta:"€658,80/y",              developer:"dev2" },
    { id:"sw12", section:"Animation Software", name:"Adobe Character Animator", meta:"€1033,60/y",             developer:"dev8" },
    { id:"sw13", section:"Animation Software", name:"Adobe Animate",            meta:"€401,88/y",              developer:"dev8" },
    { id:"sw14", section:"Editing Software",   name:"Adobe Premiere Pro",       meta:"€401,88/y",              developer:"dev8" },
    { id:"sw15", section:"Editing Software",   name:"Apple Final Cut Pro X",    meta:"€129,99/y",              developer:"dev10" },
    { id:"sw16", section:"Cutting Software",   name:"TikTok",                   meta:"Free",                   developer:"dev1" },
    { id:"sw17", section:"Cutting Software",   name:"CapCut",                   meta:"Free: limited, €89,99/y",developer:"dev1" }
  ],

  developers: [
    { id:"dev1",  name:"ByteDance",         meta:"2012, China, 33B revenue" },
    { id:"dev2",  name:"Chaos",             meta:"1997, Bulgaria, 3,5M revenue" },
    { id:"dev3",  name:"Foundry",           meta:"1996, UK, 87,88M revenue" },
    { id:"dev4",  name:"BorisFX",           meta:"1995, USA, 7,8M revenue" },
    { id:"dev5",  name:"LightWave Digital", meta:"1988, UK, No revenue data" },
    { id:"dev6",  name:"SideFX",            meta:"1987, Canada, 33,5M revenue" },
    { id:"dev7",  name:"Maxon",             meta:"1985, Germany, 62,5M revenue" },
    { id:"dev8",  name:"Adobe",             meta:"1982, USA, 5,4B revenue" },
    { id:"dev9",  name:"Autodesk",          meta:"1982, USA, 7,21B revenue" },
    { id:"dev10", name:"Apple",             meta:"1976, USA, 120B revenue" }
  ]
};

/* ─── Animation state ─────────────────────────────────────────── */
var animationTimeouts = [];
var animationRafs     = [];

function clearAllAnimations() {
  for (var i = 0; i < animationTimeouts.length; i++) clearTimeout(animationTimeouts[i]);
  for (var i = 0; i < animationRafs.length;     i++) cancelAnimationFrame(animationRafs[i]);
  animationTimeouts = [];
  animationRafs     = [];
}

/* Column indices for wave delay calculation */
var COL_IDX = { producer: 0, project: 1, software: 2, categoryBand: 2, developer: 3 };

/* Timing constants (ms) */
var WAVE_MS      = 260;
var LINE_DRAW_MS = 500;
var NODE_WAVE_MS = 220;

/* ─── Render helpers ─────────────────────────────────────────────── */
function renderList(containerId, items, type) {
  var root = document.getElementById(containerId);
  root.innerHTML = '';
  var currentSection = null;
  var groupEl = null;

  items.forEach(function(item) {
    if (item.section !== currentSection) {
      currentSection = item.section;
      groupEl = document.createElement('div');
      groupEl.className = 'section-group';
      var lbl = document.createElement('div');
      lbl.className = 'section-label';
      lbl.textContent = currentSection;
      groupEl.appendChild(lbl);
      root.appendChild(groupEl);
    }

    var div = document.createElement('div');
    div.className = 'node';
    div.id = 'node-' + item.id;
    div.dataset.id = item.id;
    div.dataset.type = type;
    div.dataset.category = item.section || '';
    div.innerHTML =
      '<div class="node-name">' + item.name + '</div>' +
      (item.meta ? '<div class="node-meta">' + item.meta + '</div>' : '');
    groupEl.appendChild(div);

    (function(id, t, el) {
      var active = false;
      var moved  = false;
      var startX = 0;
      var startY = 0;

      el.addEventListener('pointerdown', function(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        active = true;
        moved  = false;
        startX = e.clientX;
        startY = e.clientY;
      });

      el.addEventListener('pointermove', function(e) {
        if (!active) return;
        if (Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) {
          moved = true;
        }
      });

      el.addEventListener('pointerup', function(e) {
        if (active && !moved) selectNode(id, t);
        active = false;
      });

      // Browser fires pointercancel when it takes over the gesture for scrolling.
      // After pointercancel the browser also suppresses the subsequent click,
      // so no further guarding is needed.
      el.addEventListener('pointercancel', function() {
        active = false;
      });
    })(item.id, type, div);
  });
}

renderList('list-producer',  DATA.producers,  'producer');
renderList('list-project',   DATA.projects,   'project');
renderList('list-software',  DATA.software,   'software');
renderList('list-developer', DATA.developers, 'developer');

/* ─── Data helpers ───────────────────────────────────────────────── */
function byId(type, id) {
  var map = { producer: DATA.producers, project: DATA.projects, software: DATA.software, developer: DATA.developers };
  var list = map[type];
  if (!list) return null;
  for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
  return null;
}

function softwareInCategory(categoryName) {
  var result = [];
  DATA.software.forEach(function(sw) { if (sw.section === categoryName) result.push(sw.id); });
  return result;
}

function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

/* ─── Connection logic ───────────────────────────────────────────── */
function getConnected(id, type) {
  var producer = {}, project = {}, software = {}, developer = {}, categories = {}, uncertainSoftware = {};

  function addProjectChain(p) {
    project[p.id] = true;
    if (p.producer) producer[p.producer] = true;

    (p.software || []).forEach(function(swId) {
      software[swId] = true;
      var sw = byId('software', swId);
      if (sw && sw.developer) developer[sw.developer] = true;
      if ((p.softwareUncertain || []).indexOf(swId) !== -1) uncertainSoftware[swId] = true;
    });

    (p.softwareCategories || []).forEach(function(cat) {
      var explicitInCategory = false;
      (p.software || []).forEach(function(swId) {
        var sw = byId('software', swId);
        if (sw && sw.section === cat) explicitInCategory = true;
      });
      if (!explicitInCategory) {
        categories[cat] = true;
        var catUncertain = (p.softwareCategoryUncertain || []).indexOf(cat) !== -1;
        softwareInCategory(cat).forEach(function(swId) {
          software[swId] = true;
          var sw = byId('software', swId);
          if (sw && sw.developer) developer[sw.developer] = true;
          if (catUncertain) uncertainSoftware[swId] = true;
        });
      }
    });
  }

  if (type === 'producer') {
    producer[id] = true;
    DATA.projects.forEach(function(p) { if (p.producer === id) addProjectChain(p); });
  } else if (type === 'project') {
    var p = byId('project', id);
    if (p) addProjectChain(p);
  } else if (type === 'software') {
    var sw = byId('software', id);
    if (!sw) return { producer: producer, project: project, software: software, developer: developer, categories: categories };
    software[sw.id] = true;
    if (sw.developer) developer[sw.developer] = true;
    DATA.projects.forEach(function(proj) {
      if ((proj.software || []).indexOf(sw.id) !== -1) {
        project[proj.id] = true;
        if (proj.producer) producer[proj.producer] = true;
      }
    });
  } else if (type === 'developer') {
    developer[id] = true;
    DATA.software.filter(function(sw) { return sw.developer === id; }).forEach(function(sw) {
      software[sw.id] = true;
      DATA.projects.forEach(function(proj) {
        if ((proj.software || []).indexOf(sw.id) !== -1) {
          project[proj.id] = true;
          if (proj.producer) producer[proj.producer] = true;
        }
      });
    });
  }

  return { producer: producer, project: project, software: software, developer: developer, categories: categories, uncertainSoftware: uncertainSoftware };
}

function isSoftwareHighlightedByCategory(swId, conn) {
  var sw = byId('software', swId);
  return sw && has(conn.categories, sw.section);
}

/* ─── Selection state ────────────────────────────────────────────── */
var selected = null;
var selType  = null;

function clearSelection() {
  clearAllAnimations();
  selected = null;
  selType  = null;
  var nodes = document.querySelectorAll('.node');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].classList.remove('active', 'connected', 'dimmed', 'uncertain');
  }
  drawLines();
  document.getElementById('info-label').innerHTML = 'CLICK ANY NODE TO HIGHLIGHT CONNECTIONS';
  document.getElementById('hint').style.opacity = '1';
}

function selectNode(id, type) {
  if (selected === id && selType === type) { clearSelection(); return; }
  clearAllAnimations();

  selected = id;
  selType  = type;
  var conn   = getConnected(id, type);
  var srcCol = COL_IDX[type] !== undefined ? COL_IDX[type] : 0;

  var nodes = document.querySelectorAll('.node');
  for (var i = 0; i < nodes.length; i++) {
    var n    = nodes[i];
    var nid  = n.dataset.id;
    var ntyp = n.dataset.type;
    n.classList.remove('active', 'connected', 'dimmed', 'uncertain');

    if (nid === id && ntyp === type) {
      void n.offsetWidth;
      n.classList.add('active');
    } else if (
      (conn[ntyp] && has(conn[ntyp], nid)) ||
      (ntyp === 'software' && isSoftwareHighlightedByCategory(nid, conn))
    ) {
      var nodeCol = COL_IDX[ntyp] !== undefined ? COL_IDX[ntyp] : 0;
      var wave    = Math.abs(nodeCol - srcCol);
      var delay   = wave * NODE_WAVE_MS;
      (function(node) {
        var t = setTimeout(function() { node.classList.add('connected'); }, delay);
        animationTimeouts.push(t);
      })(n);
    } else {
      n.classList.add('dimmed');
    }
  }

  drawLines(id, type, conn);
  updateLabel(id, type, conn);
  document.getElementById('hint').style.opacity = '0';
}

/* ─── Label ──────────────────────────────────────────────────────── */
function objSize(obj) { return Object.keys(obj).length; }

function updateLabel(id, type, conn) {
  var item  = byId(type, id);
  var parts = [];
  function s(n, word) { return n + ' ' + word + (n !== 1 ? 's' : ''); }
  var pCount = objSize(conn.producer)  - (type === 'producer'  ? 1 : 0);
  var jCount = objSize(conn.project)   - (type === 'project'   ? 1 : 0);
  var cCount = objSize(conn.categories);
  var wCount = objSize(conn.software)  - (type === 'software'  ? 1 : 0);
  var dCount = objSize(conn.developer) - (type === 'developer' ? 1 : 0);
  if (pCount > 0) parts.push(s(pCount, 'producer'));
  if (jCount > 0) parts.push(s(jCount, 'project'));
  if (cCount > 0) parts.push(s(cCount, 'category'));
  if (wCount > 0) parts.push(s(wCount, 'software'));
  if (dCount > 0) parts.push(s(dCount, 'developer'));
  document.getElementById('info-label').innerHTML =
    '<span>' + item.name.toUpperCase() + '</span>' +
    (parts.length ? ' — ' + parts.join(', ') : '');
}

/* ─── Geometry helpers ───────────────────────────────────────────── */
function nodeCenter(id) {
  var el   = document.getElementById('node-' + id);
  var wrap = document.getElementById('diagram-wrap');
  if (!el || !wrap) return null;
  var wr = wrap.getBoundingClientRect();
  var er = el.getBoundingClientRect();
  return { leftX: er.left - wr.left, rightX: er.right - wr.left, y: er.top - wr.top + er.height / 2 };
}

function categoryBandPoint(categoryName) {
  var wrap        = document.getElementById('diagram-wrap');
  var softwareCol = document.getElementById('list-software');
  if (!wrap || !softwareCol) return null;
  var wr     = wrap.getBoundingClientRect();
  var groups = softwareCol.querySelectorAll('.section-group');
  var targetGroup = null;
  for (var i = 0; i < groups.length; i++) {
    var label = groups[i].querySelector('.section-label');
    if (label && label.textContent === categoryName) { targetGroup = groups[i]; break; }
  }
  if (!targetGroup) return null;
  var rect = targetGroup.getBoundingClientRect();
  return { leftX: rect.left - wr.left, rightX: rect.left - wr.left, y: rect.top - wr.top + rect.height / 2 };
}

function getAllConnections() {
  var links = [];
  DATA.projects.forEach(function(p) {
    if (p.producer) links.push({ from: p.producer, fromType: 'producer', to: p.id, toType: 'project', uncertain: !!p.producerUncertain });
    (p.software || []).forEach(function(swId) {
      links.push({ from: p.id, fromType: 'project', to: swId, toType: 'software', uncertain: (p.softwareUncertain || []).indexOf(swId) !== -1 });
    });
    (p.softwareCategories || []).forEach(function(cat) {
      var explicitInCategory = false;
      (p.software || []).forEach(function(swId) {
        var sw = byId('software', swId);
        if (sw && sw.section === cat) explicitInCategory = true;
      });
      if (!explicitInCategory) {
        links.push({ from: p.id, fromType: 'project', to: cat, toType: 'categoryBand', uncertain: (p.softwareCategoryUncertain || []).indexOf(cat) !== -1 });
      }
    });
  });
  DATA.software.forEach(function(sw) {
    if (sw.developer) links.push({ from: sw.id, fromType: 'software', to: sw.developer, toType: 'developer', uncertain: !!sw.developerUncertain });
  });
  var seen = {}, unique = [];
  links.forEach(function(link) {
    var key = link.from + '|' + link.to + '|' + link.toType + '|' + link.uncertain;
    if (!has(seen, key)) { seen[key] = true; unique.push(link); }
  });
  return unique;
}

function pointForLinkEnd(id, type) {
  return type === 'categoryBand' ? categoryBandPoint(id) : nodeCenter(id);
}

function isLinkVisible(link, conn) {
  if (!conn) return false;
  if (link.fromType === 'producer'  && link.toType === 'project')      return has(conn.producer, link.from) && has(conn.project, link.to);
  if (link.fromType === 'project'   && link.toType === 'software')     return has(conn.project, link.from) && (has(conn.software, link.to) || isSoftwareHighlightedByCategory(link.to, conn));
  if (link.fromType === 'project'   && link.toType === 'categoryBand') return has(conn.project, link.from) && has(conn.categories, link.to);
  if (link.fromType === 'software'  && link.toType === 'developer')    return (has(conn.software, link.from) || isSoftwareHighlightedByCategory(link.from, conn)) && has(conn.developer, link.to);
  return false;
}

/* ─── Animated line drawing ──────────────────────────────────────── */
function drawLines(id, type, conn) {
  var svg  = document.getElementById('svg-overlay');
  var wrap = document.getElementById('diagram-wrap');
  var wr   = wrap.getBoundingClientRect();
  svg.setAttribute('width',  wr.width);
  svg.setAttribute('height', wr.height);
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  if (!selected) return;

  var srcCol   = (type !== undefined && COL_IDX[type] !== undefined) ? COL_IDX[type] : 0;
  var allLinks = getAllConnections();
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < allLinks.length; i++) {
    var link = allLinks[i];
    var src  = pointForLinkEnd(link.from, link.fromType);
    var tgt  = pointForLinkEnd(link.to,   link.toType);
    if (!src || !tgt) continue;

    var sx = src.rightX + 2;
    var tx = tgt.leftX  - 2;
    var dx = tx - sx;
    var dy = tgt.y - src.y;

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M' + sx + ',' + src.y + ' L' + tx + ',' + tgt.y);
    path.setAttribute('class', 'conn-line');

    if (!isLinkVisible(link, conn)) {
      fragment.appendChild(path);
      continue;
    }

    var fromCol    = COL_IDX[link.fromType] !== undefined ? COL_IDX[link.fromType] : 0;
    var wave       = fromCol >= srcCol ? fromCol - srcCol : srcCol - (COL_IDX[link.toType] !== undefined ? COL_IDX[link.toType] : 0);
    var delay      = wave * WAVE_MS;
    var goingRight = (fromCol >= srcCol);
    var pathLen    = Math.max(1, Math.sqrt(dx * dx + dy * dy));

    if (link.uncertain) {
      var clipId   = 'clip-' + i;
      var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', clipId);
      var clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      var totalW   = Math.abs(tx - sx) + 4;
      clipRect.setAttribute('x',      String(Math.min(sx, tx) - 2));
      clipRect.setAttribute('y',      String(Math.min(src.y, tgt.y) - 4));
      clipRect.setAttribute('height', String(Math.abs(tgt.y - src.y) + 8));
      clipPath.appendChild(clipRect);
      fragment.appendChild(clipPath);

      path.style.strokeDasharray = '4 3';
      path.style.opacity         = '1';
      path.setAttribute('clip-path', 'url(#' + clipId + ')');

      if (goingRight) {
        clipRect.setAttribute('width', '0');
        (function(rect, d, dur, w) {
          var t = setTimeout(function() {
            rect.style.transition = 'width ' + (dur / 1000) + 's ease-out';
            rect.style.width      = w + 'px';
          }, d);
          animationTimeouts.push(t);
        })(clipRect, delay, LINE_DRAW_MS, totalW);
      } else {
        clipRect.setAttribute('width', String(totalW));
        clipRect.style.transform = 'translateX(' + totalW + 'px)';
        (function(rect, d, dur) {
          var t = setTimeout(function() {
            rect.style.transition = 'transform ' + (dur / 1000) + 's ease-out';
            rect.style.transform  = 'translateX(0px)';
          }, d);
          animationTimeouts.push(t);
        })(clipRect, delay, LINE_DRAW_MS);
      }

    } else {
      path.style.strokeDasharray  = pathLen + ' ' + pathLen;
      path.style.strokeDashoffset = String(goingRight ? pathLen : -pathLen);
      path.style.opacity          = '1';

      (function(p, d, dur) {
        var t = setTimeout(function() {
          var durS = (dur / 1000) + 's';
          p.style.webkitTransition = 'stroke-dashoffset ' + durS + ' ease-out';
          p.style.transition       = 'stroke-dashoffset ' + durS + ' ease-out';
          p.style.strokeDashoffset = '0';
        }, d);
        animationTimeouts.push(t);
      })(path, delay, LINE_DRAW_MS);
    }

    fragment.appendChild(path);
  }

  svg.appendChild(fragment);
}

window.addEventListener('resize', function() {
  if (selected) selectNode(selected, selType);
  else drawLines();
});

clearSelection();
