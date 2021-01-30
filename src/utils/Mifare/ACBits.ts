import _ from "lodash";

// tslint:disable:max-classes-per-file

export class AccessConditionDataBlock {
    private bits: number;

    constructor(bits: number) {
        this.bits = bits;
    }

    public get read() {
        if (_.includes([0b000, 0b010, 0b100, 0b110, 0b00], this.bits)) {
            return ["A", "B"];
        } else if (_.includes([0b011, 0b101], this.bits)) {
            return ["B"];
        }
        return undefined;
    }

    public get write() {
        if (this.bits === 0b000) {
            return ["A", "B"];
        } else if (_.includes([0b100, 0b110, 0b011], this.bits)) {
            return ["B"];
        }
        return undefined;
    }

    public get increment() {
        if (this.bits === 0b000) {
            return ["A", "B"];
        } else if (this.bits === 0b110) {
            return ["B"];
        }
        return undefined;
    }

    public get decrement() {
        if (_.includes([0b000, 0b110, 0b001], this.bits)) {
            return ["A", "B"];
        }
        return undefined;
    }

    public get transfer() {
        return this.decrement;
    }

    public get restore() {
        return this.decrement;
    }

    public get application() {
        if (this.bits === 0b000) {
            return "transport configuration";
        } else if (_.includes([0b110, 0b001], this.bits)) {
            return "value block";
        }
        return "read/write block";
    }

    public toString() {
        return this.bits.toString(2).padStart(3, "0");
    }
}

export class AccessConditionSectorTrailer {
    private bits: number;

    constructor(bits: number) {
        this.bits = bits;
    }

    public get readKeyA() {
        return undefined;
    }

    public get writeKeyA() {
        if (_.includes([0b000, 0b001], this.bits)) {
            return ["A"];
        } else if (_.includes([0b100, 0b011], this.bits)) {
            return ["B"];
        }
        return undefined;
    }

    public get readAccessBits() {
        if (_.includes([0b000, 0b010, 0b001], this.bits)) {
            return ["A"];
        }
        return ["A", "B"];
    }

    public get writeAccessBits() {
        if (this.bits === 0b001) {
            return ["A"];
        } else if (_.includes([0b011, 0b101], this.bits)) {
            return ["B"];
        }
        return undefined;
    }

    public get readKeyB() {
        if (_.includes([0b000, 0b010, 0b001], this.bits)) {
            return ["A"];
        }
        return undefined;
    }

    public get writeKeyB() {
        if (_.includes([0b000, 0b001], this.bits)) {
            return ["A"];
        } else if (_.includes([0b100, 0b011], this.bits)) {
            return ["B"];
        }
        return undefined;
    }

    public get remark() {
        if (_.includes([0b000, 0b010], this.bits)) {
            return "Key B may be read";
        } else if (this.bits === 0b001) {
            return "transport configuration";
        }
        return undefined;
    }

    public toString() {
        return this.bits.toString(2).padStart(3, "0");
    }
}
