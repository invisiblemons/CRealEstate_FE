export class StreetSegment {
    id:          number;
    description: string;
    name:        string;
    status:      number;
    districtId:  number;

    constructor(res) {
        this.description = null;
        this.name = null;
        this.status = 1;
        this.districtId = null;
    }
}
