import { AddressComponents } from '../Address/address-components-class';
import { GeometryAddress } from '../Address/geometry-address-class';
import { PlusCode } from '../Address/plus-code-class';

export class GeoLocation {
  address_components: AddressComponents[];
  formatted_address: string;
  geometry: GeometryAddress;
  place_id: string;
  plus_code: PlusCode;
  types: string[];
}
