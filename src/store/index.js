import Vue from 'vue';
import Vuex from 'vuex';
import Terraformer from 'terraformer';
Terraformer.ArcGIS = require('terraformer-arcgis-parser');
import mapboxgl from 'mapbox-gl';
import { flyToFacility, createPopUp, addSources } from './mapUtils';
import nearestPoint from '@turf/nearest-point';

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
    getupdatedFacilities: state =>
      state.updatedFacilities
        ? state.updatedFacilities.features
        : state.facilities.features
  },
  mutations: {
    LOAD_FEATURES(state, collection) {
      state.facilities = collection;
    },

    LOAD_MAP(state, map) {
      state.mapboxMap = map;
      state.mapboxMap.on('load', () => {
        addSources(map, state.facilities, state.updatedFacilities);
        state.mapboxMap.on('click', 'facilities', e => {
          createPopUp(e.features[0], map);
          flyToFacility(e.features[0], map);
        });
        state.mapboxMap.on('mouseenter', 'facilities', () => {
          state.mapboxMap.getCanvas().style.cursor = 'pointer';
        });
        state.mapboxMap.on('mouseleave', 'facilities', () => {
          state.mapboxMap.getCanvas().style.cursor = '';
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
      state.mapboxMap.flyTo({ center: location, zoom: 14 });
      state.mapboxMap
        .getSource('single-point')
        .setData({ type: 'Point', coordinates: location });
      let facilities = state.updatedFacilities
        ? state.updatedFacilities
        : state.facilities;
      const nearestFacility = nearestPoint(
        { type: 'Point', coordinates: location },
        facilities
      );
      if (nearestFacility !== null) {
        state.mapboxMap.getSource('nearest-facility').setData({
          type: 'FeatureCollection',
          features: [nearestFacility]
        });
        state.mapboxMap.addLayer(
          {
            id: 'nearest-facility',
            type: 'circle',
            source: 'nearest-facility',
            paint: {
              'circle-radius': 12,
              'circle-color': '#004575'
            }
          },
          'facilities'
        );
        const lats = [nearestFacility.geometry.coordinates[1], location[1]];
        const lons = [nearestFacility.geometry.coordinates[0], location[0]];
        var sortedLons = lons.sort((a, b) => a > b);
        var sortedLats = lats.sort((a, b) => a > b);

        state.mapboxMap.fitBounds(
          [[sortedLons[0], sortedLats[0]], [sortedLons[1], sortedLats[1]]],
          {
            padding: 200
          }
        );
        createPopUp(nearestFacility, state.mapboxMap);
      }
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
