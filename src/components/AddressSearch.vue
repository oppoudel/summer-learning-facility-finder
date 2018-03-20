<template>
  <vuetify-google-autocomplete :id="id" :append-icon="appendIcon" :clearable="true" :classname="classname" :country="country" :disabled="false" :enable-geolocation="true" :label="labelText" :placeholder="placeholderText" :prepend-icon="prependIcon" :required="true" :types="types" v-on:placechanged="addressChanged">
  </vuetify-google-autocomplete>
</template>
<script>
export default {
  name: 'AddressSearch',
  data() {
    return {
      address: {},
      appendIcon: 'search',
      classname: '',
      clearable: 'true',
      country: [],
      disabled: false,
      enableGeolocation: true,
      id: 'map',
      labelText: 'Search Address',
      prependIcon: '',
      placeholderText: '',
      required: 'true',
      types: 'geocode'
    };
  },
  methods: {
    addressChanged(addressData) {
      this.$store.commit('ADDRESS_CHANGED', [
        addressData.longitude,
        addressData.latitude
      ]);
    }
  }
};
</script>

