// Center point coordinates
var berlin = new google.maps.LatLng(42.352271, -71.05524200000001);
// Vehicle coordinate list
var neighborhoods = [
  new google.maps.LatLng(42.3453, -71.0464),
  new google.maps.LatLng(42.3662, -71.0621),
  new google.maps.LatLng(42.3603, -71.0547),
  new google.maps.LatLng(42.3472, -71.0802),
  new google.maps.LatLng(42.3663, -71.0544),
  new google.maps.LatLng(42.3542, -71.0704),
];
var markers = [];
var map;
function initialize() {
  // Instantiating a map
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: berlin
  };
  map = new google.maps.Map(document.getElementById('googleMap'),
    mapOptions);
  
  drop();
}
function drop() {
  // Loop set coordinate points
  for (var i = 0; i < neighborhoods.length; i++) {
    markers.push(new google.maps.Marker({
      position: neighborhoods[i],
      map: map,
      animation: google.maps.Animation.BOUNCE,
      icon: {
        url: './img/car.png',
        size: new google.maps.Size(45, 45),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 20),
        scaledSize: new google.maps.Size(20, 20),
        labelOrigin: new google.maps.Point(9, 8)
      }
    }));
  }
}
google.maps.event.addDomListener(window, 'load', initialize);