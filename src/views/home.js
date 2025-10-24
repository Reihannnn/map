// views/home.js
import { apiGetStories } from '../utils/api';
import StoryCard from '../components/storyCard';

export default function Home() {
  const el = document.createElement('section');
  el.className = 'container';
  el.innerHTML = `
    <h1>Home</h1>
    <p>Daftar Story dengan peta singkat. Klik marker pada panel kanan untuk melihat lokasi.</p>
    <div class="grid">
      <div id="list" aria-live="polite"></div>
      <div id="map-panel">
        <div id="map" aria-label="Peta Story"></div>
      </div>
    </div>
  `;

  // init map in next tick to allow DOM mounted
  setTimeout(async ()=> {
    const listEl = el.querySelector('#list');
    listEl.innerHTML = `<div class="center">Memuat data...</div>`;
    try {
      const data = await apiGetStories({ page:1, size:20, location:1 });
      const stories = data.listStory || data.list || [];
      listEl.innerHTML = '';
      const L = (await import('leaflet')).default;
      // create map
      const mapDiv = el.querySelector('#map');
      mapDiv.style.height = '420px';
      const map = L.map(mapDiv).setView([0,0], 2);
      // Add tile layers (multiple)
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap' });
      L.control.layers({OSM: osm, Topo: topo}).addTo(map);

      const markers = [];
      stories.forEach(s => {
        const card = StoryCard(s);
        listEl.appendChild(card);
        if (s.lat && s.lon) {
          const marker = L.marker([s.lat, s.lon]).addTo(map);
          marker.bindPopup(`<strong>${escapeHtml(s.name)}</strong><br>${escapeHtml(s.description || '')}`);
          marker.on('click', ()=> {
            // highlight card (simple)
            document.querySelectorAll('.story-card').forEach(c => c.style.background='');
            card.style.background = '#f0fdfa';
            card.scrollIntoView({behavior:'smooth', block:'center'});
          });
          markers.push(marker);
        }
      });
      if (markers.length) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
      }
    } catch (err) {
      const listEl = el.querySelector('#list');
      listEl.innerHTML = `<div class="error">Gagal memuat data: ${err.message}</div>`;
      console.error(err);
    }
  }, 60);

  return el;
}

function escapeHtml(s='') {
  return (s+'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
