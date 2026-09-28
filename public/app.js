const items = [
  { id: 1, name: 'Black leather wallet', status: 'Lost', category: 'Accessories', location: 'Central Canteen', date: '2026-09-27', description: 'Black leather wallet with a college ID and two cards inside.', contact: 'mira.shah@campus.edu', image: 'assets/items/wallet.svg' },
  { id: 2, name: 'Blue water bottle', status: 'Found', category: 'Other', location: 'Block A, Room 204', date: '2026-09-28', description: 'Steel bottle with a navy blue lid. Found after the afternoon lecture.', contact: '+91 98765 43210', image: 'assets/items/bottle.svg' },
  { id: 3, name: 'Wireless earphones case', status: 'Found', category: 'Electronics', location: 'Main Library', date: '2026-09-27', description: 'Small white charging case for wireless earphones, near the study desks.', contact: 'lostfound@campus.edu', image: 'assets/items/earphones.svg' },
  { id: 4, name: 'Student ID card', status: 'Lost', category: 'Documents', location: 'Sports Complex', date: '2026-09-26', description: 'ID card in a clear holder with a red lanyard.', contact: 'arjun.k@campus.edu', image: 'assets/items/id-card.svg' },
  { id: 5, name: 'Grey backpack', status: 'Found', category: 'Bags', location: 'North Gate', date: '2026-09-25', description: 'Medium grey backpack with a small yellow keychain.', contact: '+91 99887 77665', image: 'assets/items/backpack.svg' },
  { id: 6, name: 'Organic Chemistry notes', status: 'Lost', category: 'Books', location: 'Science Block', date: '2026-09-24', description: 'Spiral-bound notes with handwritten diagrams and a green cover.', contact: 'rhea.p@campus.edu', image: 'assets/items/notes.svg' }
];
let activeStatus = 'All';
const grid = document.querySelector('#item-grid');
const search = document.querySelector('#search-input');
const category = document.querySelector('#category-filter');
const reportDialog = document.querySelector('#report-dialog');
const detailDialog = document.querySelector('#detail-dialog');
const deleteDialog = document.querySelector('#delete-dialog');
const photoInput = document.querySelector('#item-photo');
const photoEmpty = document.querySelector('#photo-empty');
const photoPreview = document.querySelector('#photo-preview');
const photoPreviewImage = document.querySelector('#photo-preview-image');
const photoError = document.querySelector('#photo-error');
let selectedPhoto = '';
let listingToDelete = null;
const buttonArt = '<span class="button-art"><span class="pencil"></span><span class="folder"><span class="top"><svg viewBox="0 0 24 27" aria-hidden="true"><path d="M1,0 L23,0 C23.552,0 24,.448 24,1 L24,8.172 C24,8.702 23.789,9.211 23.414,9.586 L20.586,12.414 C20.211,12.789 20,13.298 20,13.828 L20,26 C20,26.552 19.552,27 19,27 L1,27 C.448,27 0,26.552 0,26 L0,1 C0,.448 .448,0 1,0 Z"></path></svg></span><span class="paper"></span></span></span>';
function addButtonArt(root = document) { root.querySelectorAll('.continue-application').forEach(button => { if (!button.querySelector('.button-art')) button.insertAdjacentHTML('afterbegin', buttonArt); }); }

