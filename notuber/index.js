function watchWindowSize() {
  var googleMap=document.getElementById('googleMap')
  // Gets the width and height of the window, excluding the scroll bar
  var clientHeight = document.documentElement.clientHeight;
  googleMap.style.height=clientHeight+'px'
  }
  // Append the event listener function to the resize event of the window
  window.addEventListener("resize", watchWindowSize);
  watchWindowSize()
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
  locate();
  showCars();
}
function drop() {
  // Loop set coordinate points
  markers = []
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


let infoWindow;
let locatePos;
let distanceList = [];
let nearestDistance = 0;
let nearestVehicle;
let flightPlanCoordinates;
let flightPath;
function locate() {
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locatePos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            // lat: 42.352271,
            // lng: -71.05524200000001,
          };
          map.setCenter(locatePos);
          const marker = new google.maps.Marker({position:locatePos, map: map,});
          marker.addListener("click", showNearestVehicle);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function showNearestVehicle() {
  infoWindow.setPosition(locatePos);
  infoWindow.setContent(`username: ${nearestVehicle.username}, id: ${nearestVehicle.id}, distance: ${nearestDistance} miles`);
  infoWindow.open(map);
}

function getVehicleList(params) {
  if(!locatePos) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locatePos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(locatePos);
          const marker = new google.maps.Marker({position:locatePos, map: map,});
          marker.addListener("click", showNearestVehicle);
          requestVehicle()
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
  requestVehicle()
}

function requestVehicle() {
  var http = new XMLHttpRequest();
  var url = 'https://thawing-plateau-76514.herokuapp.com/rides';
  var params = `username=VwKSnLPn&lat=${locatePos.lat}&lng=${locatePos.lng}`;
  // var params = "username=VwKSnLPn&lat=42.352271&lng=-71.05524200000001";
  http.open('POST', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          let vehicleList = JSON.parse(http.responseText)
          markers = []
          distanceList = []
          nearestDistance = 0
          flightPlanCoordinates = []
          flightPath && flightPath.setMap(null)
          for (var i = 0; i < vehicleList.length; i++) {
            markers.push(new google.maps.Marker({
              position: new google.maps.LatLng(vehicleList[i].lat, vehicleList[i].lng),
              map: map,
              icon: {
                url: './img/car.png',
                size: new google.maps.Size(45, 45),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 20),
                scaledSize: new google.maps.Size(20, 20),
                labelOrigin: new google.maps.Point(9, 8)
              }
            }));
            let distance = calcDistance(locatePos, {lat: vehicleList[i].lat, lng: vehicleList[i].lng})
            distanceList.push(distance)
            if(i === 0){
              nearestDistance = distance
            } else {
              nearestDistance = (nearestDistance < distance ? nearestDistance : distance)
            }
            nearestVehicle =  vehicleList[i]
          }
          flightPlanCoordinates = [
            locatePos,
            { lat: nearestVehicle.lat, lng: nearestVehicle.lng }
          ];
          flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          flightPath.setMap(map);
      }
  }
  http.send(params);
}

function showCars() {
  const locationButton = document.createElement("button");
  locationButton.textContent = "Get Cars";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);
  locationButton.addEventListener("click", () => {
    DeleteMarkers()
    getVehicleList('')
  })
}
function DeleteMarkers() {   
  //Loop through all the markers and remove   
  for (var i = 0; i < markers.length; i++) {   
      markers[i].setMap(null);   
  }   
  markers = [];   
}; 

// Calculate distance

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

function calcDistance(latLngA, latLngB) {
  var lat2 = latLngB.lat; 
  var lon2 = latLngB.lng; 
  var lat1 = latLngA.lat; 
  var lon1 = latLngA.lng; 
  
  var R = 6371; // km 
  var x1 = lat2-lat1;
  var dLat = x1.toRad();  
  var x2 = lon2-lon1;
  var dLon = x2.toRad();  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                 Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                 Math.sin(dLon/2) * Math.sin(dLon/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  // miles
  d /= 1.60934;
  return d
}