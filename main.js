/**
 * Created by james on 13/05/2017.
 */

var map = L.map('map').setView([54.003660, -2.547855], 6);
var generalelectiondata;
var crimedata;
var westminsterparties = ({
    "Con":{
        "colour":"#0087DC",
        "name" : "Conservative and Unionist Party",
        "wikidescription" : "A party loosely divided into three categories: The Thatcherites or Conservative Way Forward, who strongly support a free market and tend to be Eurosceptic; the economically moderate, often more pro-European but socially conservative One Nation Conservatives; and the socially conservative, deeply Eurosceptic Cornerstone Group."
    },
    "Lab":{
        "colour":"#DC241F",
        "name" : "Labour Party",
        "wikidescription" : "A big tent party historically allied with the trade union movement; based upon mixed market Third Way policies since the party was reinvented as New Labour in 1994. As a big tent party, it includes a range of views including New Labour, Socialists such as those belonging to the Socialist Campaign Group, and Social Democrats."
    },
    "SNP":{
        "colour":"#FFFF00",
        "name" : "Scottish National Party",
        "wikidescription" : "Scottish nationalist and social democratic party which supports membership of the European Union."
    },
    "LD":{
        "colour":"#FAA61A",
        "name" : "Liberal Democrats",
        "wikidescription" : "Socially liberal and progressive; supports democratisation of the political system. Strongly supports membership of the European Union."
    },
    "DUP":{
        "colour":"#D46A4C",
        "name" : "Democratic Unionist Party",
        "wikidescription" : "Unionist and national conservative party in Northern Ireland. Socially conservative with close links to Protestantism."
    },
    "UUP":{
        "colour":"#9999FF",
        "name" : "Ulster Unionist Party",
        "wikidescription" : "Unionist party in Northern Ireland, conservative but with liberal factions."
    },
    "SF":{
        "colour":"#008800",
        "name" : "Sinn Féin",
        "wikidescription" : "Irish republican party that supports the unification of the island of Ireland as a 32-county Irish republic."
    },
    "TUV":{
        "colour":"#0095B6",
        "name" : "Traditional Unionist Voice",
        "wikidescription" : "Strongly social and national conservative unionist party in Northern Ireland, opposed to the St Andrews Agreement."
    },
    "Green":{
        "colour":"#6AB023",
        "name" : "Green Party of England and Wales",
        "wikidescription" : "Green political party that favours eco-socialism, environmentalism, sustainability and non-violence."
    },
    "PC":{
        "colour":"#008142",
        "name" : "Plaid Cymru - Party of Wales",
        "wikidescription" : "Left-wing party in favour of Welsh independence."
    },
    "UKIP":{
        "colour":"#70147A",
        "name" : "UK Independence Party",
        "wikidescription" : "Eurosceptic and right-wing populist party. Favours national sovereignty, direct democracy, social conservatism and economic liberalism."
    },
    "Spk":{
        "colour":"white",
        "name" : "Speaker of the House of Commons",
        "wikidescription" : ""
    },
    "Ind":{
        "colour":"white",
        "name" : "Independent",
        "wikidescription" : ""
    }
}); //If updating this use https://gist.github.com/Jbithell/425b4515954b184cfe0a5a2f3183c7a6


//var searchLayer = L.layerGroup().addTo(map);
//map.addControl( new L.Control.Search({layer: searchLayer}) );
var loadingdialog = bootbox.dialog({
    message: '<p class="text-center"><br/><br/><i class="fa fa-spin fa-spinner fa-5x"></i><br/><br/><b>When loaded, this system allows you to select from data-sets to overlay them onto the map of the United Kingdom.</b><br/>Use the Settings icon in the top left to select what you see. </p>',
    closeButton: false
});


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
            westminsterparties[generalelectiondata[props.pcon16cd].first_party].name +
            ' <i>(' + generalelectiondata[props.pcon16cd].result + ')</i>' +
            '</td></tr>' +

            '<tr><td><b>2015 Result (2<sup>nd</sup> Party)</b></td><td>' +
            westminsterparties[generalelectiondata[props.pcon16cd].second_party].name +
            '</td></tr>' +

            '<tr><td><b>2015 Voters</b></td><td>' +
            generalelectiondata[props.pcon16cd].electorate +
            '</td></tr>' +

            '<tr><td><b>2016 EU Remain/Leave</b></td><td>' +
            eurefresults[props.pcon16cd].remain + '%/' + eurefresults[props.pcon16cd].leave + '%' +
            '</td></tr>' +

            '<tr><td><b>2010 Result</b></td><td>' +
            westminsterparties[twentytenresults[props.pcon16cd].result].name +
            '</td></tr>' +




            '</table>'

            : '<i>Hover over a constituency</i>');

};

