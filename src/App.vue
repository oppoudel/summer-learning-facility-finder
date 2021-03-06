<template>
  <v-app>
    <v-navigation-drawer persistent :clipped="clipped" v-model="drawer" enable-resize-watcher app width="320">
      <v-list>
        <v-list-tile class="mt-3">
          <AddressSearch></AddressSearch>
        </v-list-tile>
      </v-list>
      <v-toolbar flat dense color="primary--text">
        <v-toolbar-title class="subheading">Select Summer Programs by Criteria:</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile class="mt-2">
          <v-select label="Meals Served" :items="boolean" v-model="mealsServed" chips></v-select>
        </v-list-tile>
        <v-list-tile class="mt-2">
          <v-select label="Ages Served" :items="ages" v-model="agesServed" chips></v-select>
        </v-list-tile>
        <v-list-tile class="mt-5 mb-5">
          <v-select label="Days Open" :items="days" item-text="day" item-value="abbr" v-model="daysOpen" multiple chips></v-select>
        </v-list-tile>
        <v-list-tile class="mt-5">
          <v-btn @click="submitData" dark color="primary">Submit</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="reset" dark color="error">Reset</v-btn>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app color="primary" :clipped-left="clipped" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-lg-and-up"></v-toolbar-side-icon>
      <v-toolbar-items class="ml-2 hidden-sm-and-down logo_image">
        <img src="./assets/logo.png" alt="Baltimore City Logo" height="30px">
      </v-toolbar-items>
      <v-toolbar-title>SummerScape</v-toolbar-title>
      <v-toolbar-items></v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <router-link to="/">
          <v-btn depressed large class="white--text" color="primary" dark>
            <span class="hidden-sm-and-down">Map View</span>
            <v-icon>location_on</v-icon>
          </v-btn>
        </router-link>
        <router-link to="/facilities">
          <v-btn depressed large class="white--text" color="primary" dark>
            <span class="hidden-sm-and-down">List of Facilities</span>
            <v-badge color="purple" overlap class="ml-2">
              <span slot="badge">{{updatedFeatures.length}}</span>
              <v-icon>apps</v-icon>
            </v-badge>
          </v-btn>
        </router-link>
        
      </v-toolbar-items>
      <v-toolbar-items class="google"><div id="google_translate_element" class="hidden-sm-and-down"></div></v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-slide-x-transition mode="in-out">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </v-slide-x-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MapboxMap from './components/MapboxMap.vue';
import Facilities from './components/Facilities.vue';
import AddressSearch from './components/AddressSearch';

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      boolean: ['Yes', 'No'],
      days: [
        { day: 'Sunday', abbr: 'Su' },
        { day: 'Monday', abbr: 'M' },
        { day: 'Tuesday', abbr: 'Tu' },
        { day: 'Wednesday', abbr: 'W' },
        { day: 'Thursday', abbr: 'Th' },
        { day: 'Friday', abbr: 'F' },
        { day: 'Saturday', abbr: 'Sa' }
      ],
      ages: ['Elementary', 'Middle School', 'High School'],
      mealsServed: '',
      daysOpen: [],
      agesServed: ''
    };
  },
  name: 'App',
  components: {
    MapboxMap,
    Facilities,
    AddressSearch
  },
  created() {
    this.$store.dispatch('loadFeatures');
  },
  methods: {
    submitData() {
      const data = {
        DaysOpen: this.daysOpen,
        MealsServe: this.mealsServed,
        AgesServed: this.agesServed
      };
      this.$store.commit('UPDATE_FEATURES', data);
    },
    reset() {
      (this.mealsServed = ''), (this.daysOpen = []), (this.agesServed = '');
      this.$store.commit('RESET');
    }
  },
  computed: {
    updatedFeatures() {
      return this.$store.getters.getupdatedFacilities || [];
    }
  }
};
</script>

<style scoped>
.logo_image {
  align-items: center;
}
a {
  display: flex;
  justify-content: center;
  align-items: center;
}
.router-link-active {
  height: 100%;
}
.router-link-exact-active {
  border-bottom: solid 3px white;
}
.btn,
.btn.btn__content {
  height: 100%;
}
.google {
  justify-content: center;
  align-items: center;
}
</style>
