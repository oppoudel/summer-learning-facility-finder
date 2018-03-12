import axios from 'axios';

axios.defaults.baseURL =
  'https://maps.baltimorecity.gov/egis/rest/services/SummerLearning/Summer/MapServer/0/query';

const appService = {
  getFeatures() {
    return new Promise(resolve => {
      axios
        .get(`?where=1%3D1&outFields=*&outSR=4326&f=pjson`)
        .then(response => {
          resolve(response.data);
        });
    });
  }
};

export default appService;
