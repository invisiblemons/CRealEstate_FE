import { Owner } from "src/app/shared/models/contact.model";
import { Industry } from "src/app/shared/models/industry.model";
import { Location } from "src/app/shared/models/location.model";
import { Media } from "src/app/shared/models/media.model";
import { Project } from "src/app/shared/models/project.model";
import { Broker } from "../broker/broker.model";

export class Property {
  id: number;
  locationId: number;
  brokerId: number;
  createDate: Date;
  lastUpdateDate: Date;
  status: number;
  description: string;
  rejectReason: string;
  type: number;
  name: string;
  projectId: number;
  direction: number;
  floor: string;
  floorArea: number;
  area: number;
  frontage: number;
  certificates: number;
  vertical: number;
  horizontal: number;
  roadWidth: number;
  rentalCondition: string;
  rentalTerm: string;
  depositTerm: string;
  paymentTerm: string;
  price: number;
  numberOfFrontage: number;
  media: Media[];
  location: Location;
  owners: Owner[];
  industryProperties: IndustryProperty[];
  project: Project;
  projectName: string;
  broker: Broker;
  brokerName: string;
  ownerNames: string[];
  addressFull: string;
  isActiveHeart: boolean;
  mainImage: Media;
  images: Media[];
  directionName: string;

  constructor(res, isCreate) {
    if (res) {
      if (!isCreate) this.id = res.id;
      this.locationId = res.locationId;
      this.brokerId = res.brokerId;
      this.status = res.status;
      this.description = res.description ? res.description.trim() : "";
      this.rejectReason = isCreate ? "" : res.rejectReason;
      this.type = 0;
      this.name = res.name ? res.name.trim() : "";
      this.projectId = res.projectId;
      this.direction = res.direction;
      this.floor = res.floor;
      this.floorArea = res.floorArea;
      this.area = res.area;
      this.frontage = res.frontage;
      this.certificates = res.certificates;
      this.numberOfFrontage = res.numberOfFrontage;
      this.vertical = res.vertical;
      this.horizontal = res.horizontal;
      this.roadWidth = res.roadWidth;
      this.rentalCondition = res.rentalCondition
        ? res.rentalCondition.trim()
        : "";
      this.rentalTerm = res.rentalTerm ? res.rentalTerm.trim() : "";
      this.depositTerm = res.depositTerm ? res.depositTerm.trim() : "";
      this.paymentTerm = res.paymentTerm ? res.paymentTerm.trim() : "";
      this.price = parseInt((res.price*1000000).toFixed(0));
    }
  }
}
export class IndustryProperty {
  industryId: number;
  rate: number;
  industryDto: Industry;
}
