export class District {
    id:         number;
    name:       string;
    status:     number;
    constructor(res) {
        if (res) {
          this.status = 1;
          this.name = null;
        }
      }
}
