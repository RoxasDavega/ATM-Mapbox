var dataMap = [];
var markers = [];
var dataBank = {};
var kategori = [];
var dataKategori;
var checkboxes = [];
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppenJvc3lpZCIsImEiOiJjbGE2cmJzdXAwNjg4M3ZzMHN4MTR5OGt4In0.oXST-z4oqfBHGDi3eXXPUg";

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    dataGeoJson();
    
    showCurrentLocation();
  }
};

function showCurrentLocation() {
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true,
  });
}

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([-7.79, 110.36]);
}

function setupMap(center) {
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: center,
    zoom: 15,
  });

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })
  );

  map.on("load", function () {
    map.addSource("dataBank", {
      type: "geojson",
      data: dataBank,
    });

    for (const x of dataBank.features) {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = x.properties["marker-color"];
      el.classList.add(x.properties.bank);
      new mapboxgl.Marker(el)
        .setLngLat(x.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) 
            .setHTML(
              `<h3>${x.properties.title}</h3><p>${x.properties.alamat}</p><p>[${x.geometry.coordinates}]</p>`
            )
        )
        .addTo(map);
    }
    map.addLayer({
      id: "dataBank",
      source: "dataBank",
      type: "circle",
      paint: {
        "circle-radius": 1,
      },
    });
  });


  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav);
  map.addControl(
    new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    }),
    "top-left"
  );

  return map;
}

async function dataGeoJson() {
  fetch("/geojson")
    .then((res) => res.json())
    .then((data) => {
      dataBank = data;
      return data;
    })
    .then(async (x) => {
      getKategori(x);
    });
}

async function getKategori(data) {
  for (const x of data.features) {
    const duplicate = kategori.includes(x.properties.bank);
    if (!duplicate) {
      kategori.push(x.properties.bank);
    }
  }
  makeCheckboxes();
}


async function makeCheckboxes () {
  var filters = document.getElementById("filters");
 
  for (var x = 0; x < kategori.length; x++) {
    var item = filters.appendChild(document.createElement("div"));
    var checkbox = item.appendChild(document.createElement("input"));
    var label = item.appendChild(document.createElement("label"));
    var dot = item.appendChild(document.createElement("span"));
    checkbox.type = "checkbox";
    checkbox.id = kategori[x];
    checkbox.checked = true;
    label.innerHTML = kategori[x];
    label.setAttribute("for", kategori[x]);
    dot.className("dot");
    dot.style.backgroundColor = 
    checkbox.addEventListener("change", updateKategori);
    checkboxes.push(checkbox);
  }
};

function updateKategori() {
  var enabled = [];
  var disabled = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      enabled.push(checkboxes[i].id);
      show(checkboxes[i].id)
    } else {
      disabled.push(checkboxes[i].id);
      hide(checkboxes[i].id)
    }
  }
}

function hide(x) {
  let markers = document.getElementsByClassName(x);
  for (let i = 0; i < markers.length; i++) {
    markers[i].style.visibility = "hidden";
  }
}

function show(x) {
  let markers = document.getElementsByClassName(x);
  for (let i = 0; i < markers.length; i++) {
    markers[i].style.visibility = "visible";
  }
}


