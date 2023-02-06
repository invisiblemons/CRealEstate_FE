import { Loader } from '@googlemaps/js-api-loader';
import { apiKey } from './constants';
export const loader = new Loader({
  apiKey: apiKey,
  version: 'weekly',
  libraries: ['places'],
  language: 'vi'
});

export const STYLE_MAP = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#cde6ee"
      }
    ]
  }
];
