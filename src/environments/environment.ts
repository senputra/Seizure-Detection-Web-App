// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keys: {
    GENERAL_KEY: 'abc',
    SPECIALIST_KEY: '123',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyC-0k9eLQZi7WGmFGgSUyhj7YOY230zmss',
    authDomain: 'seizure-detection-3b9dc.firebaseapp.com',
    databaseURL: 'https://seizure-detection-3b9dc.firebaseio.com',
    projectId: 'seizure-detection-3b9dc',
    storageBucket: 'seizure-detection-3b9dc.appspot.com',
    messagingSenderId: '75491667771',
    appId: '1:75491667771:web:ea80657c36cc26f08f911e',
    measurementId: 'G-J73908GNEY',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
