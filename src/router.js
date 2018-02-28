import Vue from 'vue';
import Router from 'vue-router';
import MapboxMap from './components/MapboxMap';
import Facilities from './components/Facilities';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: MapboxMap
    },
    {
      path: '/facilities',
      component: Facilities,
      name: 'facilities'
    }
  ]
});
