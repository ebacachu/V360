// index.js con Leaflet + Marzipano sincronizado

// Coordenadas de ejemplo (cámbialas por las reales cuando las tengas)
const sceneLocations = {
  "Embalse": { lat: 42.560000, lng: -3.450000 },
  "Presa":   { lat: 42.562500, lng: -3.455000 }
};

function getSceneName(scene) {
  return (scene?.data?.name) || (scene?.data?.id) || "Embalse";
}

let initialSceneName = "Embalse";
try {
  if (typeof scenes !== 'undefined' && scenes.length) {
    initialSceneName = getSceneName(scenes[0]);
  }
} catch(_) { }

const mapEl = document.getElementById('map');
const toggleBtn = document.getElementById('toggleMap');
const initialPos = sceneLocations[initialSceneName] || sceneLocations["Embalse"];

// Evita que el scroll del mapa interfiera con el visor
mapEl.addEventListener('wheel', e => e.stopPropagation());

const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
  scrollWheelZoom: false
}).setView([initialPos.lat, initialPos.lng], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const marker = L.marker([initialPos.lat, initialPos.lng]).addTo(map);

let mapVisible = true;
toggleBtn.addEventListener('click', () => {
  mapVisible = !mapVisible;
  mapEl.style.display = mapVisible ? 'block' : 'none';
});

function updateMapByName(sceneName) {
  const loc = sceneLocations[sceneName];
  if (!loc) return;
  marker.setLatLng([loc.lat, loc.lng]);
  map.setView([loc.lat, loc.lng], 16);
}

if (typeof switchScene === 'function') {
  const originalSwitchScene = switchScene;
  window.switchScene = function(scene) {
    originalSwitchScene(scene);
    const sceneName = getSceneName(scene);
    updateMapByName(sceneName);
  };
} else {
  try {
    viewer.stage().addEventListener('renderComplete', () => {
      const s = viewer.scene && viewer.scene();
      if (!s) return;
      updateMapByName(getSceneName(s));
    });
  } catch(_) { }
}

setTimeout(() => map.invalidateSize(), 300);
