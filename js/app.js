(function () {

  const map = L.map('map', {
    center: [12.1994847, -69.00883083333333],
    zoom: 11.5,
    zoomSnap: .2, // allow for smoother zooming
    minZoom: 11.5,
    maxZoom: 18,
    // maxBounds: L.latLngBounds([12.352131688081778, -69.1857147216797], [12.042131688081778, -68.72467714965526])
  });

  var accessToken = 'pk.eyJ1IjoiamdvMzI0IiwiYSI6ImNrMDlqa2dxdDA4cDAzZm4xZTg0b3BlNzUifQ.CzI3VsMtEP1CeQkNBjL3_w'

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    // maxZoom: 18,
    id: 'mapbox.dark',
    accessToken: accessToken
  }).addTo(map);



  // use omnivore to load the CSV data
  omnivore.csv('data/voting_data.csv')
    // omnivore.geojson('data/voting-location_n.geojson')
    .on('ready', function (e) {
      // console.log(e.target)// inspect the output
      // console.log(e.target.toGeoJSON())// inspect the output and compare the result with the above output
      drawMap(e.target.toGeoJSON()); //pass the data as a geoJSON format to the caller drawMap
      // drawLegend(e.target.toGeoJSON())
    })
    .on('error', function (e) {
      // console.log(e.error[0].message);// inspect the output
    }); // add the point data to the map


  // create Leaflet control for the legend
  const legendControl = L.control({
    position: 'topright'
  });

  // when the control is added to the map
  legendControl.onAdd = function (map) {

    // select the legend using id attribute of legend
    const legend = L.DomUtil.get("legend");

    // disable scroll and click functionality 
    L.DomEvent.disableScrollPropagation(legend);
    L.DomEvent.disableClickPropagation(legend);

    // return the selection
    return legend;

  }
  legendControl.addTo(map); // add legend to the control



  // create Leaflet control for the slider
  const sliderControl = L.control({
    position: 'bottomleft'
  });

  sliderControl.onAdd = function (map) {

    const controls = L.DomUtil.get("slider-container");

    L.DomEvent.disableScrollPropagation(controls);
    L.DomEvent.disableClickPropagation(controls);

    return controls;

  }

  sliderControl.addTo(map);


  const years = [];
  const polParties = {
    "KDNT": "#C0C0C0",
    "UKH": "#CC99FF",
    "PIN": "#CCFFFF",
    "PAR": "#FFFF00",
    "MAN": "#3366FF",
    "PNP": "#339966",
    "FOL-PAN": "#FF9900",
    "MFK": "#FFFFFF",
    "MKP": "#808080",
    "PS": "#FFCC99",
    "KP": "#969696",
    "MP": "#FF00FF",
    "DP": "#E23F31",
    "PRO-K": "#855418",
    "PAIS": "#AADDE2",
    "PAS": "#F0C136"
  }


  function drawMap(data) {

    // console.log(data.features);
    // for (var key in data.features[0].properties) {

    //   if (key.includes("_" + $("#sliderVal").val()) && key != "sd_id") {
    //     // console.log(key)
    //     let politicaParty = key;
    //     var options = {
    //       pointToLayer: function (feature, latlng) {
    //       //  console.log(feature['properties'][politicaParty]);// inspect the output
    //         let partyColor = politicaParty.substr(0, politicaParty.indexOf('_'));
    //         // console.log(partyColor);
    //         return L.circleMarker(latlng, {
    //           color: polParties[partyColor],
    //           radius: calculateRadius(Number(feature['properties'][politicaParty])),
    //           opacity: 1,
    //           weight: 3,
    //           fillOpacity: 0
    //         });
    //       },
    //       onEachFeature:function(feature,layer)
    //       {
    //         layer.on("mouseover",function(){
    //           console.log(layer.feature);

    //         });
    //       }
    //     }

    //     let l = L.geoJSON(data, options).addTo(map);
    //   }
    // }
    // updateMap(data, $("#sliderVal").val());
    
    geoJsonPrecincts = {}
    for (party in polParties) {

      let options = {
        pointToLayer: function (feature, latlng) {
         
          return L.circleMarker(latlng, {
            color: polParties[party],
            radius: 2,
            opacity: 0,
            weight: 3,
            fillOpacity: 0
          });
        },
        onEachFeature: function (feature, layer) {
  
          layer.on("click", function () {
  
            retrieveInfo(layer, $("#sliderVal").val());
          });
        }
  
      }

      geoJsonPrecincts[party] = L.geoJSON(data, options).addTo(map);

    }
    mapParties (geoJsonPrecincts, $("#sliderVal").val(), '')
    addPartyList(data, geoJsonPrecincts, $("#sliderVal").val());
    locationList(data);
    sliderUI(data);
  } // end of drawMap function

  function mapParties (data, year, party) {

    for (party in data) {
      data[party].eachLayer(function(layer){
        for (let [key, value] of Object.entries(layer.feature.properties)) {
          if (key == `${party}_${year}`){
            console.log(key)
            layer.setStyle( {
              color: polParties[party],
              radius: calculateRadius(Number(layer.feature.properties[key])),
                opacity: 1,
                weight: 3,
                fillOpacity: 0
            })
          }
        }
      })
    }

}
       


