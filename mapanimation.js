mapboxgl.accessToken =
  "pk.eyJ1IjoibmFuZGhpbmlrYXJ2ZW5kaGFuIiwiYSI6ImNsNTUyeno2djE1YmszZHJ5MjVjM2V2eHkifQ.kN3FQeB_zLHx8IjC30eEIw";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-71.104081, 42.365554],
  zoom: 14,
});

var busMarkers = [];
async function run() {
  // get bus data
  const locations = await getBusLocations();
  console.log(new Date());
  console.log(locations);
  locations.forEach((bus, i) => {
    // Adding Marker
    var marker = new mapboxgl.Marker()
      .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
      .setPopup(
        new mapboxgl.Popup({
          offset: 25,
          closeOnClick: false,
          closeButton: false,
        }).setHTML(`<h3>Bus ID
		${bus.attributes.label}</h3>`)
      )
      .addTo(map)
      .togglePopup();
    busMarkers.push(marker);
  });

  function deleteMarkers() {
    if (busMarkers !== null) {
      for (var i = busMarkers.length - 1; i >= 0; i--) {
        busMarkers[i].remove();
      }
    }
  }

  setTimeout(deleteMarkers, 15000);

  // timer
  setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
  const url = "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

run();
