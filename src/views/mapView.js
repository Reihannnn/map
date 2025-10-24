// views/mapView.js
import { apiGetStories } from '../utils/api';

export default function MapView() {
  const el = document.createElement('section');
  el.className = 'container';
  el.innerHTML = `
    <h1>Peta Cerita (Map)</h1>
    <p>Interaktif: klik marker untuk membuka popup. Gunakan kontrol layer untuk ganti tampilan peta.</p>
    <div id="map" style="height:520px;"></div>
  `;

  setTimeout(async ()=> {
    try {
      const data = await apiGetStories({ page:1, size:100, location:1 });
      const stories = data.listStory || data.list || [];
      const L = (await import('leaflet')).default;
      const mapDiv = el.querySelector('#map');
      const map = L.map(mapDiv).setView([0,0], 2);
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      const satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap' });
      L.control.layers({OSM: osm, Topo: satellite}).addTo(map);

      const markers = [];
      stories.forEach(s => {
        if (s.lat && s.lon) {
          const marker = L.marker([s.lat, s.lon]).addTo(map);
          marker.bindPopup(`<img src="${s.photoUrl}" alt="${s.description?escapeHtml(s.description.substring(0,60)):'image'}" style="width:120px;height:auto;display:block;margin-bottom:6px;"><strong>${escapeHtml(s.name)}</strong><br>${escapeHtml(s.description||'')}`);
          markers.push(marker);
        }
      });
      if (markers.length) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
      }
    } catch (err) {
      el.querySelector('#map').innerHTML = `<div class="error">Gagal memuat peta: ${err.message}</div>`;
      console.error(err);
    }
  }, 40);

  return el;
}

function escapeHtml(s='') {
  return (s+'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
