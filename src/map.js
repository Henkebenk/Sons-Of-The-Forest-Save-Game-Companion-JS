var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 4,
  attributionControl: false, // hide the Leaflet link
});
var bounds = [[0,0], [4000,4000]];
var image = L.imageOverlay('./images/shared/map/map.png', bounds).addTo(map);
map.fitBounds(bounds);


var yx = L.latLng;

var xy = function(x, y) {
    if (Array.isArray(x)) {    // When doing xy([x, y]);
        return yx(x[1]+2000, x[0]+2000);
    }
    return yx(y+2000, x+2000);  // When doing xy(x, y);
};

var mapMarker = L.icon({
  iconUrl: './images/shared/icons/map/custom.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-custom'
})

var markerHangGlider = L.icon({
  iconUrl: './images/shared/icons/map/hangglider.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-glider'
})

var markerKnightV = L.icon({
  iconUrl: './images/shared/icons/map/knightv.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-knightv'
})

var markerPlayer = L.icon({
  iconUrl: './images/shared/icons/map/player.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-player'
})

var markerKelvin = L.icon({
  iconUrl: './images/shared/icons/map/kelvin.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-kelvin'
})

var markerVirginia = L.icon({
  iconUrl: './images/shared/icons/map/virginia.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-virginia'
})

// [Static icons]
var markerCaveEntrance = L.icon({
  iconUrl: './images/shared/icons/map/caveentrance.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-cave-entrance'
})

var markerCaveExit = L.icon({
  iconUrl: './images/shared/icons/map/caveexit2.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-cave-exit'
})

var markerBunker = L.icon({
  iconUrl: './images/shared/icons/map/bunker.svg',
  iconSize:     [40, 50],
  iconAnchor:   [20, 50],
  popupAnchor:  [0, -45],
  className: 'marker-bunker'
})

var center =xy(0,0);
var island = xy(-970,820);
var marker = L.marker(center, {icon: mapMarker}).addTo(map).bindPopup("<h3>Center of map</h3>");
L.marker(island, {icon: mapMarker}).addTo(map).bindPopup("<h3>Island coffin</h3><button onclick='alert(\"Button clicked!\")'>Teleport Player</button><h3></h3><button onclick='alert(\"Button clicked!\")'>Teleport Kelvin</button>");

document.getElementById('map').style.backgroundColor = '#9FB5D6';

const fullscreenButton = L.control({ position: 'topright' });

fullscreenButton.onAdd = function(map) {
  const button = L.DomUtil.create('button', 'fullscreen-button');
  button.innerHTML = '⛶';
  button.title = 'Fullscreen';
  button.addEventListener('click', () => {
    const mapContainer = document.getElementById('map');
    mapContainer.classList.toggle('fullscreen');
  });
  return button;
};

fullscreenButton.addTo(map);
// Create the recenter button element
const recenterButton = L.control({ position: 'topright' });

recenterButton.onAdd = function(map) {
  const button = L.DomUtil.create('button', 'recenter-button');
  button.innerHTML = '↺';
  button.title = 'Recenter';
  button.addEventListener('click', () => {
    const center = L.latLng(2000, 2000); // Define the new center point
    const zoom = -3; // Define the new zoom level
    map.setView(center, zoom); // Set the new center and zoom level
  });
  return button;
};

recenterButton.addTo(map);

// // Add an event listener to update the size of the image overlay when the map is resized
// map.on('resize', function() {
//   image.setBounds(map.getBounds());
// });

// // Get a reference to the image overlay layer
// var imageOverlay = map._layers[L.stamp(image)];

// // Add an event listener to the map that will update the size of the image when the map is resized
// map.on('resize', function() {
//   var mapWidth = map.getSize().x;
//   var mapHeight = map.getSize().y;
//   imageOverlay._image.style.width = mapWidth + 'px';
//   imageOverlay._image.style.height = mapHeight + 'px';
// });

// Disable default behavior for opening popups
// map.options.maxZoom = map.options.minZoom;
// map.options.doubleClickZoom = false;
// map.options.scrollWheelZoom = false;
// map.options.touchZoom = false;
// map.options.boxZoom = false;
// map.options.tap = false;
// map.options.keyboard = false;
// map.options.dragging = false;
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.scrollWheelZoom.disable();

marker.on('click', function(e) {
  map.setView(e.target.getLatLng(), map.getZoom());
});

// Add an event listener to update the map center when the map container is resized
// map.on('resize', function() {
//   var oldCenterPoint = map.latLngToContainerPoint(map.getCenter());
//   var newMapWidth = map.getSize().x;
//   var newMapHeight = map.getSize().y;
//   var newCenterPoint = L.point(newMapWidth / 2, newMapHeight / 2);
//   var diff = newCenterPoint.subtract(oldCenterPoint);
//   var newCenterLatLng = map.containerPointToLatLng(oldCenterPoint.add(diff));
//   map.setView(newCenterLatLng, map.getZoom());
// });
