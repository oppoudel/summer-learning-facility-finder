import mapboxgl from 'mapbox-gl';

export const flyToFacility = (currentFeature, map) => {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
};

export const createPopUp = (currentFeature, map) => {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
  let distance;
  if (currentFeature.properties.distance) {
    distance = `<h4>${currentFeature.properties.distance.toFixed(
      2
    )} miles away</h4>`;
  } else {
    distance = '';
  }
  new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
      `<h3>${currentFeature.properties.ProgramNam}</h3>
      <h4>${currentFeature.properties.Address}</h4>
      ${distance}
      `
    )
    .addTo(map);
};

export const addSources = (map, facilities, updatedFacilities) => {
  map.addSource('facilities', {
    type: 'geojson',
    data: updatedFacilities ? updatedFacilities : facilities
  });
  map.addLayer({
    id: 'facilities',
    type: 'symbol',
    source: 'facilities',
    layout: {
      'icon-image': 'star-15',
      'icon-allow-overlap': true
    },
    paint: {}
  });
  map.addSource('single-point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
  map.addSource('nearest-facility', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });
  map.addLayer({
    id: 'point',
    source: 'single-point',
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': '#000000'
    }
  });
};