function prettyDate(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function contactLink(contact) { return contact.includes('@') ? `mailto:${contact}` : `tel:${contact.replace(/[^+\d]/g, '')}`; }
function updateStats() {
  document.querySelector('#hero-total').textContent = items.length;
  document.querySelector('#hero-found').textContent = items.filter(i => i.status === 'Found').length;
  document.querySelector('#hero-lost').textContent = items.filter(i => i.status === 'Lost').length;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const selectedCategory = category.value;
  const filtered = items.filter(item => (activeStatus === 'All' || item.status === activeStatus) && (selectedCategory === 'All' || item.category === selectedCategory) && `${item.name} ${item.category} ${item.location} ${item.description}`.toLowerCase().includes(query));
  grid.innerHTML = filtered.map(item => `<article class="item-card"><div class="card-top"><img class="item-image" src="${item.image || itemImageFor(item.category)}" alt="${item.name}" /><span class="status ${item.status.toLowerCase()}">${item.status}</span></div><h3>${item.name}</h3><p class="category">${item.category}</p><div class="meta"><span>⌖ ${item.location}</span><span>◷ ${prettyDate(item.date)}</span></div><p class="description">${item.description}</p><div class="card-actions"><button class="continue-application card-action" data-details="${item.id}" type="button">${buttonArt}${item.status === 'Lost' ? 'I found this' : 'Contact finder'}</button><button class="delete-listing" data-delete="${item.id}" type="button" aria-label="Delete ${item.name}">Delete</button></div></article>`).join('');
  document.querySelector('#result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'listing' : 'listings'} shown`;
  document.querySelector('#empty-state').hidden = filtered.length !== 0;
  updateStats();
}
function itemImageFor(category) { return ({ Accessories: 'assets/items/wallet.svg', Other: 'assets/items/bottle.svg', Electronics: 'assets/items/earphones.svg', Documents: 'assets/items/id-card.svg', Bags: 'assets/items/backpack.svg', Books: 'assets/items/notes.svg' })[category] || 'assets/items/bottle.svg'; }
function clearPhoto() {
  selectedPhoto = '';
  photoInput.value = '';
  photoPreviewImage.removeAttribute('src');
  photoPreview.hidden = true;
  photoEmpty.hidden = false;
  photoError.hidden = true;
  photoError.textContent = '';
}
function showPhotoError(message) {
  clearPhoto();
  photoError.textContent = message;
  photoError.hidden = false;
}
photoInput.addEventListener('change', () => {
  const [file] = photoInput.files;
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return showPhotoError('Please choose a PNG, JPG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) return showPhotoError('Please choose an image smaller than 5 MB.');
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    selectedPhoto = reader.result;
    photoPreviewImage.src = selectedPhoto;
    photoEmpty.hidden = true;
    photoPreview.hidden = false;
    photoError.hidden = true;
  });
  reader.readAsDataURL(file);
});
document.querySelector('#remove-photo').addEventListener('click', clearPhoto);
function showDetails(id) {
  const item = items.find(entry => entry.id === Number(id));
  document.querySelector('#detail-content').innerHTML = `<div class="detail-inner"><div class="detail-head"><button class="icon-button close" data-close aria-label="Close details">×</button><p class="eyebrow">Listing details</p><span class="status ${item.status.toLowerCase()}">${item.status}</span><h2>${item.name}</h2><p class="category">${item.category}</p></div><div class="detail-content"><img class="detail-item-image" src="${item.image || itemImageFor(item.category)}" alt="${item.name}" /><p class="detail-description">${item.description}</p><div class="detail-meta"><div>Location<b>${item.location}</b></div><div>Date reported<b>${prettyDate(item.date)}</b></div><div>Contact<b>${item.contact}</b></div><div>Listing type<b>${item.status} item</b></div></div><a class="continue-application contact-button" href="${contactLink(item.contact)}">${buttonArt}${item.status === 'Lost' ? 'I found this item' : 'Contact finder'}</a></div></div>`;
  detailDialog.showModal();
}
function requestDelete(id) {
  const item = items.find(entry => entry.id === Number(id));
  if (!item) return;
  listingToDelete = item.id;
  document.querySelector('#delete-message').textContent = `“${item.name}” will be permanently removed from the board.`;
  deleteDialog.showModal();
}
function deleteListing() {
  const index = items.findIndex(item => item.id === listingToDelete);
  if (index === -1) return;
  const [removedItem] = items.splice(index, 1);
  listingToDelete = null;
  deleteDialog.close();
  render();
  const toast = document.querySelector('#toast');
  toast.textContent = `“${removedItem.name}” was removed from the board.`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
document.querySelectorAll('[data-open-report]').forEach(button => button.addEventListener('click', () => reportDialog.showModal()));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeStatus = button.dataset.status; document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn === button)); render(); }));
search.addEventListener('input', render); category.addEventListener('change', render);
grid.addEventListener('click', event => { const detailsButton = event.target.closest('[data-details]'); const deleteButton = event.target.closest('[data-delete]'); if (detailsButton) showDetails(detailsButton.dataset.details); if (deleteButton) requestDelete(deleteButton.dataset.delete); });
document.addEventListener('click', event => { if (event.target.closest('[data-close]')) { reportDialog.close(); detailDialog.close(); } });
document.querySelector('#cancel-delete').addEventListener('click', () => { listingToDelete = null; deleteDialog.close(); });
document.querySelector('#confirm-delete').addEventListener('click', deleteListing);
document.querySelector('#report-form').addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.currentTarget); const listing = Object.fromEntries(data); items.unshift({ id: Date.now(), ...listing, image: selectedPhoto || itemImageFor(listing.category) }); event.currentTarget.reset(); clearPhoto(); document.querySelector('#lost').checked = true; reportDialog.close(); activeStatus = 'All'; document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.status === 'All')); render(); const toast = document.querySelector('#toast'); toast.textContent = 'Listing added to the board.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); document.querySelector('#listings').scrollIntoView({ behavior: 'smooth' }); });
addButtonArt();
render();
