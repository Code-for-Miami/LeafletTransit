// Initialize map
var map = L.map('map').setView([25.795865,-80.287046], 11);
var debug = false; // Enable console debug messages
var enableRefresh = true;
var showAllLayers = true;

// Load MapBox map
var accessToken = 'pk.eyJ1IjoicXRyYW5kZXYiLCJhIjoiSDF2cGNjZyJ9.D1ybOKe77AQDPHkxCCEpJQ';
var osmLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/qtrandev.lc0i743k/{z}/{x}/{y}.png?access_token=' + accessToken, {
  maxZoom: 20,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
});
osmLayer.addTo(map);

// Set up Google Maps layers
var googleRoadmap = new L.Google('ROADMAP', { maxZoom: 20 });
var googleHybrid = new L.Google('HYBRID', { maxZoom: 20 });
var googleTraffic = new L.GoogleTraffic('ROADMAP', { maxZoom: 20 });

// Add Control Panel
addControlPane();

// Set up layers to allow user to control map display
var busLayer = new L.LayerGroup();
var busStopsLayer = new L.LayerGroup();
var metroRailLayer = new L.LayerGroup();
var poiLayer = new L.LayerGroup();
var trolleyLayer = new L.LayerGroup();
var trolleyStopsLayer = new L.LayerGroup();
var bikeLayer = new L.LayerGroup();
var nearbyLayer = new L.LayerGroup();
var doralTrolleyLayer = new L.LayerGroup();
var miamiBeachTrolleyLayer = new L.LayerGroup();
var miamiTransitAPILayer = new L.LayerGroup();
L.control.layers({'Open Street Map':osmLayer, 'Google Maps':googleRoadmap, 'Google Maps Satellite':googleHybrid, 'Google Maps Traffic':googleTraffic},{
    'Miami-Dade Transit Live Buses': busLayer,
    'Miami-Dade Transit Bus Stops': busStopsLayer,
    'Miami-Dade Transit Metro Rail': metroRailLayer,
    'Points of Interest': poiLayer,
    'Miami Trolleys': trolleyLayer,
    'Miami Trolley Stops': trolleyStopsLayer,
    'Miami Beach Trolleys': miamiBeachTrolleyLayer,
    'Doral Trolleys': doralTrolleyLayer,
    'Citi Bikes': bikeLayer,
    'Miami Transit API Bus GPS': miamiTransitAPILayer,
}).addTo(map);
// Add certain layers as default to be shown
busLayer.addTo(map);
metroRailLayer.addTo(map);
poiLayer.addTo(map);
trolleyLayer.addTo(map);
bikeLayer.addTo(map);
nearbyLayer.addTo(map);
doralTrolleyLayer.addTo(map);
miamiBeachTrolleyLayer.addTo(map);
//miamiTransitAPILayer.addTo(map);

// Button to allow user to locate current position
L.control.locate({ locateOptions: { maxZoom: 15 }}).addTo(map);

// Button to allow map to be full-screen
L.control.fullscreen().addTo(map);

