// index.js — Marzipano + Leaflet integrados

// ========== 1) MARZIPANO: crear visor y escenas desde APP_DATA ==========
(function() {
  // Elemento del visor
  var panoElement = document.getElementById('pano');
  var viewer = new Marzipano.Viewer(panoElement, {
    stageType: 'webgl'
  });

  // Guardamos viewer global por si otros scripts lo usan
  window.viewer = viewer;

  // Construir escenas a partir de APP_DATA (generado por Marzipano Tool)
  var scenes = [];
  var scenesById = {};

  function createSceneFromData(data) {
    // Source multiresolución (plantilla Marzipano Tool)
    var urlPrefix = "tiles/" + data.id;
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/preview.jpg" }
    );

    // Geometría cúbica con niveles
    var geometry = new Marzipano.CubeGeometry(data.levels);

    // Límite de vista tradicional
    var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, (100 * Math.PI) / 180);

    // Vista con parámetros iniciales desde data.js
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

    // Crear escena
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Hotspots de enlace entre escenas
    data.linkHotspots.forEach(function(hs) {
      var el = createLinkHotspotElement(hs);
      scene.hotspotContainer().createHotspot(el, { yaw: hs.yaw, pitch: hs.pitch });
    });

    // (Opcional) infoHotspots si hubiera
    data.infoHotspots && data.infoHotspots.forEach(function(hs) {
      var el = createInfoHotspotElement(hs);
      scene.hotspotContainer().createHotspot(el, { yaw: hs.yaw, pitch: hs.pitch });
    });

    return { id: data.id, name: data.name, data: data, scene: scene, view: view };
  }

  function createLinkHotspotElement(hs) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('link-hotspot');

    var icon = document.createElement('div');
    icon.classList.add('link-hotspot-icon');
    wrapper.appendChild(icon);

    // Accesible
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('aria-label', 'Ir a ' + (findSceneById(hs.target)?.name || hs.target));

    function go() {
      var target = findSceneById(hs.target);
      if (target) switchScene(target);
    }
    wrapper.addEventListener('click', go);
    wrapper.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); go(); } });

    return wrapper;
  }

  function createInfoHotspotElement(hs) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('info-hotspot');
    wrapper.textContent = hs.title || 'Info';
    return wrapper;
  }

  function findSceneById(id) {
    return scenesById[id] || null;
  }

  // Construye todas las escenas declaradas en APP_DATA
  (APP_DATA.scenes || []).forEach(function(s) {
    var sc = createSceneFromData(s);
    scenes.push(sc);
    scenesById[s.id] = sc;
  });

  // Exponer escenas global si otros scripts lo esperan
  window.scenes = scenes;

  // Ajustes desde APP_DATA.settings
  try {
    if (APP_DATA.settings?.mouseViewMode) {
      viewer.controls().enableMethod('mouseView', APP_DATA.settings.mouseViewMode === 'drag');
    }
  } catch (_) {}

  // Escena actual
  var current = null;

  // switchScene: muestra escena y sincroniza mapa (si está disponible)
  window.switchScene = function(sc) {
    if (!sc) return;
    sc.scene.switchTo();
    current = sc;
    // Sincroniza mapa si la función está definida (la añadimos más abajo)
    if (typeof window.__updateMapByName === 'function') {
      window.__updateMapByName(sc.name || sc.data?.name || sc.id);
    }
  };

  // Mostrar la primera escena
  if (scenes.length > 0) {
    switchScene(scenes[0]);
  }

  // Guardar referencia útil
  window.getCurrentScene = function() { return current; };
})();

// ========== 2) LEAFLET: Mapa de posiciones y sincronización ==========
(function() {
  // Coordenadas (ejemplo). Cambia por reales cuando quieras.
  const sceneLocations = {
    "Embalse": { lat: 42.560000, lng: -3.450000 },
    "Presa":   { lat: 42.562500, lng: -3.456000 },
    "Presa aguas abajo": { lat: 42.560000, lng: -3.457000 },
    "Presa paramento":   { lat: 42.560000, lng: -3.458000 }
  };

  // Elementos del DOM
  const mapEl = document.getElementById('map');
  const toggleBtn = document.getElementById('toggleMap');
  if (!mapEl || !toggleBtn) return; // por si no existen

  // Evita que el scroll del mapa interfiera con el visor 360
  mapEl.addEventListener('wheel', (e) => e.stopPropagation());

  // Escena inicial por nombre (primera de APP_DATA)
  const initialSceneName = (window.APP_DATA?.scenes?.[0]?.name) || "Embalse";
  const initialPos = sceneLocations[initialSceneName] || sceneLocations["Embalse"];

  // Inicializar Leaflet
  const map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false
  }).setView([initialPos.lat, initialPos.lng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const marker = L.marker([initialPos.lat, initialPos.lng]).addTo(map);

  // Exponer función para que switchScene la use
  window.__updateMapByName = function(sceneName) {
    const loc = sceneLocations[sceneName];
    if (!loc) return;
    marker.setLatLng([loc.lat, loc.lng]);
    map.setView([loc.lat, loc.lng], 16);
  };

  // Botón mostrar/ocultar
  let mapVisible = true;
  toggleBtn.addEventListener('click', () => {
    mapVisible = !mapVisible;
    mapEl.style.display = mapVisible ? 'block' : 'none';
    if (mapVisible) setTimeout(() => map.invalidateSize(), 150);
  });

  // Asegura que el tamaño se calcula bien tras cargar
  setTimeout(() => map.invalidateSize(), 300);
})();
