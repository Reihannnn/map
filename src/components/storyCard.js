// components/storyCard.js
export default function StoryCard(story) {
  const el = document.createElement('article');
  el.className = 'story-card';
  el.tabIndex = 0;
  const imgUrl = story.photoUrl || '';
  el.innerHTML = `
    <img src="${imgUrl}" alt="${story.description ? story.description.substring(0,60) : 'Story image'}" loading="lazy" />
    <div class="story-meta">
      <h3>${escapeHtml(story.name || 'Anonymous')}</h3>
      <p>${escapeHtml(story.description || '')}</p>
      <small style="color: #9ca3af">${story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}</small>
    </div>
  `;
  return el;
}

function escapeHtml(s='') {
  return (s+'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
