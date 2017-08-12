var map;

var mapOptions = {
  zoom: 12,
  center: new google.maps.LatLng(54.59, -5.85),
  styles: mapStyles
};


var electoralAreas = {
    'Balmoral': ['BLACKSTAFF', 'FINAGHY', 'MALONE', 'MUSGRAVE', 'UPPER MALONE', 'WINDSOR'],
    'Castle': ['BELLEVUE', 'CASTLEVIEW', 'CAVEHILL', 'CHICHESTER PARK', 'DUNCAIRN', 'FORTWILLIAM'],
    'Court': ['CRUMLIN (BELFAST)', 'GLENCAIRN', 'HIGHFIELD','SHANKILL', 'WOODVALE'],
    'Laganbank': ['BALLYNAFEIGH', 'BOTANIC', 'ROSETTA', 'SHAFTESBURY', 'STRANMILLIS'],
    'Lower Falls': ['BEECHMOUNT', 'CLONARD', 'FALLS', 'UPPER SPRINGFIELD', 'WHITEROCK'],
    'Oldpark': ['ARDOYNE', 'BALLYSILLAN', 'CLIFTONVILLE', 'LEGONIEL', 'NEW LODGE', 'WATER WORKS'],
    'Pottinger': ['BALLYMACARRETT', 'BLOOMFIELD (BELFAST)', 'ORANGEFIELD', 'RAVENHILL', 'THE MOUNT', 'WOODSTOCK'],
    'Upper Falls': ['ANDERSONSTOWN', 'FALLS PARK', 'GLEN ROAD', 'GLENCOLIN', 'LADYBROOK'],
    'Victoria': ['BALLYHACKAMORE', 'BELMONT', 'CHERRYVALLEY', 'ISLAND', 'KNOCK', 'STORMONT', 'SYDENHAM']
}

var ea2color = {
  'Court': '#e41a1c',
  'Lower Falls': '#377eb8',
  'Laganbank': '#4daf4a',
  'Pottinger': '#984ea3',
  'Oldpark': '#ff7f00',
  'Castle': '#ffff33',
  'Upper Falls': '#a65628',
  'Balmoral': '#f781bf',
  'Victoria': '#999999'
}

var wards2ea = {'ANDERSONSTOWN': 'Upper Falls',
 'ARDOYNE': 'Oldpark',
 'BALLYHACKAMORE': 'Victoria',
 'BALLYMACARRETT': 'Pottinger',
 'BALLYNAFEIGH': 'Laganbank',
 'BALLYSILLAN': 'Oldpark',
 'BEECHMOUNT': 'Lower Falls',
 'BELLEVUE': 'Castle',
 'BELMONT': 'Victoria',
 'BLACKSTAFF': 'Balmoral',
 'BLOOMFIELD (BELFAST)': 'Pottinger',
 'BOTANIC': 'Laganbank',
 'CASTLEVIEW': 'Castle',
 'CAVEHILL': 'Castle',
 'CHERRYVALLEY': 'Victoria',
 'CHICHESTER PARK': 'Castle',
 'CLIFTONVILLE': 'Oldpark',
 'CLONARD': 'Lower Falls',
 'CRUMLIN (BELFAST)': 'Court',
 'DUNCAIRN': 'Castle',
 'FALLS': 'Lower Falls',
 'FALLS PARK': 'Upper Falls',
 'FINAGHY': 'Balmoral',
 'FORTWILLIAM': 'Castle',
 'GLEN ROAD': 'Upper Falls',
 'GLENCAIRN': 'Court',
 'GLENCOLIN': 'Upper Falls',
 'HIGHFIELD': 'Court',
 'ISLAND': 'Victoria',
 'KNOCK': 'Victoria',
 'LADYBROOK': 'Upper Falls',
 'LEGONIEL': 'Oldpark',
 'MALONE': 'Balmoral',
 'MUSGRAVE': 'Balmoral',
 'NEW LODGE': 'Oldpark',
 'ORANGEFIELD': 'Pottinger',
 'RAVENHILL': 'Pottinger',
 'ROSETTA': 'Laganbank',
 'SHAFTESBURY': 'Laganbank',
 'SHANKILL': 'Court',
 'STORMONT': 'Victoria',
 'STRANMILLIS': 'Laganbank',
 'SYDENHAM': 'Victoria',
 'THE MOUNT': 'Pottinger',
 'UPPER MALONE': 'Balmoral',
 'UPPER SPRINGFIELD': 'Lower Falls',
 'WATER WORKS': 'Oldpark',
 'WHITEROCK': 'Lower Falls',
 'WINDSOR': 'Balmoral',
 'WOODSTOCK': 'Pottinger',
 'WOODVALE': 'Court'};