// Intialize bus icon
var busIcon = L.icon({
    iconUrl: 'icons/icon-Bus-Tracker.png',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

// Intialize blue bus icon
var busIconBlue = L.icon({
    iconUrl: 'icons/icon-Bus-Tracker-blue.png',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

// Intialize aqua bus icon
var busIconAqua = L.icon({
    iconUrl: 'icons/icon-Bus-Tracker-aqua.png',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

// Intialize gray bus icon
var busIconGray = L.icon({
    iconUrl: 'icons/icon-Bus-Tracker-gray.png',
    iconSize: [33, 33],
    iconAnchor: [15, 15]
});

// Intialize bus stop icon
var busStopIcon = L.icon({
    iconUrl: 'icons/icon-Bus-Stop.png',
    iconSize: [22, 22],
    iconAnchor: [11, 22]
});

// Intialize Metrorail icon
var metroRailIcon = L.icon({
    iconUrl: 'icons/icon-Rail-Tracker.png',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

// Intialize Metrorail station icon
var metroRailStationIcon = L.icon({
    iconUrl: 'icons/icon-Rail-Station.png',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});

// Trolley icon
var trolleyIcon = L.icon({
    iconUrl: 'icons/icon-Trolley-Tracker.png',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
});

// Trolley stop icon
var trolleyStopIcon = L.icon({
    iconUrl: 'icons/icon-Trolley-Stop.png',
    iconSize: [22, 22],
    iconAnchor: [11, 22]
});

// Citi bike icon
var bikeIcon = L.icon({
    iconUrl: 'icons/citibikepin.png',
    iconSize: [33, 42],
    iconAnchor: [16, 42]
});

// POI icon
var poiIcon = L.icon({
    iconUrl: 'icons/icon-POI.png',
    iconSize: [44, 44],
    iconAnchor: [22, 38]
});

// Doral trolley icon
var doralTrolleyIcon = L.icon({
    iconUrl: 'icons/doral-bus.png',
    iconSize: [28, 45],
    iconAnchor: [14, 45]
});

// Doral trolley route icon
var TSOTrolleyrouteIcon = L.icon({
    iconUrl: 'icons/doral-bus-stop.png',
    iconSize: [15, 15],
    iconAnchor: [7, 15]
});

// Miami Beach trolley icon
var miamiBeachTrolleyIcon = L.icon({
    iconUrl: 'icons/miamibeach-bus.png',
    iconSize: [28, 45],
    iconAnchor: [14, 45]
});

// Keep track of each route ID, trip ID and its shape ID, and color of the route.
var tripRouteShapeRef = []; // Format is {tripId: "", routeId: "", shapeId: "", color: ""}

// Track which shape ID and the corresponding has already been displayed
var displayedShapeIds = [];

// Track all routes and their directions
var routeDirections = []; // Format is {routeId: "", "direction"}

// Track bus stops of each route-direction that has already been displayed
var displayedBusStops = [];

// Keep track of scope to refresh the page after data is received
var scope;

// Hold bus routes in array map to zoom when selecting route in bus stops table
var polylineMapping = [];

// Hold POIs in array map to allow zoom to a specifc POI
var poiMapping = [];

// Hold buses in array map to allow zoom to a specific bus
var busMapping = [];

// Cache nearby markers to remove later
var nearbyCache = [];

// Track the city to receive trolley information
var cityTrolley = "";

// Refresh time for Miami Transit API
var refreshTime = 5000;

// Cache old locations of buses to display history
var refreshDisplayCache = [];
refreshDisplayCache.Buses = [];
refreshDisplayCache.BusGPS = [];

// Cache markers
var cachedMarkers = [];
var cachedBusGPSMarkers = [];
var cachedMetroRailMarkers = [];
var cachedMDTBusMarkers = [];
var cachedMiamiTrolleyMarkers = [];
var cachedDoralTrolleyMarkers = [];
var cachedMiamiBeachTrolleyMarkers = [];
var fakePositionOffset = 0.0;

// Base URL for API server
var apiURL = 'https://miami-transit-api.herokuapp.com/';

init();

function init() {
  angular.module('transitApp', []).controller('transitController', ['$scope', function($scope) {
    scope = $scope;
    $scope.tripRouteShapeRef = tripRouteShapeRef;
    $scope.refreshTime = refreshTime;
    }
  ]);
  $.getJSON(apiURL + 'api/Buses.json',
  function(data) {
    $("#wait").hide();
    var records = data.RecordSet;
    loadBusData(records);
  });
}

function loadBusData(data) {
  if (data !== null) generateBusList(data.Record, "REAL-TIME");
  loadRouteColors(); // Bus list must be loaded first
  displayRoutesFromTripId(tripRouteShapeRef); // Bus list must be loaded first to have the trip IDs
  showPOIs();
  getTrolleyData(scope);
  loadTrolleyRoutes();
  getTrolleyStops(scope);
  getCitiBikes();
  addDoralTrolleys();
  addDoralTrolleyRoutes();
  addMetroRail();
  addMetroRailRoutes();
  addMetroRailStations();
  addMiamiBeachTrolleys();
  addMiamiBeachTrolleyRoutes();
  // Refresh Miami Transit API data every 5 seconds
  setInterval(function() {
    if (enableRefresh) callMiamiTransitAPI();
  }, refreshTime);
}

function callMiamiTransitAPI() {
  loadBusTrackingGPSData();
  //loadMiamiTransitAPIBuses();
  addMetroRail();
  refreshMDTBuses();
  refreshMiamiTrolleys();
  addDoralTrolleys();
  addMiamiBeachTrolleys();
}

function generateBusList(data, realText) {
  var i = 0;
  var uniqueBusRoutes = [];
  for (i = 0; i < data.length; i++) {
    // Add each bus to the map
    addBusMarker(
      busLayer,
      data[i].Latitude,
      data[i].Longitude,
      data[i].BusName,
      data[i].TripHeadsign,
      data[i].BusID,
      data[i].LocationUpdated,
      realText
    );
    // Add to the global trip-route-shape list
    tripRouteShapeRef[tripRouteShapeRef.length] = {
      tripId: data[i].TripID,
      routeId: data[i].RouteID,
      shapeId: ""
    };
    addRouteDirection(data[i].RouteID,data[i].ServiceDirection);

    // Filter out unique buses to display in bus stops table dropdown
    var routeId = data[i].RouteID;
    var serviceDirection = data[i].ServiceDirection;
    var unique = true;
    if (uniqueBusRoutes.length > 0) {
      var j =0;
      for (j = 0; j < uniqueBusRoutes.length; j++) {
        if ((uniqueBusRoutes[j].RouteID === routeId) && (uniqueBusRoutes[j].ServiceDirection === serviceDirection)) {
          // Found duplicate, don't add
          unique = false;
          break;
        }
      }
    }
    if (unique) {
      uniqueBusRoutes.push({
        RouteID : routeId,
        ServiceDirection : serviceDirection
      });
    }
  }
  scope.buses = data;
  scope.uniqueBusRoutes = uniqueBusRoutes;
  scope.$apply();
}


function addRouteDirection(route, serviceDirection) {
  if (routeDirections.length > 0) {
    if (debug) console.log("routeDirections.length = "+routeDirections.length);
    var allowAdd = true;
    var i = 0;
    for (i = 0; i < routeDirections.length; i++) {
      if ((routeDirections[i].routeId == route) && (routeDirections[i].direction == serviceDirection)) {
        allowAdd = false;
        break;
      }
    }
    if (allowAdd) {
      routeDirections[routeDirections.length] = {routeId: route, direction: serviceDirection}; // Add if not a duplicate
      if (debug) console.log("Added route: "+route+" and direction: "+serviceDirection);
    }
  } else {
    routeDirections[0] = {routeId: route, direction: serviceDirection};
    scope.routeDir = route+' '+serviceDirection; // Set the first bus stop route-direction to show
    if (debug) console.log("Added route: "+route+" and direction: "+serviceDirection);
  }
}


function loadRouteColors() {
  $.getJSON(apiURL + 'api/BusRoutes.json',
  function(data) {
    var records = data.RecordSet.Record;
    scope.routes = records;
    var i = 0;
    for (i = 0; i < records.length; i++) {
      // Add to global ref list
      // Data format is {tripId: "", routeId: "", shapeId: "", color: ""}
      var route = records[i].RouteID;
      for (j = 0; j < tripRouteShapeRef.length; j++) {
        if (tripRouteShapeRef[j].routeId == route) {
          tripRouteShapeRef[j].color = records[i].RouteColor;
        }
      }
    }
    scope.$apply();
  });
}

function addBusMarker(layer, lat, lon, name, desc, id, time, realText) {
  var marker = L.marker([lat, lon], {icon: busIcon}).bindPopup(
      realText+' ('+name+') Bus # '+desc+
      ' (ID: '+id+') <br /> Location Updated: '+time,
      { offset: new L.Point(0, 0) });
  marker.addTo(layer);
  busMapping[id] = marker;
  cachedMDTBusMarkers[id] = marker;
}

function displayRoutesFromTripId(tripRefs) {
  if (debug) console.log("Trip refs length = "+tripRefs.length);
  var i = 0;
  for (i = 0; i < tripRefs.length; i++) {
  	// Send the request to get the shape ID for each trip ID
    $.getJSON(apiURL + 'api/BusRouteShapesByTrip.json?TripID='+tripRefs[i].tripId,
    (function(thistripId) {
       return function(data) {
         var records = data.RecordSet.Record;
         var shapeId = records.ShapeID;
         var routeId;
         // Add shape ID into global trip reference list
         // Data format is {tripId: "", routeId: "", shapeId: "", color: ""}
         for (i = 0; i < tripRouteShapeRef.length; i++) {
           if (tripRouteShapeRef[i].tripId == thistripId) {
             tripRouteShapeRef[i].shapeId = shapeId;
             routeId = tripRouteShapeRef[i].routeId;
             break; // Can break since a separate request is sent for each trip ID
           }
         }
         displayFromShapeId(shapeId, routeId);
         };
      }(tripRefs[i].tripId))
    );
  }
}

// Retrieve lat/long list for each route's shape ID
function displayFromShapeId(shapeId, routeId) {
  $.getJSON(apiURL + 'api/BusRouteShape.json?ShapeID='+shapeId,
    function(data) {
      // Find the color for the route
      var color = "";
      var records = data.RecordSet.Record;
      for (i = 0; i < tripRouteShapeRef.length; i++) {
        if (tripRouteShapeRef[i].shapeId == shapeId) {
          color = tripRouteShapeRef[i].color;
          break;
        }
      }

      if (displayedShapeIds.length === 0) { // Display the first shape ID
        addRoutePoints(busLayer, '#'+color, records, routeId);
        addDisplayedShapeId(shapeId);
      } else { // Check for any duplicate shape ID and not display
        for (var displayed in displayedShapeIds) {
          if (displayed == shapeId) break;
          addRoutePoints(busLayer, '#'+color, records, routeId);
          addDisplayedShapeId(shapeId);
          break;
        }
      }
    });
}

// Add all the route lines and colors to the map for each shape point list
function addRoutePoints(layer, routeColor, records, routeId) {
  var latlngs = [];
  for (i = 0; i < records.length; i++) {
    latlngs[latlngs.length] = (L.latLng(records[i].Latitude, records[i].Longitude));
  }

  var markerLine = L.polyline(latlngs, {color: routeColor});
  markerLine.addTo(layer);
  polylineMapping[routeId] = markerLine;
}

// Track which shape ID has already been displayed
function addDisplayedShapeId(shapeId) {
  displayedShapeIds[displayedShapeIds.length] = shapeId;
  requestBusStops(shapeId);
}

function requestBusStops(shapeId) {
  if (debug) console.log("Requesting bus stops for "+shapeId);
  if (debug) console.log("tripRouteShapeRef length = "+tripRouteShapeRef.length);
  var i = 0;
  for (i = 0; i < tripRouteShapeRef.length; i++) {
    //if (debug) console.log("Inspecting item shape ID: "+tripRouteShapeRef[i].shapeId+" trip ID: "+tripRouteShapeRef[i].tripId);
    if (shapeId == tripRouteShapeRef[i].shapeId) {
      if (debug) console.log("Shape ID matched tripRouteShapeRef "+shapeId+" at index "+i+" of "+tripRouteShapeRef.length);
      if (debug) console.log("routeDirections.length = "+routeDirections.length);
      var j = 0;
      for (j = 0; j < routeDirections.length; j++) {
        var route = routeDirections[j].routeId;
        if (debug) console.log("Comparing routeDirections list route "+route+" against trip Ref list route: "+tripRouteShapeRef[i].routeId);
        if (route === tripRouteShapeRef[i].routeId) {
          if (debug) console.log("Route ID found "+route+ " at index "+j+" of "+routeDirections.length);
          sendBusStopRequest(route, routeDirections[j].direction);
          // break; Keep looking for Eastbound/Southbound and Clockwise/CntrClockwise
        }
      }
      break;
    }
  }

}

function sendBusStopRequest(route, direction) {

  // Ignore requested routes and directions
  if (displayedBusStops.indexOf(route+""+direction) > -1) {
    if (debug) console.log("Ignore "+route+" "+direction+" since it has already been requested.");
    return;
  }
  displayedBusStops[displayedBusStops.length] = route+""+direction;

  $.getJSON(apiURL + 'api/BusRouteStops.json?RouteID='+route+'&Dir='+direction,
  function(data) {
    var records = data.RecordSet.Record;
    if (!scope.busStops) scope.busStops = [];
    scope.busStops[route+" "+direction] = records;
    scope.$apply();
    var i = 0;
    for (i = 0; i < records.length; i++) {
      addBusStopMarker(
        busStopsLayer,
        records[i].Latitude,
        records[i].Longitude,
        records[i].StopName,
        route
      );
    }
  });
}

function addBusStopMarker(layer, lat, lon, name, route) {
  // var marker = L.circleMarker(L.latLng(lat, lon), {color: 'green', radius: 8}).bindPopup(
  //    'Route: '+route+' Bus Stop: '+name,
  //    { offset: new L.Point(0, 0) });

  var marker = L.marker([lat, lon], {icon: busStopIcon, zIndexOffset: -100}).bindPopup(
    'Route: '+route+' Bus Stop: '+name,
    { offset: new L.Point(0, 0) });
  marker.addTo(layer);
}

function showPOIs() {
  $.getJSON(apiURL + 'api/PointsOfInterest.json',
  function(data) {
    var records = data.RecordSet.Record;
    scope.POIs = records;
    scope.$apply();
    var i = 0;
    for (i = 0; i < records.length; i++) {
      var address =
        records[i].Address + '<br>' +
        records[i].City + ', ' +
        records[i].State + ' ' +
        records[i].Zip;
      addPOIMarker(
        poiLayer,
        records[i].Latitude,
        records[i].Longitude,
        records[i].PointName,
        records[i].PointID,
        records[i].CategoryID,
        records[i].CategoryName,
        address
      );
    }
  });
}

function addPOIMarker(layer, lat, lon, name, poiId, catId, catName, address) {
  var poiIcon = L.icon({
      iconUrl: 'icons/icon-POI-'+catId+'.png',
      iconSize: [33, 33], // Normal size is 44x44
      iconAnchor: [16, 33]
  });
  var marker = L.marker([lat, lon], {icon: poiIcon, zIndexOffset: -1000}).bindPopup(
      '<strong>' + catName + '</strong><br><br>' + name + '<br>' +  address,
      { offset: new L.Point(0, -16) });
  layer.addLayer(marker);
  poiMapping[poiId] = marker;
}

function getTrolleyData(scope) {
  $.getJSON( apiURL + 'api/trolley/vehicles.json',
    function(data) {
       var trolleys = data.get_vehicles;
       var count = trolleys.length;
       for (i = 0; i < count; i++) {
         trolleys[i].receiveTime = (new Date(trolleys[i].receiveTime)).toLocaleString();
         addTrolleyMarker(
           trolleyLayer,
           trolleys[i].lat,
           trolleys[i].lng,
           trolleys[i].equipmentID,
           trolleys[i].routeID,
           trolleys[i].receiveTime
         );
       }
       scope.trolleys = trolleys;
    });
}

function addTrolleyMarker(layer, lat, lng, equipmentID, routeID, receiveTime) {
  var marker = L.marker([lat, lng], {icon: trolleyIcon}).bindPopup(
      'Trolley # '+equipmentID+
      '<br />Route: '+routeID+
      '<br />Received Time: '+receiveTime,
      { offset: new L.Point(0, 0) });
  marker.addTo(layer);
  cachedMiamiTrolleyMarkers[equipmentID] = marker;
}

function loadTrolleyRoutes() {
  $.getJSON('routeCoords.json',
  function(data) {
    var i = 1;
    for (i = 1; i < 8; i++) {
      var color = data[i].color.normal;
      displayTrolleyRouteColors(trolleyLayer, color, data[i].coords);
    }
  });
}

function displayTrolleyRouteColors(layer, color, coords) {
  var latlngs = [];
  for (i = 0; i < coords.length; i++) {
    latlngs.push(L.latLng(coords[i][1], coords[i][0]));
  }

  var lineMarker = L.polyline(latlngs, {color: '#'+color});
  lineMarker.addTo(layer);
}

function getTrolleyStops(scope) {
  $.getJSON( apiURL + 'api/trolley/stops.json',
    function(data) {
      var stops = data.get_stops;
      var count = stops.length;
      for (i = 0; i < count; i++) {
        addTrolleyStopMarker(
          trolleyStopsLayer,
          stops[i].lat,
          stops[i].lng,
          stops[i].name,
          stops[i].id
        );
      }
      scope.stops = stops;
  });
}

function addTrolleyStopMarker(layer, lat, lon, name, id) {
  var marker = L.marker([lat, lon], {icon: trolleyStopIcon, zIndexOffset: -110}).bindPopup(
    'Stop ID: '+id+'<br />Stop Name: '+name,
    { offset: new L.Point(0, 0) });
  marker.addTo(layer);
}

function routeChanged(rd) {
  scope.routeDir = rd;
  scope.$apply();
  var routeId = rd.split(" ")[0];
  focusRoute(routeId);
}

function focusPOI(poiIdLatLng) {
  map.addLayer(poiLayer);
  map.addLayer(nearbyLayer);
  var array = poiIdLatLng.split(",");
  var poiId = array[0];
  var lat = array[1];
  var lng = array[2];
  map.fitBounds(L.latLngBounds([poiMapping[poiId].getLatLng()]));
  poiMapping[poiId].openPopup();
  window.scrollTo(0, 0);
  getNearBy(poiId,lat,lng);
}

function focusRoute(routeId) {
  map.addLayer(busLayer);
  map.fitBounds(polylineMapping[routeId].getBounds());
  window.scrollTo(0, 0);
}

function focusBus(busId) {
  map.addLayer(busLayer);
  map.fitBounds(L.latLngBounds([busMapping[busId].getLatLng()]));
  busMapping[busId].openPopup();
  window.scrollTo(0, 0);
}

function getCitiBikes() {
  var source = "http://citibikemiami.com/downtown-miami-locations.xml";
  $.getJSON(
       'http://anyorigin.com/dev/get?url='+source+'&callback=?',
       (function(thisScope) {
        return function(data) {
          var xmlDoc = $.parseXML(data.contents);
          $xml = $( xmlDoc );

          $Id = $xml.find("Id");
          $Address = $xml.find("Address");
          $Distance = $xml.find("Distance");
          $Latitude = $xml.find("Latitude");
          $Longitude = $xml.find("Longitude");
          $Bikes = $xml.find("Bikes");
          $Dockings = $xml.find("Dockings");
          var i = 0;
          for (i = 0; i < $Id.length; i++) {
            addBikeMarker(
              bikeLayer,
              $Latitude[i].textContent,
              $Longitude[i].textContent,
              $Id[i].textContent,
              $Address[i].textContent,
              $Bikes[i].textContent,
              $Dockings[i].textContent
            );
          }
        };
      }(scope))
  );
}

function addBikeMarker(layer, lat, lng, id, address, bikes, dockings) {
  var marker = L.marker([lat, lng], {icon: bikeIcon, zIndexOffset: -500}).bindPopup(
      '<strong>Citi Bike Station ID: ' + id + '</strong><br><br>Address: ' + address + '<br>Bikes: ' +  bikes + '<br>Dockings: ' +  dockings,
      { offset: new L.Point(0, -21) });
  layer.addLayer(marker);
}

function getNearBy(poiId, lat, lng) {
  if (nearbyCache.length > 0) {
    for (i = 0; i < nearbyCache.length; i++) {
      map.removeLayer(nearbyCache[i]);
    }
  }
  $.getJSON(apiURL + 'api/Nearby.json?Lat='+lat+'&Long='+lng,
    function(data) {
      var records = data.RecordSet.Record;
      nearbyCache = [];
      var bounds = [];
      for (i = 0; i < records.length; i++) {
        addNearByMarker(
          nearbyLayer,
          records[i].NearbyID,
          records[i].NearbyName,
          records[i].NearbyType,
          records[i].Descr,
          records[i].Distance,
          records[i].Latitude,
          records[i].Longitude,
          lat,
          lng
        );
        bounds[i] = [records[i].Latitude,records[i].Longitude];
      }
      map.fitBounds(bounds);
    }
  );
}

function addNearByMarker(layer, NearbyID, NearbyName, NearbyType, Descr, Distance, Latitude, Longitude, sourceLat, sourceLng) {
  var marker = L.marker([Latitude, Longitude], {icon: poiIcon, zIndexOffset: 10}).bindPopup(
    '<strong>'+NearbyType+'</strong><br /><br />'+
    'Name: '+NearbyName+
    '<br />Description: '+Descr+
    '<br />Distance: <strong>'+Distance+'</strong>'+
    '<br />Nearby ID: '+NearbyID,
    { offset: new L.Point(0, -22) });
  marker.on('mouseover', function (e) {
    this.openPopup();
  });
  marker.addTo(layer);
  nearbyCache.push(marker);
  var latlngs = [L.latLng(Latitude, Longitude), L.latLng(sourceLat, sourceLng)];
  var markerLine = L.polyline(latlngs, {color: 'aqua'});
  markerLine.addTo(layer);
  nearbyCache.push(markerLine);
}

function addDoralTrolleys() {
  var api = 'http://rest.tsoapi.com/';
  var controller = 'MappingController';
  var methodName = 'GetUnitFromRouteAntibunching';

  var data = [];
  var doraltkn = '582EB861-9C13-4C89-B491-15F0AFBF9F47';
  data[0] = { tkn: doraltkn, geofencesid: '35929', lan: 'en' };
  data[1] = { tkn: doraltkn, geofencesid: '36257', lan: 'en' };
  data[2] = { tkn: doraltkn, geofencesid: '36270', lan: 'en' };

  sendTSOTrolleyRequest(api, controller, methodName, data[0], handleDoralTrolleyCallback);
  sendTSOTrolleyRequest(api, controller, methodName, data[1], handleDoralTrolleyCallback);
  sendTSOTrolleyRequest(api, controller, methodName, data[2], handleDoralTrolleyCallback);
}

function sendTSOTrolleyRequest(api, controller, methodName, data, callback) {
  $.ajax({
    url: api + "/" + controller + "/" + methodName,
    data: data,
    type: "POST",
    contentType: "application/javascript",
    dataType: "jsonp",
    success: function (data, textStatus) {
        //console.log(data);
        callback(data);
    },
    error: function (xhr, status, errorThrown) {
        console.log(xhr.statusText);
    }
  });
}

function handleDoralTrolleyCallback(data) {
  var obj = jQuery.parseJSON(data);
  var trolleys = obj.Units;
  var i = 0;
  for (i = 0; i < trolleys.length; i++) {
    addDoralTrolleyMarker(
      doralTrolleyLayer,
      trolleys[i].MarkerID,
      trolleys[i].MarkerName,
      trolleys[i].Latitude,
      trolleys[i].Longitude,
      trolleys[i].Direction,
      trolleys[i].Heading
    );
  }
}

function addDoralTrolleyMarker(layer, MarkerID, MarkerName, Latitude, Longitude, Direction, Heading) {
  if (cachedDoralTrolleyMarkers[MarkerID] !== undefined) {
    var currentMarker = cachedDoralTrolleyMarkers[MarkerID];
    currentMarker.setLatLng(L.latLng(Latitude, Longitude));
    flashMarker(layer, currentMarker);
    return;
  }
  var marker = L.marker([Latitude, Longitude], {icon: doralTrolleyIcon, zIndexOffset: 100}).bindPopup(
      '<strong>Doral Trolley ' + MarkerName + '</strong><br><br>ID: ' + MarkerID + '<br>Direction: ' +  Direction,
      { offset: new L.Point(0, -22) });
  layer.addLayer(marker);
  cachedDoralTrolleyMarkers[MarkerID] = marker;
}

function addMiamiBeachTrolleyRoutes() {
  // Add delay since there's a sharing bug with Doral route-getting code
  setTimeout(
    function(){
      cityTrolley = "Miami Beach";
      addTSOTrolleyRoutes('825894C5-2B5F-402D-A055-88F2297AF99A');
    }, 2000);
}

function addDoralTrolleyRoutes() {
  cityTrolley = "Doral";
  addTSOTrolleyRoutes('582EB861-9C13-4C89-B491-15F0AFBF9F47');
}

function addTSOTrolleyRoutes(tkn) {
  var api = 'http://rest.tsoapi.com/';
  var controller = 'Routes';
  var methodName = 'GetRouteFromToken';

  var data = { tkn: tkn, routeId: '-1'};

  sendTSOTrolleyRequest(api, controller, methodName, data, handleTSORoutesCallback);
}

function handleTSORoutesCallback(data) {
  var obj = jQuery.parseJSON(data);

  /** Example:
  "ID": "662978",
  "ContactID": "2047762",
  "StopNumber": "3001",
  "Street": "7701 Northwest 79th Avenue 7701 Northwest 79th Avenue",
  "City": "Miami",
  "State": "FL",
  "PostalCode": "33166",
  "CountryCode": "US",
  "Sequence": "1",
  "Latitude": "25.843700",
  "Longitude": "-80.323900",
  "Description": "Palmetto Metrorail Station, Transfers to Route 2, MDT MetroRail Green Line & Route 87",
  "RouteId": "36270"
  */
  var stops = obj.stops;

  /** Example:
  "Name": "Doral Transportation",
  "MapType": "MAP",
  "MapImageURL": "MapImage_CityOfDoral.png",
  "RouteId": "35929",
  "ShowAutomatically": "True",
  "Name1": "Public Doral Route #1",
  "LineColor": "#3A77C7",
  "RoutePath": "oxj|CnijiNF..."
  */
  var routes = obj.routes;

  /** Example:
  "Id": "166461",
  "RouteId": "36257",
  "Lat": "25.8443000000",
  "Lng": "-80.3237000000",
  "Direction": "W ",
  "Angle": "-90.000000",
  "StopA": "729094",
  "StopB": "729095",
  "Seq": "0",
  "DesignerStopID": "729094",
  "OriginalLat": "25.8443000000",
  "OriginalLng": "-80.3237000000",
  "AudioID": "156"
  */
  var points = obj.points;

  var layer = doralTrolleyLayer;
  if (cityTrolley === "Miami Beach") {
    layer = miamiBeachTrolleyLayer;
  }

  var i = 0;
  for (i = 0; i < stops.length; i++) {
    addTSOTrolleyRouteStops(layer, stops[i], routes);
  }

  addTSOTrolleyRouteLines(layer, points, routes);
}

function addTSOTrolleyRouteStops(layer, stop, routes) {
  // Match the stop with the route
  var routeLineColor;
  var routeName;
  var i = 0;
  for (i = 0; i < routes.length; i++) {
    if (stop.RouteId == routes[i].RouteId) {
      routeLineColor = routes[i].LineColor;
      routeName = routes[i].Name1;
      break;
    }
  }

  var marker = L.marker([stop.Latitude, stop.Longitude], {icon: TSOTrolleyrouteIcon, zIndexOffset: -100}).bindPopup(
      '<strong>' + cityTrolley + ' Trolley Stop ' + stop.StopNumber + '</strong>' +
      '<br><br>' + stop.Description +
      '<br><br>' + stop.Street +
      '<br>' + stop.City + ', ' + stop.State + ' ' + stop.PostalCode +
      '<br><span style="color:'+ routeLineColor +'">Route ID: ' + stop.RouteId + "</span>" +
      '<br><span style="color:'+ routeLineColor +'">Route Name: ' + routeName + "</span>" +
      '<br>Sequence: ' + stop.Sequence +
      '<br>ID: ' + stop.ID +
      '<br>ContactID: ' + stop.ContactID,
      { offset: new L.Point(0, 0) });
  layer.addLayer(marker);
}

function addTSOTrolleyRouteLines(layer, points, routes) {
  // Map the RouteId with the color for easy lookup
  var routeColorMap = [];
  var i = 0;
  for (i = 0; i < routes.length; i++) {
    routeColorMap[routes[i].RouteId] = {LineColor: routes[i].LineColor, Points: []};
  }

  // Separate points for each route
  i = 0;
  for (i = 0; i < points.length; i++) {
    routeColorMap[points[i].RouteId].Points.push(L.latLng(points[i].Lat, points[i].Lng));
  }

  for (var routeId in routeColorMap) {
    var markerLine = L.polyline(routeColorMap[routeId].Points, {color: routeColorMap[routeId].LineColor});
    layer.addLayer(markerLine);
  }
}

function addMetroRail() {
  $.getJSON(apiURL + 'api/Trains.json',
  function(data) {
    if (data.RecordSet === null) return; // No rail data at night
    var records = data.RecordSet.Record;
    var i = 0;
    for (i = 0; i < records.length; i++) {
      addMetroRailMarker(
        metroRailLayer,
        records[i].Latitude,
        records[i].Longitude,
        records[i].TrainID,
        records[i].LineID,
        records[i].Cars,
        records[i].Direction,
        records[i].ServiceDirection,
        records[i].LocationUpdated
        );
    }
  });
}

function addMetroRailMarker(layer, Latitude, Longitude, TrainID, LineID, Cars, Direction, ServiceDirection, LocationUpdated) {
  if (cachedMetroRailMarkers[TrainID] !== undefined) {
      var currentMarker = cachedMetroRailMarkers[TrainID];
      currentMarker.setLatLng(L.latLng(Latitude, Longitude));
      flashMarker(layer, currentMarker);
      return;
    }
  var marker = L.marker([Latitude, Longitude], {icon: metroRailIcon, zIndexOffset: 100}).bindPopup(
      '<strong>Metro Rail Train ' + TrainID +
      '<br>Line: ' + LineID +
      '</strong><br><br>Cars: ' + Cars +
      '<br>Direction: ' +  Direction +
      '<br>Service Direction: ' + ServiceDirection +
      '<br>Location Updated: ' + LocationUpdated,
      { offset: new L.Point(0, 0) });
  layer.addLayer(marker);
  cachedMetroRailMarkers[TrainID] = marker;
}

function addMetroRailRoutes() {
  $.getJSON(apiURL + 'api/TrainMapShape.json',
  function(data) {
    var records = data.RecordSet.Record;
    var greenLineLatLngs = [];
    var orangeLineLatLngs = [];
    var i = 0;
    for (i = 0; i < records.length; i++) {
      if (records[i].LineID === "GRN") {
        greenLineLatLngs.push(L.latLng(records[i].Latitude, records[i].Longitude));
      } else {
        orangeLineLatLngs.push(L.latLng(records[i].Latitude, records[i].Longitude));
      }
    }
    addMetroRailRouteColors(
      metroRailLayer,
      greenLineLatLngs,
      "green"
    );
    addMetroRailRouteColors(
      metroRailLayer,
      orangeLineLatLngs,
      "orange"
    );
  });
}

function addMetroRailRouteColors(layer, latlngs, color) {
  var lineMarker = L.polyline(latlngs, {color: color});
  lineMarker.addTo(layer);
}

function addMetroRailStations() {
  $.getJSON(apiURL + 'api/TrainStations.json',
  function(data) {
    var records = data.RecordSet.Record;
    var i = 0;
    for (i = 0; i < records.length; i++) {
      addMetroRailStationMarker(
        metroRailLayer,
        records[i].Latitude,
        records[i].Longitude,
        records[i].StationIDshow,
        records[i].Station,
        records[i].Address + "<br>" + records[i].City + ", " + records[i].State + " " + records[i].Zip,
        records[i].Parking,
        records[i].ConnectingOther,
        records[i].PlacesOfInterest,
        records[i].Other,
        records[i].Airport,
        records[i].TriRail,
        records[i].LongTermParking,
        records[i].svLatitude,
        records[i].svLongitude,
        records[i].svHeading
        );
    }
  });
}

function addMetroRailStationMarker(
    layer,
    Latitude,
    Longitude,
    StationIDshow,
    Station,
    Address,
    Parking,
    ConnectingOther,
    PlacesOfInterest,
    Other,
    Airport,
    TriRail,
    LongTermParking,
    svLatitude,
    svLongitude,
    svHeading) {
  var marker = L.marker([Latitude, Longitude], {icon: metroRailStationIcon, zIndexOffset: -100}).bindPopup(
      '<strong>' + StationIDshow +
      '<br>' + Station +
      '</strong><br><br>' + Address +
      '<br><br>Parking: ' +  Parking +
      '<br>Long-Term Parking: ' + LongTermParking +
      '<br>Airport: ' + Airport +
      '<br>TriRail: ' + TriRail +
      '<br>Places of Interest: ' + PlacesOfInterest +
      '<br>Other: ' + Other +
      '<br>Connecting Other: ' + ConnectingOther,
      { offset: new L.Point(0, 0) });
  layer.addLayer(marker);
}

function addMiamiBeachTrolleys() {
  var api = 'http://rest.tsoapi.com/';
  var controller = 'MappingController';
  var methodName = 'GetUnitFromRouteAntibunching';

  var data = [];
  var miamibeachtkn = '825894C5-2B5F-402D-A055-88F2297AF99A';
  data[0] = { tkn: miamibeachtkn, geofencesid: '38836', lan: 'en' };
  data[1] = { tkn: miamibeachtkn, geofencesid: '40756', lan: 'en' };

  sendTSOTrolleyRequest(api, controller, methodName, data[0], handleMiamiBeachTrolleyCallback);
  sendTSOTrolleyRequest(api, controller, methodName, data[1], handleMiamiBeachTrolleyCallback);
}

function handleMiamiBeachTrolleyCallback(data) {
  var obj = jQuery.parseJSON(data);
  var trolleys = obj.Units;
  var i = 0;
  for (i = 0; i < trolleys.length; i++) {
    addMiamiBeachTrolleyMarker(
      miamiBeachTrolleyLayer,
      trolleys[i].MarkerID,
      trolleys[i].MarkerName,
      trolleys[i].Latitude,
      trolleys[i].Longitude,
      trolleys[i].Direction,
      trolleys[i].Heading
    );
  }
}

function addMiamiBeachTrolleyMarker(layer, MarkerID, MarkerName, Latitude, Longitude, Direction, Heading) {
  if (cachedMiamiBeachTrolleyMarkers[MarkerID] !== undefined) {
    var currentMarker = cachedMiamiBeachTrolleyMarkers[MarkerID];
    currentMarker.setLatLng(L.latLng(Latitude, Longitude));
    flashMarker(layer, currentMarker);
    return;
  }
  var marker = L.marker([Latitude, Longitude], {icon: miamiBeachTrolleyIcon, zIndexOffset: 100}).bindPopup(
      '<strong>Miami Beach Trolley ' + MarkerName + '</strong><br><br>ID: ' + MarkerID + '<br>Direction: ' +  Direction,
      { offset: new L.Point(0, -22) });
  layer.addLayer(marker);
  cachedMiamiBeachTrolleyMarkers[MarkerID] = marker;
}

function loadBusTrackingGPSData() {
  $.getJSON(apiURL+'tracker.json',
  function(data) {
    var records = data.features;
    //fakePositionOffset+=0.002;
    //records[0].properties.lon = records[0].properties.lon*1 - fakePositionOffset;
    var i = 0;
    for (i = 0; i < records.length; i++) {
      // Check refresh display cache to display past bus locations
      var cache = refreshDisplayCache.BusGPS[records[i].properties.BusID];
      if (cache !== undefined) {
        // Only push to refresh display cache if position changed
        var lastBus = cache[cache.length-1];
        if (!((lastBus.properties.lat === records[i].properties.lat) && (lastBus.properties.lon === records[i].properties.lon))) {
          cache.push(records[i]);
        }
        displayCachedBusGPSLines(miamiTransitAPILayer, cache);
      } else {
        cache = [records[i]];
        refreshDisplayCache.BusGPS[records[i].properties.BusID] = cache;
      }
      displayCachedGPSBuses(miamiTransitAPILayer, cache[cache.length-1]);
      addBusTrackingGPSMarker(
        miamiTransitAPILayer,
        records[i].properties.BusID,
        records[i].properties.lat,
        records[i].properties.lon,
        records[i].properties.speed,
        records[i].properties.bustime);
    }
  });
}

function displayCachedGPSBuses(layer, record) {
  var marker = L.marker([record.properties.lat, record.properties.lon], {icon: busIconGray, zIndexOffset: -90}).bindPopup(
      '<strong>Bus Tracking GPS</strong>'+
      '<br /><br />Bus ID: ' +record.properties.BusID+
      '<br />Speed: ' +record.properties.speed+ ' MPH'+
      '<br />Bus Time: '+record.properties.bustime,
      { offset: new L.Point(0, -15) });
  marker.addTo(layer);
}

function addBusTrackingGPSMarker(layer, BusID, lat, lon, speed, bustime) {
  try {
    if (cachedBusGPSMarkers[BusID] !== undefined) {
      var currentMarker = cachedBusGPSMarkers[BusID];
      currentMarker.setLatLng(L.latLng(lat, lon));
      flashMarker(layer, currentMarker);
      return;
    }
    var marker = L.marker([lat, lon], {icon: busIconBlue}).bindPopup(
        '<strong>Bus Tracking GPS</strong>'+
		    '<br /><br />Bus ID: ' +BusID+
        '<br />Speed: ' +speed+ ' MPH'+
        '<br />Bus Time: '+bustime,
        { offset: new L.Point(0, -22) });
    marker.addTo(layer);
    cachedBusGPSMarkers[BusID] = marker;
  } catch (e) {
    console.log("Cannot add marker in addBusTrackingGPSMarker. Lat: "+lat+" Lon: "+lon+" Error: "+e);
  }
}

function loadMiamiTransitAPIBuses() {
  $.getJSON(apiURL+'buses.json',
  function(data) {
    var records = data.RecordSet.Record;
    var i = 0;
    for (i = 0; i < records.length; i++) {
      // Check refresh display cache to display past bus locations
      var cache = refreshDisplayCache.Buses[records[i].BusID];
      if (cache !== undefined) {
        // Only push to refresh display cache if position changed
        var lastBus = cache[cache.length-1];
        if (!((lastBus.Latitude === records[i].Latitude) && (lastBus.Longitude === records[i].Longitude))) {
          cache.push(records[i]);
        }
        displayCachedBusLines(miamiTransitAPILayer, cache);
      } else {
        cache = [records[i]];
        refreshDisplayCache.Buses[records[i].BusID] = cache;
      }
      displayCachedBuses(miamiTransitAPILayer, cache[cache.length-1]);
    }
  });
}

function displayCachedBuses(layer, bus) {
  addMiamiTransitAPIBusesMarker(layer, bus, false);
  addMiamiTransitAPIBusesMarker(layer, bus, true);
}

function addMiamiTransitAPIBusesMarker(layer, bus, latestBus) {
  if (latestBus) {
    if (cachedMarkers[bus.BusID] !== undefined) {
      var currentMarker = cachedMarkers[bus.BusID];
      currentMarker.setLatLng(L.latLng(bus.Latitude, bus.Longitude));
      flashMarker(layer, currentMarker);
      return;
    }
  }
  var options = latestBus? {icon: busIconAqua} : {icon: busIconGray, zIndexOffset: -90};
  var offset = latestBus? { offset: new L.Point(0, -22) } : { offset: new L.Point(0, -15) };
  var marker = L.marker([bus.Latitude, bus.Longitude], options).bindPopup(
      '<strong>Miami Transit API Bus</strong>' +
      '<br/><br/>Bus ID: ' + bus.BusID +
      '<br/>Bus Name: ' + bus.BusName +
      '<br/>Trip ID: ' + bus.TripID +
      '<br/>Trip: ' + bus.TripHeadsign +
      '<br/>Service: ' + bus.Service +
      '<br/>Service Name: ' + bus.ServiceName +
      '<br/>Service Direction: ' + bus.ServiceDirection +
      '<br/>Location Updated: ' + bus.LocationUpdated,
      offset);
  marker.addTo(layer);
  if (latestBus) cachedMarkers[bus.BusID] = marker;
}

function displayCachedBusLines(layer, cache) {
  var latlngs = [];
  var i = 0;
  for (i = 0; i < cache.length; i++) {
    latlngs.push(L.latLng(cache[i].Latitude, cache[i].Longitude));
  }
  displayLines(layer, latlngs, 'aqua');
}

function displayCachedBusGPSLines(layer, cache) {
  var latlngs = [];
  var i = 0;
  for (i = 0; i < cache.length; i++) {
    latlngs.push(L.latLng(cache[i].properties.lat, cache[i].properties.lon));
  }
  displayLines(layer, latlngs, 'aqua');
}

function displayLines(layer, latlngs, color) {
  var markerLine = L.polyline(latlngs, {color: color});
  markerLine.addTo(layer);
}

$(document).ready(function(){
  // Initial slider
  //$( "#slider" ).slider();
  toggleRefresh();

  $(".navbar-nav li a").click(collapseOffCanvasNav());
});

function addControlPane() {
  var info = L.control();
  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'control'); // create a div with a class "control"
    this.update();
    return this._div;
  };

  info.update = function () {
    this._div.innerHTML = '<h5>Map Controls</h5>' +
      '<button class="btn-xs btn-primary" onclick="showBusLayers()">Show Buses</button>' +
      '<button class="btn-xs btn-primary" onclick="showTrolleyLayers()">Show Trolleys</button>' +
      '<button class="btn-xs btn-primary" onclick="showRailLayers()">Show Metrorail</button>' +
      '<button class="btn-xs btn-primary" onclick="toggleLayers()">Show/Hide All</button>' +
      '<button class="btn-xs btn-primary" onclick="showBusGPS()">Show Bus GPS</button>' +
      '<button class="btn-xs btn-primary" onclick="toggleRefresh()">Toggle Refresh</button>' +
      '<div id="slider"></div>';
  };

  info.addTo(map);
}

function toggleRefresh() {
  enableRefresh = !enableRefresh;
  if (enableRefresh) {
    $("#refresh").show();
    hideLayers();
    map.addLayer(busLayer);
    map.addLayer(metroRailLayer);
    map.addLayer(trolleyLayer);
    map.addLayer(miamiTransitAPILayer);
    map.addLayer(doralTrolleyLayer);
    map.addLayer(miamiBeachTrolleyLayer);
    callMiamiTransitAPI();
  } else {
    $("#refresh").hide();
  }
}

function toggleLayers() {
  if (showAllLayers) {
    showLayers();
  } else {
    hideLayers();
  }
}

function showLayers() {
  map.addLayer(busLayer);
  map.addLayer(busStopsLayer);
  map.addLayer(metroRailLayer);
  map.addLayer(poiLayer);
  map.addLayer(trolleyLayer);
  map.addLayer(trolleyStopsLayer);
  map.addLayer(bikeLayer);
  map.addLayer(nearbyLayer);
  map.addLayer(doralTrolleyLayer);
  map.addLayer(miamiBeachTrolleyLayer);
  map.addLayer(miamiTransitAPILayer);
  showAllLayers = false;
}

function hideLayers() {
  map.removeLayer(busLayer);
  map.removeLayer(busStopsLayer);
  map.removeLayer(metroRailLayer);
  map.removeLayer(poiLayer);
  map.removeLayer(trolleyLayer);
  map.removeLayer(trolleyStopsLayer);
  map.removeLayer(bikeLayer);
  map.removeLayer(nearbyLayer);
  map.removeLayer(doralTrolleyLayer);
  map.removeLayer(miamiBeachTrolleyLayer);
  map.removeLayer(miamiTransitAPILayer);
  showAllLayers = true;
}

function showBusLayers() {
  map.addLayer(busLayer);
  map.addLayer(busStopsLayer);
  map.removeLayer(metroRailLayer);
  map.removeLayer(poiLayer);
  map.removeLayer(trolleyLayer);
  map.removeLayer(trolleyStopsLayer);
  map.removeLayer(bikeLayer);
  map.removeLayer(nearbyLayer);
  map.removeLayer(doralTrolleyLayer);
  map.removeLayer(miamiBeachTrolleyLayer);
  map.removeLayer(miamiTransitAPILayer);
}

function showTrolleyLayers() {
  map.removeLayer(busLayer);
  map.removeLayer(busStopsLayer);
  map.removeLayer(metroRailLayer);
  map.removeLayer(poiLayer);
  map.removeLayer(bikeLayer);
  map.removeLayer(nearbyLayer);
  map.removeLayer(miamiTransitAPILayer);
  map.addLayer(trolleyLayer);
  map.addLayer(trolleyStopsLayer);
  map.addLayer(doralTrolleyLayer);
  map.addLayer(miamiBeachTrolleyLayer);
}

function showRailLayers() {
  map.removeLayer(busLayer);
  map.removeLayer(busStopsLayer);
  map.addLayer(metroRailLayer);
  map.removeLayer(poiLayer);
  map.removeLayer(trolleyLayer);
  map.removeLayer(trolleyStopsLayer);
  map.removeLayer(bikeLayer);
  map.removeLayer(nearbyLayer);
  map.removeLayer(doralTrolleyLayer);
  map.removeLayer(miamiBeachTrolleyLayer);
  map.removeLayer(miamiTransitAPILayer);
}

function showBusGPS() {
  enableRefresh = true;
  $("#refresh").show();
  hideLayers();
  map.addLayer(miamiTransitAPILayer);
  callMiamiTransitAPI();
}

function flashMarker(layer, marker) {
  var circleMarker = L.circleMarker(marker.getLatLng(), {color: 'aqua', radius: 23});
  circleMarker.addTo(layer);
  setInterval(function() {
    map.removeLayer(circleMarker);
  }, 2000);
}

function refreshMDTBuses() {
  $.getJSON(apiURL + 'api/Buses.json',
  function(data) {
    var records = data.RecordSet.Record;
    var i = 0;
    for (i = 0; i < records.length; i++) {
      if (cachedMDTBusMarkers[records[i].BusID] !== undefined) {
        var currentMarker = cachedMDTBusMarkers[records[i].BusID];
        currentMarker.setLatLng(L.latLng(records[i].Latitude, records[i].Longitude));
        flashMarker(busLayer, currentMarker);
      }
    }
  });
}

function refreshMiamiTrolleys() {
  $.getJSON( apiURL + 'api/trolley/vehicles.json',
    function(data) {
       var trolleys = data.get_vehicles;
       var i = 0;
       for (i = 0; i < trolleys.length; i++) {
         if (cachedMiamiTrolleyMarkers[trolleys[i].equipmentID] !== undefined) {
           var currentMarker = cachedMiamiTrolleyMarkers[trolleys[i].equipmentID];
           currentMarker.setLatLng(L.latLng(trolleys[i].lat, trolleys[i].lng));
           flashMarker(trolleyLayer, currentMarker);
         }
       }
    });
}

/**
 *  Collapse offcanvas nav on nav item click
 */
function collapseOffCanvasNav() {
  var toggle = $('.navbar-toggle').is(':visible');

  if (toggle) {
    $('.navbar-collapse').collapse('hide');
  }
}