function calculateRadius(val) {

    var radius = Math.sqrt(val / Math.PI); // calculate the radius
    return radius * 5; // adjust the radius with .5 scale factor
  } // end of calculateRadius()


  function resizeCircles() {


  } // end of resizeCircles()

  function addPartyList(data, geoJsonPrecincts, currentY) {
    let parties = [];
    // console.log(data.features);
    data.features.forEach(feature => {
      // console.log(feature.properties);
      let name = Object.entries(feature.properties);
      // console.log(name);
      for (var i = 0; i < name.length; i++) {
        if (i > 5) {

          // console.log(name[i], feature);
          let pol_party = name[i][0];
          // console.log(pol_party);
          let split = pol_party.split('_');
          let splitPolParty = split[0];
          // let year = split[1];
          // console.log(splitPolParty);
          // console.log(pol_party,splitPolParty, year);
          if (pol_party.includes(splitPolParty+'_'+currentY)) {
            if (!parties.includes(splitPolParty)) {
              parties.push(splitPolParty);
            }

          }

        }
      }
    });
    // console.log(parties);


    // console.log(polParties[x], x);
    const smallListParties = {}
    for (let i = 0; i < parties.length; i++) {
        // console.log(parties[i], i);
      // $(".list-parties").append(`<li>${parties[i]}</li>`); 
      
      for (var x in polParties) {
        if (x == parties[i]) {
          console.log(parties[i], x);
          // check for matched names
          if (parties[i] == x) {
            smallListParties[parties[i]] = polParties[x]
            $(".list-parties").append(`<li id="${parties[i]}" style="background:${polParties[x]}">${parties[i]}</li>`); // create list
          }
        }
      }
    }

    for (let x in smallListParties) {
      // console.log(x, smallListParties[x])
      $(`#${x}`).on('click', function(e) {
        let color = $(`#${x}`).css("background-color");
        console.log(smallListParties[x])

        if (color == 'rgb(128, 128, 128)') {
          console.log(x)
          // e.target.style.backgroundColor = smallListParties[x]
          $(`#${x}`).css("background-color", smallListParties[x]);
          addParties(x, geoJsonPrecincts)
        } else {
          e.target.style.backgroundColor = 'gray'
          removeParties(x, geoJsonPrecincts)
        }
        // mapParties(e, data, currentY, x, smallListParties)

      })
    }

  } // end of addPartyList function

  function removeParties (party, geoJsonPrecincts) {
    for (precinct in geoJsonPrecincts) {
      console.log(party, precinct)
      if (party == precinct) {
        geoJsonPrecincts[party].eachLayer(function(layer){
              layer.setStyle( {
                  opacity: 0
              })
            
          })
      }
    }
  }

  function addParties (party, geoJsonPrecincts) {
    for (precinct in geoJsonPrecincts) {
      console.log(party, precinct)
      if (party == precinct) {
        geoJsonPrecincts[party].eachLayer(function(layer){
              layer.setStyle( {
                  opacity: 1
              })
            
          })
      }
    }
  }

  function updateMap(data, currentYear) {
    for (var key in data.features[0].properties) {

      if (key.includes("_" + currentYear) && key != "sd_id") {
        console.log(key)
        let politicaParty = key;
        var options = {
          pointToLayer: function (feature, latlng) {
            //  console.log(feature['properties'][politicaParty]);// inspect the output
            let partyColor = politicaParty.substr(0, politicaParty.indexOf('_'));
            // console.log(partyColor);
            return L.circleMarker(latlng, {
              color: polParties[partyColor],
              radius: calculateRadius(Number(feature['properties'][politicaParty])),
              opacity: 1,
              weight: 3,
              fillOpacity: 0
            });
          },
          onEachFeature: function (feature, layer) {
            // layer.on("mouseover", function () {
            //   console.log(layer.feature);

            // }),
            layer.on("click", function () {

              retrieveInfo(layer, currentYear);
            });
          }
        }

        let l = L.geoJSON(data, options).addTo(map);
      }
    }

    // let l = L.geoJSON(data, options).addTo(map);
  } // end of updateMap function


  function sliderUI(data) {

    $('#slider input[type=range]').on('input', function () {
      // console.log(this.value); // inspect the output
      var currentYear = this.value; // declare and assign this.value to the currentGrade
      // resizeCircles(girlsLayer, boysLayer, currentYear); // pass the arguments variables to the caller resizeCircle function.
      updateMap(data, currentYear);
    })

  } // end of sliderUI function
  
  function locationList(data) {
    // console.log(data.features);
    let flyToPrecinct = {}
    for (var x in data.features) {
      // console.log(data.features[x]);
      let props = data.features[x].properties;
      let coords = data.features[x].geometry.coordinates
      flyToPrecinct[`loc_${props.sd_id}`] = [coords[1], coords[0]]

      $(".location-list").append(`<li class="location_item" title="${coords[1]} ${coords[0]}"
                id="loc_${props.sd_id}">${props.sd_id} ${props.Location}</li>`); // create list

    }
    $(".location_item").on("mouseover", function (e) {

      $("#" + e.target.id).css("background-color", "green");
      $("#" + e.target.id).css("cursor", "pointer");
      //  let splitItemId=e.target.id.split("_");

    });

    $(".location_item").on("mouseout", function (e) {

      // console.log($("#"+e.target.id).html());
      $("#" + e.target.id).css("background-color", "#1E1E1E");

    });

    for (xy in flyToPrecinct ) { 
      $(`#${xy}`).on("click", function (e) {
        const latlng = e.target.title.split(" ")
        const flyTo = [Number(latlng[0]), Number(latlng[1])]
        console.log(latlng, flyTo, flyToPrecinct[xy])
  
       map.flyTo(flyTo, 18)
  
     });
  
  
    }
  } // end of locationList function


  function retrieveInfo(data, currentY) {

    console.log(data.feature.properties, currentY);
    inf = `<div class='infoL'><h6>${data.feature.properties.Location}</h6><p></p></div>`;
    // for (var i in data.feature.properties) {
    //   if (i.includes(currentY)) {
    //     console.log(i,data.feature.properties[i]);
    //     $(".infoL p").append("test");
    //   }
    // }


    data.bindPopup(inf).openPopup();
    // let inf=`<div>
    // ${data.feature.properties.Location}

    // ${data.feature.properties["MFK_"+$("#sliderVal").val()]}


    // </div>`;


  }

})();