var wards2colors = {'ANDERSONSTOWN': '#dff7c7',
 'ARDOYNE': '#b6dc74',
 'BALLYHACKAMORE': '#b6ea80',
 'BALLYHANWOOD': '#fa0c07',
 'BALLYMACARRETT': '#61eff1',
 'BALLYNAFEIGH': '#ab3db9',
 'BALLYSILLAN': '#520a25',
 'BEECHILL': '#a2260a',
 'BEECHMOUNT': '#e478df',
 'BELLEVUE': '#beb79a',
 'BELMONT': '#ed7521',
 'BLACKSTAFF': '#742a54',
 'BLOOMFIELD (BELFAST)': '#e4ccf8',
 'BOTANIC': '#7494ef',
 'CAIRNSHILL': '#cf56d0',
 'CARROWREAGH': '#15bc0f',
 'CARRYDUFF EAST': '#9ff788',
 'CARRYDUFF WEST': '#bfb27b',
 'CASTLEVIEW': '#21d31a',
 'CAVEHILL': '#d2c754',
 'CHERRYVALLEY': '#84ee25',
 'CHICHESTER PARK': '#3e5b51',
 'CLIFTONVILLE': '#d48305',
 'CLONARD': '#8ae213',
 'CREGAGH': '#b44b68',
 'CRUMLIN (BELFAST)': '#8e278d',
 'DOWNSHIRE': '#f64e2a',
 'DUNCAIRN': '#f273c3',
 'DUNDONALD': '#983b2b',
 'ENLER': '#6c856c',
 'FALLS': '#d03f3e',
 'FALLS PARK': '#02b3ba',
 'FINAGHY': '#47156d',
 'FORTWILLIAM': '#154c79',
 'GALWALLY': '#6d8513',
 'GILNAHIRK': '#857d4d',
 'GLEN ROAD': '#dda7cb',
 'GLENCAIRN': '#a74be8',
 'GLENCOLIN': '#3f2fa0',
 'GRAHAMS BRIDGE': '#cd6487',
 'HIGHFIELD': '#fd78bd',
 'HILLFOOT': '#c84bfe',
 'ISLAND': '#b600e6',
 'KNOCK': '#4f4881',
 'KNOCKBRACKEN': '#1d8706',
 'LADYBROOK': '#32981b',
 'LEGONIEL': '#023a37',
 'LISNASHARRAGH': '#d92e08',
 'LOWER BRANIEL': '#0b6071',
 'MALONE': '#1f8c20',
 'MINNOWBURN': '#7c6904',
 'MONEYREAGH': '#e65f62',
 'MUSGRAVE': '#0691ad',
 'NEW LODGE': '#d7a92f',
 'NEWTOWNBREDA': '#8a99ab',
 'ORANGEFIELD': '#653802',
 'RAVENHILL': '#fd4321',
 'ROSETTA': '#ba1b02',
 'SHAFTESBURY': '#fa6f28',
 'SHANKILL': '#8aa31f',
 'STORMONT': '#45bcd0',
 'STRANMILLIS': '#291625',
 'SYDENHAM': '#e6953f',
 'THE MOUNT': '#0d1794',
 'TULLYCARNET': '#c1b2cf',
 'UPPER BRANIEL': '#ef9a69',
 'UPPER MALONE': '#4c7bf9',
 'UPPER SPRINGFIELD': '#a4bef4',
 'WATER WORKS': '#cac997',
 'WHITEROCK': '#923bdc',
 'WINDSOR': '#610bf5',
 'WOODSTOCK': '#9193de',
 'WOODVALE': '#8a7fd1',
 'WYNCHURCH': '#a29f8b'};


