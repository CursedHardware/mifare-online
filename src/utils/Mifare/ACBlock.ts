import { Record } from "immutable";
import _ from "lodash";
import { setBlock } from "utils/BufferUtils";

const factoryBlock = Buffer.from("FFFFFFFFFFFFFF078069FFFFFFFFFFFF", "hex");

export class AccessControlBlock extends Record({ block: factoryBlock }) {
    public static from(block: Buffer) {
        return new this({ block: Buffer.from(block) });
    }

    public static getBitsIndex(index: number, length: number) {
        if (length !== 4 && length !== 16) {
            throw new Error("blocks length error");
        }
        return length === 16
            ? Math.trunc(index / 5)
            : index;
    }

    public isVerified(index: number) {
        const bits = this.getBits(index, false);
        const inverted = this.getBits(index, true);
        return (bits ^ inverted) === 0b111;
    }

    public getBits(index: number, inverted: boolean = false) {
        const value = this.getAccessBits().readUInt32LE(0);
        const offset = inverted ? 0 : 12;
        return toBits(
            getBit(value, index + offset + 0),
            getBit(value, index + offset + 4),
            getBit(value, index + offset + 8),
        );
    }

    public setBits(index: number, bits: number) {
        const payload = this.getAccessBits();
        let value = payload.readInt32LE(0);
        let bit: ReturnType<typeof getBit>;
        for (let n = 2, i = 0; n >= 0; n-- , i += 4) {
            bit = getBit(bits, n);
            value = setBit(value, index + 12 + i, bit);
            value = setBit(value, index + 0 + i, bit ? 0 : 1);
        }
        payload.writeInt32LE(value, 0);
        return this.setAccessBits(payload);
    }

    public getAccessBits() {
        return Buffer.from(this.block.slice(0x06, 0x0A));
    }

    public setAccessBits(block: Buffer) {
        if (block.length !== 0x4) {
            throw new Error("access bits length error");
        }
        return this.set("block", setBlock(this.block, block, 0x06));
    }

    public getKey(type: "A" | "B") {
        const offset = type === "A" ? 0x00 : 0x0A;
        return Buffer.from(this.block.slice(offset, offset + 6));
    }

    public setKey(type: "A" | "B", block: Buffer) {
        if (block.length !== 6) {
            throw new Error("block length error.");
        }
        const offset = type === "A" ? 0x00 : 0x0A;
        return this.set("block", setBlock(this.block, block, offset));
    }
}

const getBit = (x: number, n: number) =>
    (x & (1 << n)) === 0 ? 0 : 1;

const setBit = (x: number, n: number, v: 1 | 0) =>
    (x & (~(1 << n))) | (v << n);

const toBits = (n0: number, n1: number, n2: number) =>
    (n0 * 4) + (n1 * 2) + n2;
