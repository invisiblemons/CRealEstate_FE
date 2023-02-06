import { Brand } from '../brand/brand.model';
import { Broker } from '../broker/broker.model';
import { Property } from '../property/property.model';

export class Appointment {
  id: number;
  brandId: number;
  brokerId: number;
  propertyId: number;
  onDateTime: Date;
  status: number;
  description: string;
  createDateTime: Date;
  rejectMessage: string;
  brand: Brand;
  property: Property;

  constructor(res, isCreate) {
    if (res) {
      if (isCreate) {
        this.id = res.id;
      }
      this.brandId = res.brandId;
      this.brokerId = res.brokerId;
      this.propertyId = res.propertyId;
      this.onDateTime = res.onDateTime;
      this.status = res.status;
      this.description = res.description;
      this.createDateTime = res.createDateTime;
      this.rejectMessage = res.rejectMessage;
      this.brand = res.brand;
      this.property = res.property;
    } else {
      this.brandId = null;
      this.brokerId = null;
      this.propertyId = null;
      this.onDateTime = null;
      this.status = 1;
      this.description = '';
      this.createDateTime = null;
      this.rejectMessage = null;
      this.brand = null;
      this.property = null;
    }
  }
}
