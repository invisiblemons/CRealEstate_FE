import { StreetSegment } from "./streetSegment.model";
import { Ward } from "./ward.model";

export class Location {
  id: number;
  status: number;
  placeId: string;
  address: string;
  wardId: number;
  streetSegmentId: number;
  latitude: number;
  longitude: number;
  streetSegment: StreetSegment;
  ward: Ward;
  addressName: string;

  constructor(res, isCreate) {
    if (res) {
      if (!isCreate) this.id = res.id;
      this.address = res.address.trim();
      this.placeId = res.placeId;
      this.status = res.status;
      this.wardId = res.wardId;
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      this.streetSegmentId = res.streetSegmentId;
    } else {
      this.address = null;
      this.placeId = null;
      this.status = 1;
      this.wardId = null;
      this.latitude = null;
      this.longitude = null;
      this.streetSegmentId = null;
    }
  }
}
