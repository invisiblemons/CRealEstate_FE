// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyADWiueQ7dS2K5FKumTyYUUQTnumf6XYRk',
    authDomain: 'crel-site.firebaseapp.com',
    projectId: 'crel-site',
    storageBucket: 'crel-site.appspot.com',
    messagingSenderId: '125288735086',
    appId: '1:125288735086:web:348f9a68a2f2e06392617f',
    measurementId: 'G-B0XYDDNDTH',
  },
  apiUrl: 'https://api.crel.site/api/v1.0',
  googleMapConfig: {
    apiKey: 'AIzaSyCzARTwAutxF8lxJTxRNr1vvHmYE_ZQYDs',
  },
  // apiUrl: 'https://localhost:7272/api/v1.0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
