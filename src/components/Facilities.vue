<template>
  <section>
    <v-layout column wrap align-center>
      <v-flex xs12>
        <v-container grid-list-xl>
          <v-layout row wrap align-center>
            <v-flex xs12 md4 v-for="(feature, index) in features" :key="index">
              <v-card>
                <v-toolbar flat dense color="primary--text">
                  <v-toolbar-title class="subheading">{{feature.properties.ProgramNam}}</v-toolbar-title>
                </v-toolbar>
                <v-list three-line dense>
                  <v-list-tile class="condensed">
                    <v-list-tile-action>
                      <v-icon color="primary">business</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{feature.properties.Organizati}}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset></v-divider>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon color="primary">location_on</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{feature.properties.Address}}</v-list-tile-title>
                      <v-list-tile-sub-title>{{feature.properties.City}}, MD {{feature.properties.Zipcode}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset></v-divider>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon color="primary">list</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-sub-title>Meals Serve: {{feature.properties.MealsServe}}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>Days Open: {{feature.properties.DaysOpen}}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>Ages Served: {{feature.properties.AgesServed}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset></v-divider>
                  <v-card-title class="description">We offer a variety of activities and operate from June 24 – August 30. We have weekly Field Trips, and students will learn about the arts and STEM from professionals. In this program youth speak English, Spanish, Khmer, and Cantonese, and staff speak English and Spanish. There is always a bilingual Spanish staff person present.  Meals are served at this program.</v-card-title>
                  <v-divider inset></v-divider>
                  <v-list-tile v-if="feature.properties.distance">
                    <v-list-tile-action>
                      <v-icon color="primary">linear_scale</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{feature.properties.distance.toFixed(2)}} miles away</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </section>
</template>
<script>
export default {
  computed: {
    features() {
      return this.$store.getters.getupdatedFacilities;
    }
  }
};
</script>
<style>
.condensed {
  height: 56px;
}
.description {
  color: rgba(0, 0, 0, 0.56);
}
</style>
