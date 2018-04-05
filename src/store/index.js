import Vue from 'vue';
import Vuex from 'vuex';
import mapboxgl from 'mapbox-gl';
//import nearestPoint from '@turf/nearest-point';
import distance from '@turf/distance';
import appService from '../appService';
import { flyToFacility, createPopUp, addSources } from './mapUtils';

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

      const filters = {
        DaysOpen: f => {
          const s = f.properties.DaysOpen.split(', ');
          return findIf(s, data.DaysOpen);
        },
        MealsServe: f => f.properties.MealsServe === data.MealsServe,
        AgesServed: f => f.properties.AgesServed === data.AgesServed
      };

      const notNullData = Object.keys(data).filter(
        prop => data[prop].length > 0
      );

      let updatedFeatures = state.facilities.features;
      notNullData.map(item => {
        updatedFeatures = updatedFeatures.filter(filters[item]);
      });

      state.updatedFacilities = {
        ...state.facilities,
        features: updatedFeatures
      };

      if (state.mapboxMap) {
        state.mapboxMap
          .getSource('facilities')
          .setData(state.updatedFacilities);
      }
    },

    RESET(state) {
      state.updatedFacilities = null;
      state.mapboxMap && state.mapboxMap.getSource('facilities').setData(state.facilities);
    },
    ADDRESS_CHANGED(state, location) {
      if (state.mapboxMap) {
        state.mapboxMap.flyTo({ center: location, zoom: 13 });
        state.mapboxMap
          .getSource('single-point')
          .setData({ type: 'Point', coordinates: location });
      }
      let facilities = state.updatedFacilities
        ? state.updatedFacilities
        : state.facilities;
      //Find the closest facility from the Address and zoom to it on the map
      /*const nearestFacility = nearestPoint(
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
      }*/
      //Calculate the distance from the Address to each feature and add that as distance attribute
      const options = { units: 'miles' };
      facilities.features.forEach(feature => {
        Object.defineProperty(feature.properties, 'distance', {
          value: distance(
            { type: 'Point', coordinates: location },
            feature.geometry,
            options
          ),
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      facilities.features.sort(
        (a, b) => a.properties.distance - b.properties.distance
      );
      //createPopUp(nearestFacility, state.mapboxMap);
    }
  },
  actions: {
    async loadFeatures({ commit }) {
      const results = await appService.getFeatures();

      commit('LOAD_FEATURES', results);
    },
    createMap({ commit }) {
      const map = new mapboxgl.Map({
        container: 'map-view',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-76.5815, 39.2895],
        zoom: 11
      });
      map.addControl(new mapboxgl.NavigationControl());

      commit('LOAD_MAP', map);
    }
  }
});
