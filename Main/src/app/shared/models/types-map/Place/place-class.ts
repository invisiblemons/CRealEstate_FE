import { GeometryPlace } from './Geometry/geometry-place-class';
import { OpeningHours } from './OpeningHours/openinghours-class';
import { Photo } from './Photo/photo-class';

export class Place {
  bussinesStatus: string;
  geometry: GeometryPlace;
  icon: string;
  name: string;
  openingHours: OpeningHours;
  photos: Photo[];
  types: string[];
  vicinity: string;
}
