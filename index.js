// index.js — Leaflet + Marzipano (robusto con carga diferida)

window.addEventListener('load', () => {
  // 1) Coordenadas por escena (puedes cambiarlas por las reales)
  const sceneLocations = {
    "Embalse": { lat: 42.560000, lng: -3.450000 },
    "Presa":   { lat: 42.562500, lng: -3.456000 },
    "Presa aguas abajo": { lat: 42.560000, lng: -3.457000 },
    "Presa paramento":   { lat: 42.560000, lng: -3.458000 }
  };

  // 2) Helpers
  const getSceneName = (scene) =>
    (scene && scene.data && (scene.data.name || scene.data.id)) || "Embalse";

  const getInitialSceneName = () => {
    try {
      // Si Marzipano ya creó "scenes" (plantilla de Marzipano Tool)
      if (Array.isArray(window.scenes) && window.scenes.length) {
        return getSceneName(window.scenes[0]);
      }
      // Si no, usa el nombre del primer elemento en APP_DATA
      if (window.APP_DATA?.scenes?.length) {
        return window.APP_DATA.scenes[0].name || "Embalse";
      }
    } catch (_) {}
    return "Embalse";
  };

  // 3) Elementos del DOM
  const mapEl = document.getElementById('map');
  const toggleBtn = document.getElementById('toggleMap');

  // 4) Inicializa Leaflet
  const initialSceneName = getInitialSceneName();
  const initialPos = sceneLocations[initialSceneName] || sceneLocations["Embalse"];

  // Evita que el scroll del mapa interfiera con el visor 360
  mapEl.addEventListener('wheel', (e) => e.stopPropagation());

  const map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false
  }).setView([initialPos.lat, initialPos.lng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const marker = L.marker([initialPos.lat, initialPos.lng]).addTo(map);

  const updateMapByName = (sceneName) => {
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

  // 5) Engancha el cambio de escena cuando switchScene exista
  const hookSwitchScene = () => {
    if (typeof window.switchScene === 'function' && !window.__mapHooked) {
      const original = window.switchScene;
      window.switchScene = function (scene) {
        original(scene);
        const name = getSceneName(scene);
        updateMapByName(name);
      };
      window.__mapHooked = true;
      return true;
    }
    return false;
  };

  // Reintenta varias veces por si el script de Marzipano tarda en crear switchScene
  let retries = 0;
  const timer = setInterval(() => {
    if (hookSwitchScene() || retries++ > 40) clearInterval(timer);
  }, 100);

  // 6) Fallback: si tenemos acceso al viewer, escúchalo
  try {
    const v = window.viewer || (window.viewer && window.viewer.stage && window.viewer);
    if (v && v.stage) {
      v.stage().addEventListener('renderComplete', () => {
        try {
          const s = v.scene && v.scene();
          if (s) updateMapByName(getSceneName(s));
        } catch (_) {}
      });
    }
  } catch (_) {}

  // Ajuste final de tamaño del mapa al cargar
  setTimeout(() => map.invalidateSize(), 300);
});
