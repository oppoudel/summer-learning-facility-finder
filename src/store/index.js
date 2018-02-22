import Vue from 'vue';
import Vuex from 'vuex';
import Terraformer from 'terraformer';
Terraformer.ArcGIS = require('terraformer-arcgis-parser');
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    mapboxMap: null,
    facilities: {},
    updatedFacilities: null
  },
  getters: {
    getFacilities: state => state.facilities,
    getupdatedFacilities: state => state.updatedFacilities
  },
  mutations: {
    LOAD_FEATURES(state, collection) {
      state.facilities = collection;
    },
    LOAD_MAP(state, map) {
      state.mapboxMap = map;
      state.mapboxMap.on('load', () => {
        state.mapboxMap.addSource('facilities', {
          type: 'geojson',
          data: state.facilities
        });
        state.mapboxMap.addLayer({
          id: 'facilities',
          type: 'symbol',
          source: 'facilities',
          layout: {
            'icon-image': 'star-15',
            'icon-allow-overlap': true
          }
        });
      });
    },
    UPDATE_FEATURES(state, data) {
      const findIf = (haystack, arr) =>
        arr.every(v => haystack.indexOf(v) >= 0);
      state.updatedFacilities = {
        ...state.facilities,
        features: state.facilities.features
          .filter(feature => {
            const searched = feature.properties.DaysOpen.split(', ');
            return findIf(searched, data.DaysOpen);
          })
          .filter(feature => feature.properties.MealsServe === data.MealsServe)
      };
      console.log(state.updatedFacilities);
      state.mapboxMap.getSource('facilities').setData(state.updatedFacilities);
    },

    RESET(state) {
      state.updatedFacilities = null;
      state.mapboxMap.getSource('facilities').setData(state.facilities);
    },
    ADDRESS_CHANGED(state, location) {
      state.mapboxMap.flyTo({ center: location, zoom: 17 });
    }
  },
  actions: {
    async loadFeatures({ commit }) {
      const response = await fetch(
        'https://maps.baltimorecity.gov/egis/rest/services/SummerLearning/Summer/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=pjson'
      );
      const results = await response.json();

      let FeatureCollection = {
        type: 'FeatureCollection',
        features: []
      };

      results.features.map((point, i) => {
        const feature = Terraformer.ArcGIS.parse(point);
        feature.id = i;
        FeatureCollection.features.push(feature);
      });
      commit('LOAD_FEATURES', FeatureCollection);
    },
    createMap({ commit }) {
      const map = new mapboxgl.Map({
        container: 'map-view',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-76.6138, 39.3062],
        zoom: 12
      });
      map.addControl(new mapboxgl.NavigationControl());

      commit('LOAD_MAP', map);
    }
  }
});
