export class Media {
  id: number;
  link: string;
  fileId: string;
  propertyId: number;
  projectId: number;
  contractId: number;
  type: number;

  constructor(res, isCreate) {
    if (res) {
      if (!isCreate) this.id = res.id;
      this.link = res.link;
      this.fileId = res.fileId;
      this.propertyId = res.propertyId;
      this.projectId = res.projectId;
      this.contractId = res.contractId;
      this.type = res.type;
    } else {
      this.link = null;
      this.fileId = null;
      this.propertyId = null;
      this.projectId = null;
      this.contractId = null;
    }
  }
}
