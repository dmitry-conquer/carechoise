/* global google, ajax_object  */
const usStatesName = [
  'Georgia',
  'Maryland',
  'Massachusetts',
  'New-Jersey',
  'New-York',
  'Pennsylvania',
];

$(document).on('ready', function () {
  // This function will render each map when the document is ready (page has loaded)
  $('.acf-map').each(function () {
    render_map($(this));
  });
});

function getMarkerIcon(width) {
  let icon;

  if (width < 700) {
    icon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      fillColor: '#ffffff',
      fillOpacity: 1,
      strokeWeight: 0.4,
    };
  } else if (width < 1440) {
    icon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 4,
      fillColor: '#ffffff',
      fillOpacity: 1,
      strokeWeight: 0.4,
    };
  } else {
    icon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      fillColor: '#ffffff',
      fillOpacity: 1,
      strokeWeight: 0.4,
    };
  }
  return icon;
}

/*
 *  This function will render a Google Map onto the selected jQuery element
 */

function render_map($el) {
  let $markers = $('.markers-list').find('.location');
  // let styles = Here should be styles for Google Maps from https://snazzymaps.com/explore ; // Uncomment for map styling
  let styles = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'landscape',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'administrative',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ];

  // vars
  function getZoom() {
    let mapZoom;
    const foo = window.innerWidth;
    if (foo < 320) {
      mapZoom = 2;
    } else if (foo >= 320 && foo < 700) {
      mapZoom = 3;
    } else if (foo >= 700 && foo < 1440) {
      mapZoom = 4;
    } else if (foo >= 1440) {
      mapZoom = 5;
    } else {
      mapZoom = 4;
    }
    return mapZoom;
  }

  const mapZoom = getZoom();
  const center = new google.maps.LatLng(37.8283, -95.5795);

  let args = {
    zoom: mapZoom, // Zoom level adjusted to fit all states0
    center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    gestureHandling: 'none',
    keyboardShortcuts: false,
    scaleControl: false,
    backgroundColor: 'transparent',
    scrollwheel: false,
    styles: styles, // Uncomment for map styling
  };

  // create map
  let map = new google.maps.Map($el[0], args);
  map.data.loadGeoJson(
    ajax_object.theme_url + '/assets/scripts/plugins/us_state_20m.json',
    null
    // function () {
    //   // This callback runs after the GeoJSON is loaded
    //   map.data.forEach(function (feature) {
    //     let usStates = ['GA', 'MA', 'MD', 'NJ', 'NY', 'PA'];
    //     if (usStates.includes(feature.getProperty('STUSPS'))) {
    //     }
    //   });
    // }
  );
  map.data.setStyle(function (feature) {
    var color = '#1153a0';
    if (
      feature.getProperty('STUSPS') === 'GA' ||
      feature.getProperty('STUSPS') === 'MA' ||
      feature.getProperty('STUSPS') === 'MD' ||
      feature.getProperty('STUSPS') === 'NJ' ||
      feature.getProperty('STUSPS') === 'NY' ||
      feature.getProperty('STUSPS') === 'PA'
    ) {
      color = '#2c7ad7';
    }
    return /** @type {google.maps.Data.StyleOptions} */ ({
      fillColor: color,
      strokeWeight: 1,
      strokeColor: '#fff',
      fillOpacity: 1,
    });
  });
  let usStates = ['GA', 'MA', 'MD', 'NJ', 'NY', 'PA'];

  let currentIcon = 'big';
  $(window).on('resize', function () {
    const width = window.innerWidth;
    const mapZoom = getZoom();

    map.setZoom(mapZoom);
    map.setCenter(center);

    if (width < 700) {
      if (currentIcon === 'xsmall') return;
      map.markers.forEach((marker) => marker.setIcon(getMarkerIcon(width)));
      currentIcon = 'xsmall';
    } else if (width < 1440) {
      if (currentIcon === 'small') return;
      map.markers.forEach((marker) => marker.setIcon(getMarkerIcon(width)));
      currentIcon = 'small';
    } else {
      if (currentIcon === 'big') return;
      map.markers.forEach((marker) => marker.setIcon(getMarkerIcon(width)));
      currentIcon = 'big';
    }
  });

  map.data.addListener('mouseover', function (event) {
    if (usStates.includes(event.feature.getProperty('STUSPS'))) {
      map.data.overrideStyle(event.feature, {
        fillColor: '#0066FF',
        fillOpacity: 0.35,
      });
    } else {
      // map.data.overrideStyle(event.feature, {
      //   fillColor: '#0066FF',
      //   fillOpacity: 0.3,
      // });
    }
  });
  map.data.addListener('mouseout', function (event) {
    if (usStates.includes(event.feature.getProperty('STUSPS'))) {
      map.data.overrideStyle(event.feature, {
        fillColor: '#2c7ad7',
        fillOpacity: 1,
      });
    } else {
      // map.data.overrideStyle(event.feature, {
      //   fillColor: '#1153a0',
      //   fillOpacity: 1,
      // });
    }
  });

  if ($('main').attr('id') === 'agencies-main') {
    map.data.addListener('click', function (event) {
      if (usStatesName.includes(event.feature.getProperty('NAME'))) {
        let currentState = event.feature.getProperty('NAME').toLowerCase();
        let companyLocation = $('#company_location');
        // Loop through options to find a match with the clicked state
        companyLocation.find('option').each(function () {
          if ($(this).attr('title') === currentState) {
            // Set the found option as selected
            $(this).prop('selected', true);
          }
        });
        // Trigger the change event on #company_location
        companyLocation.change();
        // Scroll to the filter wrapper after the filter action is performed
        $('html, body').animate(
          {
            scrollTop: $('.filter-wrapper').offset().top,
          },
          500
        ); // Adjust the duration as needed
      }
    });
  }

  // var infowindow = new google.maps.InfoWindow();

  // map.data.addListener('click', function (event) {
  //   let state = event.feature.getProperty('NAME');
  //   let html = 'State: ' + state; // combine state name with a label
  //   infowindow.setContent(html); // show the html variable in the infowindow
  //   infowindow.setPosition(event.latLng); // anchor the infowindow at the marker
  //   infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) }); // move the infowindow up slightly to the top of the marker icon
  //   infowindow.open(map);
  // });

  // add a markers reference
  map.markers = [];

  // add markers
  $markers.each(function () {
    add_marker($(this), map);
  });

  // center map
  // center_map(map);
}

