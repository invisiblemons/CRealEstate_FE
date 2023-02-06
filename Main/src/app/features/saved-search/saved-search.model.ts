import { Property } from "../property/property.model";

export class Request {
    id: number;
    brandId: number;
    area: string;
    amount: number;
    amountFrontage: number;
    minPrice: number;
    maxPrice: number;
    minRentalTime: Date;
    maxRentalTime: Date;
    minFloorArea: number;
    maxFloorArea: number;
    description: string;
    status: number;
    selectedUpdateMethod:any;
    properties: Property[];
  }
  