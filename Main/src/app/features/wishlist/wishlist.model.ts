import { Brand } from '../brand/brand.model';
import { Property } from '../property/property.model';

export class Wishlist {
  brandId: number;
  propertyId: number;
  type: number;
  property: Property;
  brand: Brand;
  constructor(res) {
    if (res) {
      this.brandId = res.brandId;
      this.propertyId = res.propertyId;
      this.type = res.type;
    } else {
      this.brandId = null;
      this.propertyId = null;
      this.type = null;
    }
  }
}
