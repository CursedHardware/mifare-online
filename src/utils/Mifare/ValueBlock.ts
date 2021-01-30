import { Record } from "immutable";

export class ValueBlock extends Record({ block: Buffer.alloc(16) }) {
    public static isValueBlock(block: Buffer) {
        return this.isVaildValue(block) && this.isVaildAddress(block);
    }

    public static from(block: Buffer) {
        return new this({ block });
    }

    private static isVaildValue(block: Buffer) {
        const value = ~block.readInt32BE(4);
        return (
            (block.readInt32LE(0) === value) &&
            (block.readInt32LE(8) === value)
        );
    }

    private static isVaildAddress(block: Buffer) {
        return (
            block[12] === block[14] &&
            block[13] === block[15] &&
            (block[12] ^ 0xFF) === block[13]
        );
    }

    public getValue() {
        if (!ValueBlock.isVaildValue(this.block)) {
            throw new Error("value is invaild");
        }
        return this.block.readInt32LE(0);
    }

    public setValue(value: number) {
        const block = Buffer.from(this.block);
        block.writeInt32LE(value, 0);
        block.writeInt32LE(~value, 4);
        block.writeInt32LE(value, 8);
        return this.set("block", block);
    }

    public getAddress() {
        if (!ValueBlock.isVaildAddress(this.block)) {
            throw new Error("address is invaild");
        }
        return this.block[12];
    }

    public setAddress(address: number) {
        const block = Buffer.from(this.block);
        block[12] = address;
        block[13] = ~block[12];
        block[14] = address;
        block[15] = ~block[14];
        return this.set("block", block);
    }

    public toBlock() {
        return Buffer.from(this.block);
    }
}
