/**
 * Created by james on 13/05/2017.
 */

var map = L.map('map').setView([54.003660, -2.547855], 6);
var generalelectiondata = ""

//var searchLayer = L.layerGroup().addTo(map);
//map.addControl( new L.Control.Search({layer: searchLayer}) );

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamJpdGhlbGwiLCJhIjoiY2oybHFuams0MDAweTMzcW50dG4waWM2eSJ9.RIlIWoMrOa145kyaaMtt0w', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 12,
    minZoom: 6,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamJpdGhlbGwiLCJhIjoiY2oybHFuams0MDAweTMzcW50dG4waWM2eSJ9.RIlIWoMrOa145kyaaMtt0w'
}).addTo(map);

//Constituencies
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {

    this._div.innerHTML = (props ?
            '<table border="0">' +


            '<tr><td><b>Name</b></td><td>' +
            props.pcon16nm +
            '</td></tr>' +

            '<tr><td><b>County</b></td><td>' +
            generalelectiondata[props.pcon16cd].county_name +
                ' <i>(' +
            generalelectiondata[props.pcon16cd].country_name +
                ')</i>' +
            '</td></tr>' +

            '<tr><td><b>2015 Result</b></td><td>' +
            generalelectiondata[props.pcon16cd].result +
            '</td></tr>' +

            '<tr><td><b>2015 Result (2<sup>nd</sup> Party)</b></td><td>' +
            generalelectiondata[props.pcon16cd].second_party +
            '</td></tr>' +

            '<tr><td><b>2015 Voters</b></td><td>' +
            generalelectiondata[props.pcon16cd].lectorate +
            '</td></tr>' +
            e

            '</table>'

            : 'Hover over a constituency for more info');
};

info.addTo(map);

/*
function getColor(d) {
    //For heatmaps
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}
*/
function getColor(party) {
    return party == "Con" ? '#0087DC' :
            party == "Lab" ? '#DC241F' :
            party == "SNP" ? '#FFFF00' :
            party == "LD" ? '#FAA61A' :
            party == "DUP" ? '#D46A4C' :
            party == "UUP" ? '#9999FF' :
            party == "SF" ? '#008800' :
            party == "TUV" ? '#0095B6' :
            party == "Green"  ? '#6AB023' :
            party == "PC"  ? '#008142' :
            party == "UKIP"  ? '#70147A' :
            party == "Spk"  ? 'white' : //Speaker
            party == "Ind" ? 'white' : //Independent
                ''; //ERROR
}

function style(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(generalelectiondata[feature.properties.pcon16cd].first_party)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//$.ajax({url: "data/Westminster_Parliamentary_Constituencies_December_2016_Full_Extent_Boundaries_in_Great_Britain.geojson", success: function(result){
$.ajax({
    url: "data/hocl-ge2015-results-summary.php",
    type: 'json',
    success: function (result) {
        generalelectiondata = result;
        $.ajax({
            url: "data/Westminster_Parliamentary_Constituencies_December_2016_Generalised_Clipped_Boundaries_in_Great_Britain.php",
            type: 'json',
            success: function (result) {
                geojson = L.geoJson(result, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);

            }
        });
    }
    
});



map.attributionControl.addAttribution('Constituency Boundaries data from <a href="http://geoportal.statistics.gov.uk/datasets/deeb99fdf09949bc8ed4dc95c80da279_2">ONS</a>');
map.attributionControl.addAttribution('2015 Election result data from <a href="http://www.data.parliament.uk/dataset/general-election-2015">UK Parliament</a>');

var legend = L.control({position: 'bottomright'});

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

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);


map.attributionControl.addAttribution('Website &copy; <a href="//jbithell.com">James Bithell</a>');
