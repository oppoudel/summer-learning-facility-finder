<template>
  <v-app>
    <v-navigation-drawer persistent :clipped="clipped" v-model="drawer" enable-resize-watcher fixed app width="350">
      <v-toolbar flat>
        <v-list>
          <v-list-tile color="primary">
            <v-list-tile-title class="title">
              Filter Facilities
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile class="mt-2">
          <v-select label="Meals Served" :items="boolean" v-model="mealsServed" chips></v-select>
        </v-list-tile>
        <v-list-tile class="mt-4 mb-2">
          <v-select label="Days Open" :items="days" item-text="day" item-value="abbr" v-model="daysOpen" multiple chips></v-select>
        </v-list-tile>
        <v-list-tile class="mt-4">
          <v-btn @click="submitData" dark color="primary">Submit</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="reset" dark color="error">Reset</v-btn>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app color="primary" :clipped-left="clipped" dense dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-lg-and-up"></v-toolbar-side-icon>
      <v-toolbar-items class="ml-5">
        <button><img src="./assets/logo.png" alt="Baltimore City Logo" height="30px"></button>
      </v-toolbar-items>
      <v-toolbar-title>Summer Learning Baltimore</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>List of Facilities</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <MapboxMap></MapboxMap>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MapboxMap from './components/MapboxMap.vue';

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      boolean: ['Yes', 'No'],
      days: [
        { day: 'Monday', abbr: 'M' },
        { day: 'Tuesday', abbr: 'Tu' },
        { day: 'Wednesday', abbr: 'W' },
        { day: 'Thursday', abbr: 'Th' },
        { day: 'Friday', abbr: 'F' }
      ],
      mealsServed: '',
      daysOpen: []
    };
  },
  name: 'App',
  components: {
    MapboxMap
  },
  created() {
    this.$store.dispatch('loadFeatures');
  },
  methods: {
    submitData() {
      const data = { DaysOpen: this.daysOpen, MealsServe: this.mealsServed };
      this.$store.commit('UPDATE_FEATURES', data);
    },
    reset() {
      (this.mealsServed = ''), (this.daysOpen = []);
      this.$store.commit('RESET');
    }
  }
};
</script>

<style>

</style>