var wards2OldWards = {'ANDERSONSTOWN': 'St Anne',
 'ARDOYNE': 'Clifton',
 'BALLYHACKAMORE': 'Victoria',
 'BALLYMACARRETT': 'Pottinger',
 'BALLYNAFEIGH': 'Ormeau',
 'BALLYSILLAN': 'Clifton',
 'BEECHMOUNT': 'St Anne',
 'BELLEVUE': 'Duncairn',
 'BELMONT': 'Victoria',
 'BLACKSTAFF': 'St George',
 'BLOOMFIELD (BELFAST)': 'Pottinger',
 'BOTANIC': 'Cromac',
 'CASTLEVIEW': 'Duncairn',
 'CAVEHILL': 'Clifton',
 'CHERRYVALLEY': 'Victoria',
 'CHICHESTER PARK': 'Clifton',
 'CLIFTONVILLE': 'Clifton',
 'CLONARD': 'St Anne',
 'CRUMLIN (BELFAST)': 'Court',
 'DUNCAIRN': 'Duncairn',
 'FALLS': 'Smithfield',
 'FALLS PARK': 'St Anne',
 'FINAGHY': 'St Anne',
 'FORTWILLIAM': 'Duncairn',
 'GLEN ROAD': 'Falls',
 'GLENCAIRN': 'Woodvale',
 'GLENCOLIN': 'Falls',
 'HIGHFIELD': 'Woodvale',
 'ISLAND': 'Victoria',
 'KNOCK': 'Victoria',
 'LADYBROOK': 'Falls',
 'LEGONIEL': 'Shankill',
 'MALONE': 'Windsor',
 'MUSGRAVE': 'St Anne',
 'NEW LODGE': 'Dock',
 'ORANGEFIELD': 'Pottinger',
 'RAVENHILL': 'Pottinger',
 'ROSETTA': 'Ormeau',
 'SHAFTESBURY': 'Smithfield',
 'SHANKILL': 'Court',
 'STORMONT': 'Victoria',
 'STRANMILLIS': 'Cromac',
 'SYDENHAM': 'Victoria',
 'THE MOUNT': 'Pottinger',
 'UPPER MALONE': 'Windsor',
 'UPPER SPRINGFIELD': 'Falls',
 'WATER WORKS': 'Clifton',
 'WHITEROCK': 'Falls',
 'WINDSOR': 'Windsor',
 'WOODSTOCK': 'Pottinger',
 'WOODVALE': 'Woodvale'};

 var oldWards2Colors = {
  'Clifton': '#de953c',
 'Court': '#48b3a3',
 'Cromac': '#cc552c',
 'Dock': '#5b7934',
 'Duncairn': '#b454c2',
 'Falls': '#d28ecd',
 'Ormeau': '#a77c42',
 'Pottinger': '#985184',
 'Shankill': '#d54787',
 'Smithfield': '#b3b144',
 'St Anne': '#6290cd',
 'St George': '#63b646',
 'Victoria': '#696acf',
 'Windsor': '#ca5c5d',
 'Woodvale': '#5eb778'};

function init() {
  var mapDiv = document.getElementById('map-div');
  map = new google.maps.Map(mapDiv, mapOptions);

  showWards();

   // Load GeoJSON.
   map.data.loadGeoJson('../data/belfast.geojson');

  // Color each letter gray. Change the color when the isColorful property
  // is set to true.

  map.data.addListener('click', function(event) {
    var ward =  event.feature.getProperty("WARD1992");
    console.log(ward + ' is in ' + wards2ea[ward]);
    console.log(ward + ' was in ' + wards2OldWards[ward]);

  });

  initAutocomplete();

  var Wards = function() {
    this.showWards1992 = true;
  }
  var wards = new Wards();
  gui = new dat.GUI();

  var controller = gui.add(wards, 'showWards1992');

  controller.onChange(function(value) {
    if (value) {
      map.data.setStyle({visible: true});
      showWards();
    } else {
      map.data.setStyle({visible: false});
    }
  });

}



function showWards() {
  var color = '#000000';

  map.data.setStyle(function(feature) {
    var ward = feature.f["WARD1992"];
    var ea = wards2ea[ward];
    color = ea2color[ea];
    color = wards2colors[ward];
    //if (feature.getProperty('isColorful')) {
    //  color = feature.getProperty('color');
    //}
    return /** @type {google.maps.Data.StyleOptions} */({
      clickable: true,
      fillColor: color,
      strokeColor: color,
      strokeWeight: 1
    });
  });

}

function showOldWards() {

  map.data.setStyle(function(feature) {
    var color = '#000000';
    var ward = feature.f["WARD1992"];
    var oldWard = wards2OldWards[ward];
    if (typeof oldWard != "undefined") {
      color = oldWards2Colors[oldWard];
    }
    //console.log(color);
    //if (feature.getProperty('isColorful')) {
    //  color = feature.getProperty('color');
    //}
    return /** @type {google.maps.Data.StyleOptions} */({
      clickable: true,
      fillColor: color,
      strokeColor: color,
      strokeWeight: 1
    });
  });

}

  function initAutocomplete() {

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

document.addEventListener('DOMContentLoaded', init, false);
