import { queryFeatures } from '@esri/arcgis-rest-feature-service';
const requestOptions = {
  url:
    "https://maps.baltimorecity.gov/egis/rest/services/SummerLearning/Summer/MapServer/0/",
  params: {
    f: "geojson",
    outFields: "*",
    where: "1=1",
  }};

const appService = {
  getFeatures() {
    return new Promise(resolve => {
      queryFeatures(requestOptions)
        .then(response => resolve(response));
    });
  }
};

export default appService;
