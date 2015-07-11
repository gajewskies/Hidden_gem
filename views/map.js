var map;
var initialLocation;

function initialize() {
var browserSupportFlag =  new Boolean();
var home = new google.maps.LatLng(42.479965, -79.342213);

var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(40.714985, -99.102617),
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    }
  }
map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
    	alert("Geolocation service failed.");
    } else {
    	alert("Your browser doesn't support geolocation");
    }
  }
}

// Try W3C Geolocation (Preferred)
if(navigator.geolocation) {
	browserSupportFlag = true;
	navigator.geolocation.getCurrentPosition(function(position) {
  		initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  		//map.setCenter(initialLocation);
  		console.log(initialLocation);
	}, function() {
  		handleNoGeolocation(browserSupportFlag);
	});
	} else { // Browser doesn't support Geolocation
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}


function addGemLoc() { //function that will add markers on button click
	map.setCenter(initialLocation);
	var name = GemName();
    var description = GemDescription();
    var image = "<img id='teet' src='/homepic.png' width='125px' height='125px'>"
    var content = "" + name + "<br>" + description + "<br>" + image;

	var infowindow = new google.maps.InfoWindow({
		content:  content,
	});

    var marker = new google.maps.Marker({
        position:initialLocation,
        map: map,
            draggable:true,
            animation: google.maps.Animation.DROP,
	        title: name,
        icon: "http://maps.google.com/mapfiles/ms/micons/blue.png"
    });
    google.maps.event.addListener(marker, 'click', function(){
		infowindow.open(map, marker);
	});
    markers.push(marker);
    viewMarkers();
}

function sendArray() {
	var markersQ = markers;
}

function setAllMap(map) {
	for (var i = 0; i < markers.length; i++) {
    	markers[i].setMap(map);
  	}
}

function removeGemLoc() {
	setAllMap(null);
	markers = [];
}


google.maps.event.addDomListener(window, 'load', initialize);