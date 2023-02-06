import { Industry } from 'src/app/shared/models/industry.model';

export class Brand {
  id: number;
  userName: string;
  password: string;
  totalProperty: number;
  name: string;
  firebaseUid: string;
  email: string;
  phoneNumber: string;
  status: number;
  description: string;
  avatarFileId: string;
  avatarLink: string;
  industryId: number;
  industry: Industry;
  industryName: string;
  registrationNumber: string;
  isNeedUpdatePassword: boolean;

  constructor(res, isCreate) {
    if (res) {
      if (!isCreate) {
        this.userName = res.userName ? res.userName.toLowerCase().trim() : '';
      }

      this.name = res.name.trim();
      this.email = res.email.trim();
      this.phoneNumber = res.phoneNumber;
      this.description = res.description ? res.description.trim() : '';
      this.avatarLink = res.avatarLink;
      this.industryId = res.industryId;
      this.registrationNumber = res.registrationNumber;
    } else {
      this.userName = null;
      this.totalProperty = null;
      this.name = null;
      this.firebaseUid = null;
      this.email = null;
      this.phoneNumber = null;
      this.status = 2;
      this.description = null;
      this.avatarFileId = null;
      this.avatarLink = null;
      this.industryId = null;
      this.registrationNumber = null;
      this.password = null;
    }
  }
}
