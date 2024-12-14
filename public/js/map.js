const latitude = parseFloat(document.getElementById('map').getAttribute('data-lat'));
const longitude = parseFloat(document.getElementById('map').getAttribute('data-lng'));

// Initialize the map
const map = L.map('map', { zoomControl: false }).setView([latitude, longitude], 11); // Coordinates: Latitude, Longitude
  
// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// Add a marker at the same coordinates
L.marker([latitude, longitude]).addTo(map)
  .bindPopup('Exact location provided after booking.');