import { Team } from "../../shared/models/team.model";


export class Broker {
  id: number;
  userName: string;
  birthday: Date;
  gender: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  status: number;
  teamId: number;
  avatarFileId: string;
  avatarLink: string;
  team: Team;
  teamName: string;
  password: string;

  constructor(res, isCreate) {
    if (res) {
      if (!isCreate) this.id = res.id;
      this.userName = res.userName.toLowerCase().trim();
      this.birthday = res.birthday;
      this.password = res.password;
      this.gender = res.gender;
      this.name = res.name.trim();
      this.email = res.email.trim();
      this.phoneNumber = res.phoneNumber;
      this.status = res.status;
      this.teamId = res.teamId;
      this.avatarFileId = res.avatarFileId;
      this.avatarLink = res.avatarLink;
    } else {
      this.userName = null;
      this.birthday = null;
      this.gender = null;
      this.name = null;
      this.email = null;
      this.phoneNumber = null;
      this.status = 2;
      this.teamId = null;
      this.avatarFileId = null;
      this.avatarLink = null;
    }
  }
}
