// var ExcelToJSON = function() {

//   this.parseExcel = function(file) {
//     var reader = new FileReader();
//     var file = '/data/atm.xlsx';
//     reader.onload = function(e) {
//       var data = e.target.result;
//       var workbook = XLSX.read(data, {
//         type: 'binary'
//       });

//       workbook.SheetNames.forEach(function(sheetName) {
//         // Here is your object
//         var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
//         var json_object = JSON.stringify(XL_row_object);
//         console.log(json_object);
//       })
//     };

//     reader.onerror = function(ex) {
//       console.log(ex);
//     };

//     reader.readAsBinaryString(file);
//     console.log(reader);
//   };
// };
// ExcelToJSON();

// var request = new XMLHttpRequest();
// // may be necessary to escape path string?
// request.open("GET", "/data/atm.xlsx");
// request.responseType = "arraybuffer";
// request.onload = function () {
//    // this.response should be `ArrayBuffer` of `.xlsx` file
//    var file = new File(this.response, "atm.xlsx");
//    // do stuff with `file`
// };
// request.send();\
// var excel_file = excel.Workbooks.Open("./data/atm.xlsx");

// function ImportFile() {
//     var excelUrl = "./test.xlsx";

//     var oReq = new XMLHttpRequest();
//     oReq.open('get', excelUrl, true);
//     oReq.responseType = 'blob';
//     oReq.onload = function () {
//         var blob = oReq.response;
//         excelIO.open(blob, LoadSpread, function (message) {
//             console.log(message);
//         });
//     };
//     oReq.send(null);
//   }
//   function LoadSpread(json) {
//     jsonData = json;
//     workbook.fromJSON(json);

//     workbook.setActiveSheet("Revenues (Sales)");
//   }
var dataMap = [];



mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppenJvc3lpZCIsImEiOiJjbGE2cmJzdXAwNjg4M3ZzMHN4MTR5OGt4In0.oXST-z4oqfBHGDi3eXXPUg";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  console.log(position);
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
  console.log(center);
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
//   var marker = new mapboxgl.Marker()
//     .setLngLat([110.36, -7.79])
//     //.setLngLat([-7.79, 110.36])
//     //.setLngLat([110, -7])
//     .setPopup(new mapboxgl.Popup({offset:30}).setHTML("<h1>Hello World!</h1>"))
    
//     .addTo(map);
//   console.log(marker);
fetch("/data").then((res) => res.json()).then((data) => {
    dataMap = data;
    dataMap.forEach((location) => {
        console.log(location)
    var marker = new mapboxgl.Marker()
    .setLngLat([location.Longitude, location.Latitude])
    .setPopup(new mapboxgl.Popup({ offset: 30})
    .setHTML('<h4>' + location.Nama +'</h4>' + location.Alamat ))
    .addTo(map);
    })
});

  map.on("load", () => {
    // Add a GeoJSON source with 3 points.
    map.addSource("points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [-7.79, 110.36],
            },
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [-90.3295, -0.6344],
            },
          },
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [-91.3403, 0.0164],
            },
          },
        ],
      },
    });
    // Add a circle layer
    map.addLayer({
      id: "circle",
      type: "circle",
      source: "points",
      paint: {
        "circle-color": "#4264fb",
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Center the map on the coordinates of any clicked circle from the 'circle' layer.
    map.on("click", "circle", (e) => {
      map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });

    // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
    map.on("mouseenter", "circle", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "circle", () => {
      map.getCanvas().style.cursor = "";
    });
  });
  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav);
}
