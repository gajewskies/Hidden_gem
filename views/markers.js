markers = [];

function viewMarkers() {
	for (x in markers) {
		console.log(markers[x].position);
		console.log(markers[x].title);
	}
}