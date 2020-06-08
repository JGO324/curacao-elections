(function () {

  const map = L.map('map', {
    zoomSnap: .1,
    // center: [12.169570,-68.990021],
    center: [12.1994847, -69.00883083333333],
    zoom: 11,
    zoomSnap: .2, // allow for smoother zooming
    minZoom: 11,
    maxZoom: 18,
    maxBounds: L.latLngBounds([12.352131688081778, -69.1857147216797], [12.042131688081778, -68.72467714965526])
  });

  var accessToken = 'pk.eyJ1IjoiamdvMzI0IiwiYSI6ImNrMDlqa2dxdDA4cDAzZm4xZTg0b3BlNzUifQ.CzI3VsMtEP1CeQkNBjL3_w'

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
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
      // console.log(e.target.toGeoJSON())// inspect the output and compare the result with the above output
      drawMap(e.target.toGeoJSON()); //pass the data as a geoJSON format to the caller drawMap
      drawLegend(e.target.toGeoJSON())
    })
    .on('error', function (e) {
      // console.log(e.error[0].message);// inspect the output
    }); // add the point data to the map

  const years = [2010, 2012, 2016, 2017];

  function drawMap(data) {
    var options = {
      pointToLayer: function (feature, latlng) {

        // console.log(Object.entries(feature.properties));// inspect the output
        // feature.properties
        // Object.entries(feature.properties).forEach(polName => {
        //   // console.log(polName);
        //   if(polName[0].includes(years[0]))
        //   {
        //     var patt = /2016/i;
        //     var result = polName[0].match(patt);
        //     years.push(result.sort())
        //     // console.log(result);
        //   }
        // });
        return L.circleMarker(latlng, {
          opacity: 1,
          weight: 2,
          fillOpacity: 0
        });


      }
    }



    // create 2 separate layers from the geojson
    // var girlsL = L.geoJSON(data, options).addTo(map),
    let mfk = L.geoJSON(data, options).addTo(map);

    // girlsL.setStyle({
    //   color: '#d96d02',
    // });
    mfk.setStyle({
      color: '#6e77b0'
    });
    // // console.log(boys);
    // // console.log(girls);

    map.fitBounds(mfk.getBounds()); // get extent of the boys layer
    map.setZoom(map.getZoom() - .4); // adjust the zoom level
    // resizeCircles(girlsL, boysL, 1);

    sequenceUI(mfk, null);
    console.log(years);

  } // end of drawMap().

  function calculateRadius(val) {

    var radius = Math.sqrt(val / Math.PI); // calculate the radius
    return radius * .5; // adjust the radius with .5 scale factor
  } // end of calculateRadius()

  function resizeCircles(girlsLayers, boysLayers, currentYear) {
    // girlsLayers.eachLayer(function (layer) {

    //   var r = calculateRadius(layer.feature.properties['G' + currentGrade]);
    //   layer.setRadius(r);
    // });

    boysLayers.eachLayer(function (layer) {

      // var r = calculateRadius(layer.feature.properties['B' + currentGrade]);
      // layer.setRadius(r);
    });
    // retrieveInfo(boysLayers, currentGrade); // call the retrieveInfo function to show the popup info
    // $('#grade-display span').html(currentGrade);
  } // end of resizeCircles()

  function sequenceUI(girlsLayer, boysLayer) {

    $('#slider input[type=range]').on('input', function () {
      console.log(this.value); // inspect the output
      var currentGrade = this.value; // declare and assign this.value to the currentGrade
          $('#year-display span').html(currentGrade);

      // resizeCircles(girlsLayer, null, currentYear); // pass the arguments variables to the caller resizeCircle function.

    })
  } // end of sequenceUi()

  function drawLegend(data) {




    // //console.log(data); // inspect the output

    // var dataValue = []; // create a empty array to hold the values

    // //loop though the data.features
    // for (var school of data.features) {
    //   // console.log(school.properties);
    //   // loop through all the grades.
    //   for (grade in school.properties) {
    //     // console.log(school.properties[grade]);// inspect the output

    //     var gradeValue = school.properties[grade]; // declare gradeValue and assign the grade to it
    //     // check if grade can be converted to a number
    //     if (+gradeValue) {
    //       //console.log(gradeValue);// inspect the output
    //       dataValue.push(+gradeValue); // push the grade values to the array

    //     } // end of if statement

    //   } // end of for loop

    // } // end of for loop

    // // sort the array
    // var sortedValues = dataValue.sort(function (a, b) {
    //   return b - a;
    // });


    // var maxValue = Math.round(sortedValues[0] / 1000) * 1000; // get the maximum value of the array list
    // // console.log(maxValue); //  inspect the output

    // // calculate the diameter for the circles
    // var largeDiameter = calculateRadius(maxValue) * 2;
    // var smallDiameter = largeDiameter / 2;

    // // console.log(largeDiameter, smallDiameter); // inpsect the output

    // // set the height of the circle containers
    // $(".legend-circles").css('height', largeDiameter.toFixed());

    // // set the circle width and the height for the large circle
    // $(".legend-large").css({
    //   'width': largeDiameter.toFixed(),
    //   'height': largeDiameter.toFixed(),
    // });
    // // set the circle width and the height for the small circle
    // // reposition the small circle
    // $(".legend-small").css({
    //   'width': smallDiameter.toFixed(),
    //   'height': smallDiameter.toFixed(),
    //   'top': largeDiameter - smallDiameter,
    //   'left': smallDiameter / 2
    // });

    // // label the max and the median values
    // $(".legend-large-label").html(maxValue.toLocaleString());
    // $(".legend-small-label").html((maxValue / 2).toLocaleString());

    // //adjust the position of the large circle labels bases on the circle size
    // $(".legend-large-label").css({
    //   'top': -11,
    //   'left': largeDiameter + 30
    // });

    // //adjust the position of the small circle labels bases on the circle size
    // $(".legend-small-label").css({
    //   'top': smallDiameter - 11,
    //   'left': largeDiameter + 30
    // });

    // // insert a couple of hr elements and use to connect value labels to top of each circle
    // $("<hr class='large'>").insertBefore(".legend-large-label")
    // $("<hr class='small'>").insertBefore(".legend-small-label").css("top", largeDiameter - smallDiameter - 8);

  } // end of drawLegend()

  function retrieveInfo(boysLayer, currentGrade) {

    //   // console.log(boysLayer); // inpsect the output
    //   // select the element and reference with a variable
    //   // and hide the element from view initially
    //   var info = $('#info').hide();

    //   // console.log(layer, currentGrade);
    //   // on mouseover event, trigger layer selection and show the info window
    //   boysLayer.on("mouseover", function (e) {
    //     info.show();
    //     // console.log(e.layer.feature.properties);
    //     // declare variable props and assign the layer properties object to it 
    //     var props = e.layer.feature.properties;
    //     // console.log(props.COUNTY, props["G" + currentGrade], props["B" + currentGrade]); // inpsect the output
    //     $('#info p:first-child span').html(props.COUNTY);
    //     $('.girls span:first-child').html(`(grade ${currentGrade})`);
    //     $('.girls span:last-child').html(Number(props["G" + currentGrade]).toLocaleString());

    //     $('.boys span:first-child').html(`(grade ${currentGrade})`);
    //     $('.boys span:last-child').html(Number(props["B" + currentGrade]).toLocaleString());

    //     /*************** Sparkline Chart *****************/
    //     // declare girlsValue and boysValues array
    //     var girlsValues = [],
    //       boysValues = [];

    //     // console.log(props); // inspect the output

    //     //  loop through the grades 1 to 8
    //     for (var i = 1; i <= 8; i++) {
    //       // console.log(props['G'+i]);// inspect the output
    //       girlsValues.push(props['G' + i]); // push the values into the array
    //       $('.girlspark').sparkline(girlsValues, {
    //         width: '180px',
    //         height: '30px',
    //         lineColor: '#d96d02',
    //         fillColor: '#d96d02',
    //         spotRadius: 0,
    //         linewidth: 2
    //       });

    //       // console.log([props['B' + i]]); // inspect the output
    //       boysValues.push(props['B' + i]); // push the values into the array
    //       $('.boyspark').sparkline(boysValues, {
    //         width: '180px',
    //         height: '30px',
    //         lineColor: '#6e77b0',
    //         fillColor: '#6e77b0',
    //         spotRadius: 0,
    //         linewidth: 2
    //       });
    //     }

    //     e.layer.setStyle({
    //       fillOpacity: .6
    //     });
    //   });

    //   // on mouseout hide the info window and reset the selection
    //   boysLayer.on("mouseout", function (e) {
    //     info.hide();
    //     e.layer.setStyle({
    //       fillOpacity: 0
    //     });
    //   });


    // // On window resize unset any position properties
    // $(window).resize(function () {

    //   info.css({
    //     "left": "unset",
    //     "right": "unset",
    //     "top": "unset"
    //   }); 
    // })

    // // when the mouse moves on the document
    // $(document).mousemove(function (e) {

    //   // Check document size, if less than 800...
    //   if ($(document).width() < 800) {

    //     // ...position the info window in the upper-right corner.
    //     info.css({
    //       "right": 10,
    //       "top": 10,
    //     });

    //   } else {

    //     console.log($(document).width() )
    //   // first offset from the mouse position of the info window
    //   info.css({
    //     "left": e.pageX + 6,
    //     "margin-top": e.pageY - info.height() - 25
    //   });

    //   // console.log(info.offset().top, $(document).height()); // inspect the output
    //   // if it crashes into the top, flip it lower right
    //   if (info.offset().top < 4) {
    //     info.css({
    //       "margin-top": e.pageY + 15
    //     });
    //   }
    //   // console.log(info.offset().left); // inspect the output
    //   // if it crashes into the right, flip it to the left
    //   if (info.offset().left + info.width() >= $(document).width() - 40) {
    //     info.css({
    //       "left": e.pageX - info.width() - 80
    //     });
    //   }
    // }
    // });

  }


  $('#gb-icon').on('click', function () {
    let isOpen = $("#legend-container").css("display");
    if (isOpen == "none") {
      $("#legend-container").css("display", "block");

    } else if (isOpen == "block") {
      $("#legend-container").css("display", "none");
    }
  });
})();