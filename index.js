// basemap
var basemapUrl = 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
    basemap = L.tileLayer(basemapUrl, { maxZoom: 20 });

//map init
var map = L.map('map', {
}).setView([22.90859471526458, 78.51158962682082], 5).addLayer(basemap);

// information box
var infoBox = L.control({ position: "topright" });
infoBox.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info");
    div.innerHTML += '<h><b id="infos" style="font-size: 20px;font-family: initial;padding-right: 10px;padding-left: 10px;padding-top: 5px;padding-bottom: 5px;background-color: #ffffff;">Click On The Map To Get Details</b ></h > <br />'
    return div;
}
infoBox.addTo(map);
// ------------------------ function ------------------------------
function rowCreator(index, key, value) {
    var row = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    td1.innerHTML = index
    td2.innerHTML = key
    td3.innerHTML = value
    row.appendChild(td1)
    row.appendChild(td2)
    row.appendChild(td3)
    return row
}
function showData(layer) {
    var id = 1
    var keys = Object.keys(layer.feature.properties)
    keys.forEach((key) => {
        if (key != "type") {
            document.querySelector('#data').appendChild(rowCreator(id++, key, layer.feature.properties[key]))
        }
    })
}

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties["Population Density"])
    };
}
function highlightFeature(event) {
    var layer = event.target;
    layer.setStyle({
        weight: 3,
        color: '#000000',
        dashArray: '',
        fillOpacity: 0.8
    });
    if (!L.Browser.ie) {
        layer.bringToFront();
    }
}
function resetHighlight(event) {
    var layer = event.target;
    geojson.resetStyle(layer);
}
function getDataAndZoom(event) {
    var layer = event.target
    document.querySelector('#data').innerHTML = null
    layer.setStyle({
        weight: 3,
        color: '#000000',
        dashArray: '',
        fillOpacity: 0.8
    });
    map.fitBounds(layer.getBounds());
    document.querySelector('[id="infos"]').innerText = layer.feature.properties.Name
    showData(layer)
}
function onEachFeature(feature, layer) {
    layer.on({
        click: getDataAndZoom,
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}
// ------------------------ function ------------------------------
// geojson data ploting
var geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
});
geojson.getAttribution = function () { return 'Census data &copy; <a href="https://censusindia.gov.in/">Census Of India</a>' };
geojson.addTo(map);
//Legend

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    var h6 = '<h6>Population<br>per sq. km.</h6>'
    labels.unshift(h6)
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);