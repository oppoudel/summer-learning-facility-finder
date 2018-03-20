<template>
  <v-select autocomplete label="Search Address" :loading="loading" :items="items.map(item => item.address)" hide-details single-line :search-input.sync="search" prepend-icon="search" v-model="select" @change="addressChanged" class="primary--text"></v-select>
</template>
<script>
const locatorURL =
  'https://gis.baltimorecity.gov/egis/rest/services/locator/EGISCompositeLocator/GeocodeServer/findAddressCandidates?maxLocations=5&outSR=4326&f=pjson&SingleLine=';
export default {
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: []
    };
  },
  watch: {
    search(val) {
      val && val.length > 3 && this.querySelections(val);
    }
  },
  methods: {
    async querySelections(v) {
      this.loading = true;
      const res = await fetch(locatorURL + v);
      const data = await res.json();
      const locations = data.candidates;
      this.items = locations;
      this.loading = false;
    },
    addressChanged(e) {
      const point = this.items.filter(item => item.address.includes(e));
      if (point.length > 0) {
        this.$store.commit('ADDRESS_CHANGED', [
          point[0].location.x,
          point[0].location.y
        ]);
      }
    }
  }
};
</script>

