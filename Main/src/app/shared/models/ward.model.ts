export class Ward {
    id:         number;
    districtId: number;
    name:       string;
    status:     number;
    teamId:     number;

    constructor(res) {
        this.districtId = null;
        this.name = null;
        this.status = 1;
        this.teamId = null;
    }
}