info.addTo(map);


function getCrimeColor(d) {
    //For crime heatmap
    return d > 50000 ? '#800026' :
        d > 40000 ? '#BD0026' :
            d > 30000 ? '#e31a1c' :
                d > 20000 ? '#fcb15d' :
                    d > 10000 ? '#effd6c' :
                        d > 1000 ? '#27fe32' :
                                '';
}

function getColor(party) {
    if (typeof westminsterparties[party].colour !== 'undefined') {
        return westminsterparties[party].colour;
    } else {
        return null;
    }

}

function style(feature) {
    return null;
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.9,
        fillColor: getColor(generalelectiondata[feature.properties.pcon16cd].first_party)
    };
}
function crimeStyle(feature) {
    if (feature.properties.pcon16cd in crimedata) {
        return {
            fillOpacity: 0.6,
            fillColor: getCrimeColor(crimedata[feature.properties.pcon16cd].total)
        };
    } else {
        return null;
    }

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
        //click: zoomToFeature
    });
}

//$.ajax({url: "data/Westminster_Parliamentary_Constituencies_December_2016_Full_Extent_Boundaries_in_Great_Britain.geojson", success: function(result){
$.ajax({
    url: "data/hocl-ge2015-results-summary.php",
    type: 'json',
    success: function (result) {
        generalelectiondata = result;
        //NEXT AJAX REQUEST
        $.ajax({
            url: "data/Westminster_Parliamentary_Constituencies_December_2016_Generalised_Clipped_Boundaries_in_Great_Britain.php",
            type: 'json',
            success: function (result) {
                seatdata = result;
                geojson = L.geoJson(result, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);

                //NEXT AJAX REQUEST
                $.ajax({
                    url: "data/eu_ref_results.php",
                    type: 'json',
                    success: function (result) {
                        eurefresults = result;

                        //NEXT AJAX REQUEST
                        $.ajax({
                            url: "data/hocl-ge2010-results.php",
                            type: 'json',
                            success: function (result) {
                                twentytenresults = result;
                                //NEXT AJAX REQUEST
                                $.ajax({
                                    url: "data/crime.php",
                                    type: 'json',
                                    success: function (result) {
                                        crimedata = result;
                                        geojson = L.geoJson(seatdata, {
                                            style: crimeStyle
                                        }).addTo(map);
                                        loadingdialog.modal('hide');
                                    }
                                });
                                //END NEXT AJAX REQUEST
                            }
                        });
                        //END NEXT AJAX REQUEST



                    }
                });
                //END NEXT AJAX REQUEST

            }
        })
        //END NEXT AJAX REQUEST
    }

});

//Add settings icon to map
var settings = ""; //Init the var
L.easyButton( 'fa-cog', function(){
    settings = bootbox.dialog({
        title: 'Settings',
        message: '<input type="checkbox" name="2015result" value="2015 Results &amp; Constituency Data">' +
        '<input type="checkbox" name="eu-ref" value="2016 EU Referendum Results">'
    });
}).addTo(map);

//Add settings icon to map
var about = ""; //Init the var
L.easyButton( 'fa-info', function(){
    about = bootbox.dialog({
        title: 'About',
        message: '<p>Developed by James Bithell in the run up to the 2017 United Kingdom General Election</p>',
        footer: '<a href="https://github.com/Jbithell/Economics-6th-Form-End-of-Term-Project" class="btn">Source Code on Github</a>'
    });
}).addTo(map);



map.attributionControl.addAttribution('Constituency Boundaries data from <a href="http://geoportal.statistics.gov.uk/datasets/deeb99fdf09949bc8ed4dc95c80da279_2">ONS</a>');
map.attributionControl.addAttribution('2015 Election result data from <a href="http://www.data.parliament.uk/dataset/general-election-2015">UK Parliament</a>');
map.attributionControl.addAttribution('Website &copy; <a href="//jbithell.com">James Bithell</a>');


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