/*
 *  This function will add a marker to the selected Google Map
 */

// let infowindow;

function add_marker($marker, map) {
  // var
  let latlng = new google.maps.LatLng(
    $marker.attr('data-lat'),
    $marker.attr('data-lng')
  );

  const state = $marker.attr('data-state');
  const isClickable = $marker.attr('data-clickable');

  // create marker
  let marker = new google.maps.Marker({
    position: latlng,
    map: map,
    icon: getMarkerIcon(window.innerWidth),
    clickable: isClickable === 'true',
    USState: state ? state : '',
  });

  // add to array
  map.markers.push(marker);

  google.maps.event.addListener(marker, 'click', function () {
    const companyLocation = $('#company_location');
    if (!companyLocation.length) return;
    // Loop through options to find a match with the clicked state
    companyLocation.find('option').each(function () {
      if ($(this).attr('title') === marker.USState) {
        $(this).prop('selected', true);
      }
    });
    // Trigger the change event on #company_location
    companyLocation.trigger('change');

    $('html, body').animate(
      {
        scrollTop: $('.filter-wrapper').offset().top,
      },
      500
    );
  });

  // if marker contains HTML, add it to an infoWindow
  // if ($.trim($marker.html())) {
  //   // create info window
  //   infowindow = new google.maps.InfoWindow();
  //
  //   // show info window when marker is clicked
  //   google.maps.event.addListener(marker, 'click', function () {
  //     // Close previously opened infowindow, fill with new content and open it
  //     infowindow.close();
  //     infowindow.setContent($marker.html());
  //     infowindow.open(map, marker);
  //   });
  // }
}

/*
 *  This function will center the map, showing all markers attached to this map
 */

// function center_map(map) {
//   // vars
//   let bounds = new google.maps.LatLngBounds();
//   // bounds.extend(new google.maps.LatLng(24.891752, -98.4375));
//   // bounds.extend(new google.maps.LatLng(40.351289, -124.244385));
//   // bounds.extend(new google.maps.LatLng(44.488196, -70.290656));
//   // bounds.extend(new google.maps.LatLng(49.000282, -101.37085));
//   // loop through all markers and create bounds
//   $.each(map.markers, function (i, marker) {
//     let latlng = new google.maps.LatLng(
//       marker.position.lat(),
//       marker.position.lng()
//     );
//     bounds.extend(latlng);
//   });
//
//   // only 1 marker?
//   if (map.markers.length == 1) {
//     // set center of map
//     map.setCenter(bounds.getCenter());
//   } else {
//     // fit to bounds
//     map.fitBounds(bounds);
//   }
// }
