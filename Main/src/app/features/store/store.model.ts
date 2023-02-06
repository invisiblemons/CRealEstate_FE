export class Store {
    id:      number;
    brandId: number;
    address: string;
    name:    string;

    constructor(res, isCreated) {
        if(res) {
            if(!isCreated) this.id = res.id;
        this.brandId = res.brandId;
        this.address = res.address;
        this.name = res.name;
        } else{
            this.address = null;
        }
    }
}