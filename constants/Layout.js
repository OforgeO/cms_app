import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  //serverUrl: 'http://192.168.8.55/',
  serverUrl: 'http://storeapp.giftyou.tokyo/',
  //serverUrl: 'https://storeapp.excill.com/',
  isSmallDevice: width < 375,
  googleTranslateApiKey: 'AIzaSyCTC-7K84OFpQlHFS5422Hs9TrF9zepvXI'
};
