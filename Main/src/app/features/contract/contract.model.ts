import { Owner } from "src/app/shared/models/contact.model";
import { Media } from "src/app/shared/models/media.model";
import { Brand } from "../brand/brand.model";
import { Broker } from "../broker/broker.model";
import { Property } from "../property/property.model";

export class Contract {
  id: number;
  startDate: Date;
  endDate: Date;
  ownerId: number;
  propertyId: number;
  brandId: number;
  brokerId: number;
  status: number;
  reasonCancel: null;
  createDate: Date;
  paymentTerm: string;
  price: number;
  media: any[];
  property: Property;
  brand: Brand;
  owner: Owner;
  broker: Broker;
  signDate: null;
  signAddress: string;
  lessor: string;
  lessorBirthDate: Date;
  lessorCccd: string;
  lessorCccdGrantDate: null;
  lessorCccdGrantAddress: string;
  lessorAddress: string;
  lessorBankAccountNumber: string;
  lessorBank: string;
  renterOfficeAddress: string;
  registrationNumberGrantDate: null;
  registrationNumberGrantAddress: string;
  brandRepresentativeName: string;
  brandRepresentativeBirthday: null;
  brandRepresentativeAddress: string;
  brandRepresentativePhoneNumber: string;
  brandRepresentativeCccd: string;
  brandRepresentativeCccdGrantDate: null;
  brandRepresentativeCccdGrantAddress: string;
  payDay: number;
  leaseLength: number;
  handoverDate: null;
  contractTerms: ContractTerm[];

  ownerName: string;
  brandName: string;
  brokerName: string;
}

export class ContractTerm {
  title: string;
  content: string;
  index: number;
  contractTerms?: ContractTerm[];
}
