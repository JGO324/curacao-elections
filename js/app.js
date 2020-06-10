(function () {

  const map = L.map('map', {
    zoomSnap: .1,
    // center: [12.169570,-68.990021],
    center: [12.1994847, -69.00883083333333],
    // zoom: 10,
    zoomSnap: .2, // allow for smoother zooming
    minZoom: 9,
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
  // create Leaflet control for the legend
  const legendControl = L.control({
    position: 'bottomright'
  });

  // get coordinates on map click (temprary)
  // map.on('click',function(e){
  //   console.log(e.latlng);
  // });


  // when the control is added to the map
  // legendControl.onAdd = function (map) {

  //   // select the legend using id attribute of legend
  //   const legend = L.DomUtil.get("legend");

  //   // disable scroll and click functionality 
  //   L.DomEvent.disableScrollPropagation(legend);
  //   L.DomEvent.disableClickPropagation(legend);

  //   // return the selection
  //   return legend;

  // }

  // legendControl.addTo(map);

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
  // use omnivore to load the geojson data
  omnivore.geojson('data/voting-data.geojson')
    .on('ready', function (e) {
      // console.log(e.target)// inspect the output
      drawMap(e.target.toGeoJSON()); //pass the data as a geoJSON format to the caller drawMap
      // drawLegend(e.target.toGeoJSON())
    })
    .on('error', function (e) {
      // console.log(e.error[0].message);// inspect the output
    }); // add the point data to the map

  function drawMap(data) {
    var options = {
      pointToLayer: function (feature, latlng) {

        return L.circleMarker(latlng, {
          opacity: 1,
          weight: 2,
          fillOpacity: 0
        });


      },

    }

    // create 2 separate layers from the geojson
    let mfk = L.geoJSON(data, options).addTo(map);
    let mkp = L.geoJSON(data, options).addTo(map);

    mfk.setStyle({
      color: '#6e77b0'
    });

    mkp.setStyle({
      color: '#ff1a1a'
    });


    map.fitBounds(mfk.getBounds()); // get extent of the boys layer
    map.setZoom(map.getZoom() - .4); // adjust the zoom level
    resizeCircles(mfk, mkp, 2016); // Use 2016 temporary 

    sequenceUI(mfk,mkp);

  } // end of drawMap().

  function calculateRadius(val) {

    var radius = Math.sqrt(val / Math.PI); // calculate the radius
    return radius * 2.5; // adjust the radius with .5 scale factor
  } // end of calculateRadius()

  function resizeCircles(electionLmfk, electionLmkp, currentYear) {
    
    electionLmfk.eachLayer(function (layer) {
      // console.log(layer);
      var r = calculateRadius(layer.feature.properties['MFK' + currentYear]);
      layer.setRadius(r);
    });

    electionLmkp.eachLayer(function (layer) {
      // console.log(layer);
      var r = calculateRadius(layer.feature.properties['MKP' + currentYear]);
      layer.setRadius(r);
    });

    retrieveInfo(electionLmfk, electionLmkp, currentYear); // call the retrieveInfo function to show the popup info
    $('#year-display span').html(" " + currentYear);// show the current year
  } // end of resizeCircles()

  function sequenceUI(electionLmfk, electionLmkp) {

    $('#slider input[type=range]').on('input', function () {
      // console.log(this.value); // inspect the output
      var currentYear = this.value; // declare and assign this.value to the currentGrade
      // $('#year-display span').html(currentYear);

      resizeCircles(electionLmfk, electionLmkp, currentYear); // pass the arguments variables to the caller resizeCircle function.

    })
  } // end of sequenceUi()

  function drawLegend(data) {

  } // end of drawLegend()

  function retrieveInfo(electionLmfk, currentYear) {

    // select the element and reference with a variable
    // and hide the element from view initially
    var info = $('#info').hide();

    // console.log(layer, currentGrade);
    // on mouseover event, trigger layer selection and show the info window
    electionLmfk.on("mouseover", function (e) {
      info.show();
      // console.log(e.layer.feature.properties);
      // declare variable props and assign the layer properties object to it 
      var props = e.layer.feature.properties;
      console.log(props);
      // console.log(Object.entries(props));
      Object.entries(props).forEach(name => {
        if (name[0].includes("MFK")) {

          let n = name[0].replace(/[0-9]/g, ''); // remove years from the string
          console.log(props);
          console.log(n);
          $('#info h3').html(`${props.Location}</br>`);
          $('#info p.mfk span').html(`${n}: ${props.MFK2016}</br>`);
          // $('#info p.mkp span').html(`${n}: ${props.MKP2016}</br>`);

        }
        if (name[0].includes("MKP")) {

          let n = name[0].replace(/[0-9]/g, ''); // remove years from the string
          console.log(props);
          console.log(n);
          $('#info h3').html(`${props.Location}</br>`);
          // $('#info p.mfk span').html(`${n}: ${props.MFK2016}</br>`);
          $('#info p.mkp span').html(`${n}: ${props.MKP2016}</br>`);

        }
      });

      e.layer.setStyle({
        fillOpacity: .6
      });
    });

    // on mouseout hide the info window and reset the selection
    electionLmfk.on("mouseout", function (e) {
      info.hide();
      e.layer.setStyle({
        fillOpacity: 0
      });
    });


    // On window resize unset any position properties
    $(window).resize(function () {

      info.css({
        "left": "unset",
        "right": "unset",
        "top": "unset"
      }); 
    })

    // // when the mouse moves on the document
    $(document).mousemove(function (e) {

      //   // Check document size, if less than 800...
      if ($(document).width() < 800) {

        // ...position the info window in the upper-right corner.
        info.css({
          "right": 10,
          "top": 10,
        });

      } else {

        // console.log($(document).width() )
        // first offset from the mouse position of the info window
        info.css({
          "left": e.pageX + 6,
          "margin-top": e.pageY - info.height() - 25
        });

        // console.log(info.offset().top, $(document).height()); // inspect the output
        // if it crashes into the top, flip it lower right
        if (info.offset().top < 4) {
          info.css({
            "margin-top": e.pageY + 15
          });
        }
        // console.log(info.offset().left); // inspect the output
        // if it crashes into the right, flip it to the left
        if (info.offset().left + info.width() >= $(document).width() - 40) {
          info.css({
            "left": e.pageX - info.width() - 80
          });
        }
      }
    });

  }


  // $('#gb-icon').on('click', function () {
  //   let isOpen = $("#legend-container").css("display");
  //   if (isOpen == "none") {
  //     $("#legend-container").css("display", "block");

  //   } else if (isOpen == "block") {
  //     $("#legend-container").css("display", "none");
  //   }
  // });
})();