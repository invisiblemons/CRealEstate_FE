export class Team  {
    id:            number;
    description:   string;
    name:          string;
    status:        number;
    areaManagerId: number;

    constructor(res, isCreate) {
        if (res) {
          if (!isCreate) this.id = res.id;
          this.description = res.description;
          this.name = res.name;
          this.status = res.status;
          this.areaManagerId = res.areaManagerId;
        } else {
          this.description = null;
          this.name = null;
          this.status = 1;
          this.areaManagerId = null;
        }
      }
}
