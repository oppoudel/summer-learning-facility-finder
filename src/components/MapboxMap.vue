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
<style scoped>
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
</style>
