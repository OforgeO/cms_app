/*****************************
* environment.js
* path: '/environment.js' (root of your project)
******************************/

import Constants from "expo-constants";


const ENV = {
 dev: {
    EXPO_APPLE_ID_PASSWORD : "Dell9361"
 },
 staging: {
    EXPO_APPLE_ID_PASSWORD : "Dell9361"
 },
 prod: {
    EXPO_APPLE_ID_PASSWORD : "Dell9361"
 }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 if (__DEV__) {
   return ENV.dev;
 } else if (env === 'staging') {
   return ENV.staging;
 } else if (env === 'prod') {
   return ENV.prod;
 }
};

export default getEnvVars(Constants.manifest.appleIdPassword);