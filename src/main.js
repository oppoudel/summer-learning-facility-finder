import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';
import 'vuetify/dist/vuetify.min.css';
import 'babel-polyfill';
import router from './router';
import { store } from './store';

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyDyJUwEpWPLTDZrX9TVeq5m8vGQScqyZCA',
  version: '1.1.0'
});

Vue.use(Vuetify, {
  theme: {
    primary: '#004575',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
