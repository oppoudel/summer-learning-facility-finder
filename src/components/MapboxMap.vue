<template>
  <v-card id="map-view">
    <v-toolbar floating dense id="toolbar">
      <AddressSearch></AddressSearch>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import AddressSearch from './AddressSearch.vue';

export default {
  name: 'MapboxMap',
  components: {
    AddressSearch
  },
  mounted() {
    this.$store.dispatch('createMap');
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
@import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css');
#map-view {
  height: calc(100vh - 100px) !important;
  width: 100%;
  position: relative;
}
#toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
}
.mapboxgl-popup {
  padding-bottom: 10px;
}

.mapboxgl-popup-close-button {
  position: absolute;
  top: -5px;
  right: 5px;
  color: #fff;
}
.mapboxgl-popup-content {
  font: 400 15px/22px 'Roboto', 'Helvetica Neue', Sans-serif;
  padding: 0;
  width: 180px;
}
.mapboxgl-popup-content-wrapper {
  padding: 1%;
}
.mapboxgl-popup-content h3 {
  background: #004575;
  color: #fff;
  margin: 0;
  display: block;
  padding: 10px;
  border-radius: 3px 3px 0 0;
  font-weight: 700;
  margin-top: -15px;
}

.mapboxgl-popup-content h4 {
  margin: 0;
  display: block;
  padding: 10px 10px 10px 10px;
  font-weight: 400;
}

.mapboxgl-popup-content div {
  padding: 10px;
}

.mapboxgl-container .leaflet-marker-icon {
  cursor: pointer;
}

.mapboxgl-popup-anchor-top > .mapboxgl-popup-content {
  margin-top: 15px;
}

.mapboxgl-popup-anchor-top > .mapboxgl-popup-tip {
  border-bottom-color: #004575;
}
</style>
