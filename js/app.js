(function () {

  const map = L.map('map', {
    center: [12.1994847, -69.00883083333333],
    zoom: 11.5,
    zoomSnap: .2, // allow for smoother zooming
    minZoom: 11.5,
    maxZoom: 18,
    defaultExtentControl: true
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

    // return the legend
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

  sliderControl.addTo(map); // add sliderControl to the map


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
    const geoJsonParty = {}; // declare a empty object.

    // map the location as circleMarkers
    // loop through each polParties and assign geoJson data for each polparty in new object called geoJsonParty
    // On each Layer, call the retrieveInfo function to show the info window when user click on each layer
    // call the mapParties to draw all the parties
    for (party in polParties) {
      // console.log(party); // inspect the output
      let options = {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            // color: polParties[party],
            radius: 0,
            opacity:0,
            // weight:3,
            fillOpacity:0

          });
        }, // end of pointToLayer
        onEachFeature: function (feature, layer) {
          layer.on('click', function (e) {
              // console.log(layer.feature.geometry.coordinates); // inspect the output
              retrieveInfo(layer, $('#sliderVal').val());
              const coord = [layer.feature.geometry.coordinates[1], layer.feature.geometry.coordinates[0]];
              console.log(coord);
              map.flyTo(coord, 18);
            }),
            layer.on('mouseover', function (e) {
              // console.log(layer.feature.properties.Location); // inspect the output
              let votingLocation = `<label class="tooltip-label">Location nr: ${layer.feature.properties.sd_id}</label></br>
            <label class="tooltip-label">${layer.feature.properties.Location}</label>`;
              layer.bindTooltip(votingLocation).openTooltip();
              // retrieveInfo(layer, $('#sliderVal').val());

            })

        }
      }
      geoJsonParty[party] = L.geoJSON(data, options).addTo(map); // add all the parties on map
    } // end of for loop

    // console.log(geoJsonParty); // inspect the output
    mapTheParties(geoJsonParty, $('#sliderVal').val());
    // console.log(features);
    updateMap(data, $("#sliderVal").val());
    addPartyList(data, geoJsonParty, $("#sliderVal").val());
    locationList(data);
    sliderUI(data);
    $('#year-display span').html($('#sliderVal').val());
  } // end of drawMap function

  function mapTheParties(geoJsonObject, currentY) {
    // console.log(geoJsonObject, currentY);
    for (let partyLayer in geoJsonObject) {
      geoJsonObject[partyLayer].eachLayer(function (layer) {
        const props = layer.feature.properties;
        // console.log(Object.entries(props));// inspect the output
        for (key of Object.entries(props)) {
          // console.log(key);
          if (key[0] == `${partyLayer}_${currentY}`) {

            // console.log(props,key[0]);// inspect the output
            layer.setStyle({
              color: polParties[partyLayer],
              radius: calculateRadius(Number(props[key[0]])),
              fillOpacity: 0,
            });
          }
        }

      });

    }

  } // end of mapTheParties function

  function calculateRadius(val) {

    var radius = Math.sqrt(val / Math.PI); // calculate the radius
    return radius * 5; // adjust the radius with .5 scale factor
  } // end of calculateRadius()

  function addPartyList(data, geoJsonObject, currentY) {
    let parties = [];
    // console.log(data.features);
    data.features.forEach(feature => {
      // console.log(feature.properties);
      let name = Object.entries(feature.properties);
      // console.log(name);
      for (var i = 0; i < name.length; i++) {
        if (i > 3) {
          // console.log(name[i], feature);
          let pol_party = name[i][0];
          // console.log(pol_party);
          let split = pol_party.split('_');
          let splitPolParty = split[0];
          // let year = split[1];
          // console.log(splitPolParty);
          // console.log(pol_party,splitPolParty, year);
          if (pol_party.includes(splitPolParty + '_' + currentY)) {
            if (!parties.includes(splitPolParty)) {
              parties.push(splitPolParty);
            }

          }

        }
      }
    });
    const selectedPartiesList = {};
    for (let i = 0; i < parties.length; i++) {
      for (var x in polParties) {
        if (x == parties[i]) {
          // console.log(parties[i], x); // inspect output
          // check for matched names
          if (parties[i] == x) {
            selectedPartiesList[parties[i]] = polParties[x];
            // console.log(parties[i],polParties[x]);
            $(".list-parties").append(`<li id="${parties[i]}_${currentY}" style="background:${polParties[x]}">${parties[i]}</li>`); // create list
          }

        }

      } // end of for loop


    } // end of for loop


    for (let x in selectedPartiesList) {
      // console.log(x, selectedPartiesList[x]);
      $(`#${x}_${currentY}`).on('click', function (e) {
        // console.log(e.target.id,$(this));
        let color = $(this).css('background-color');
        if (color == 'rgb(30, 30, 30)') {

          console.log('active layer', color);
          $(`#${x}_${currentY}`).css('background-color',selectedPartiesList[x]);
          $(`#${x}_${currentY}`).css('color','black');

          addParties(`${x}`, geoJsonObject, currentY);

        } else {

          // console.log('disable others layer');
          removeParties(`${x}`, geoJsonObject, currentY);
        }

      });
    }

  } // end of addPartyList function

  function addParties(partyN, layerParty, currentYear) {
    for (let x in layerParty) {
      if (x == partyN) {
        // console.log(layerParty[x]);
        // console.log(x,partyN,layerParty[x],currentYear);
        layerParty[x].eachLayer(layer => {
          // console.log(layer);
          // $(`#${x}_${currentYear}`).css('background-color','rgb(30,30,30)');

          // console.log(layer.feature.properties);
          layer.setStyle({
            opacity: 1
          });
          layer.bringToFront();
        });
      }
    }

  } // end of removeParties function

  function removeParties(partyN, layerParty, currentYear) {
    for (let x in layerParty) {
      if (x != partyN) {
        console.log(x, partyN, currentYear);
        layerParty[x].eachLayer(layer => {
          $(`#${x}_${currentYear}`).css('background-color', 'rgb(30,30,30)');
          $(`#${x}_${currentYear}`).css('color', 'whitesmoke');
          // console.log(layer.feature.properties);
          layer.setStyle({
            opacity: 0
          });
        });
      }
    }

  } // end of removeParties function

  function updateMap(data, currentYear) {
    for (var key in data.features[0].properties) {

      if (key.includes("_" + currentYear) && key != "sd_id") {
        // console.log(key)
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
            layer.on("click", function () {
              retrieveInfo(layer, currentYear);
            })

          }
        }
        console.log(key);
        // retrieveInfo();
        let l = L.geoJSON(data, options).addTo(map);
      }
    }
    $('#year-display span').html(currentYear);
    // let l = L.geoJSON(data, options).addTo(map);
  } // end of updateMap function

  function sliderUI(data) {

    $('#slider input[type=range]').on('input', function () {
      // console.log(this.value); // inspect the output
      const currentYear = this.value; // declare and assign this.value to the currentGrade

      // resizeCircles(girlsLayer, boysLayer, currentYear); // pass the arguments variables to the caller resizeCircle function.
      updateMap(data, currentYear);
    })

  } // end of sliderUI function

  function locationList(data) {

    // console.log(data.features);
    const coordList = {} // declare a coordinate list object

    for (var x in data.features) {
      // console.log(data.features[x]);
      let props = data.features[x].properties; // declare and assign properties
      let coords = data.features[x].geometry.coordinates; // declare and assign coordinates

      $(".location-list").append(`<li class="location-item" id="loc_${props.sd_id}">${props.sd_id} ${props.Location}</li>`); // create list
      coordList[`loc_${props.sd_id}`] = {
        'coordinates': coords
      }; // store each location Id the coordinates of that location.
    }

    $(".location-item").on("click", function (e) {
      //  console.log(coordList); //inspect the output
      for (var loc in coordList) {
        if (loc == e.target.id) {
          // console.log(x,coordList[loc].coordinates);// inspect output
          const latlng = [coordList[loc].coordinates[1], coordList[loc].coordinates[0]];
          map.flyTo(latlng, 18, {
            duration: .5
          });
        }
      }

    });

  } // end of locationList function

  function retrieveInfo(data, currentY) {

    // console.log(data.feature.properties);

    let infoPopup = '';
    if ($('.list-names')) {
      $('.list-names').remove();
    }
    // infoPopup=$('#location-name').html(data.feature.properties.Location);
    infoPop = $('.party-name').html(`<h1>location nr: ${data.feature.properties.sd_id}</br>${data.feature.properties.Location}</h1>`);
    infoPopup = $('.party-name').append('<div class="party-name-grid"></div>');
    for (var i in data.feature.properties) {
      if (i.includes(currentY)) {
        let splitName = i.split('_');
        // console.log(i,data.feature.properties[i]);// inspect the output
        // ${splitName[0]} ${data.feature.properties[i]}
        infoPopup += $('.party-name-grid').append(`<div class='list-names' id='${i}'>${splitName[0]}: ${data.feature.properties[i]}</div>`);

        // infoPopup+=$(`#location`);

      }
    }

    $('.top-bar i').on('click', function (e) {
      // console.log($('.party-name').children().length); // inspect the output
      // check if party-name class has children. Ifo so, remove party-name class on close icon clicked
      if ($('.party-name').children().length > 0) {
        $('.party-name').children().remove(); // remove class
      }

    });

  } // end of retrieveInfo function

})();