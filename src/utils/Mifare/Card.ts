import { List, Record } from "immutable";
import _ from "lodash";
import { toString } from "utils/BufferUtils";
import { AccessControlBlock } from "./ACBlock";

const BLOCK_SIZE = 0x10;

interface IProps {
    blocks: List<Buffer>;
}

export class MifareCard extends Record<IProps>({ blocks: List() }) {
    public static from(card: Buffer) {
        if (_.isNil(MifareCard.isSupportedCard(card))) {
            throw new Error("The card is not supported.");
        }
        const blocks = _.times(
            card.length / BLOCK_SIZE,
            (n) => {
                const start = n * BLOCK_SIZE;
                const end = start + BLOCK_SIZE;
                return Buffer.from(card.slice(start, end));
            },
        );
        return new this({ blocks: List(blocks) });
    }

    public static isSupportedCard(card: Buffer) {
        return _.includes([0x320, 0x400, 0x800, 0x1000], card.length);
    }

    public getUID() {
        const block = this.getBlock(0, 0);
        if (_.isUndefined(block)) { return undefined; }
        return Buffer.from(block.slice(0x00, 0x04));
    }

    public setUID(payload: Buffer) {
        if (payload.length !== 4) {
            throw new Error("uid length error");
        }
        const checksum = payload.reduce((prev, next) => prev ^ next);
        const block = this.getBlock(0, 0);
        if (_.isUndefined(block)) { return undefined; }
        block.set(payload, 0);
        block.writeUInt8(checksum, payload.length);
        return this.setBlock(0, 0, block);
    }

    public getManufacturerData() {
        const block = this.getBlock(0, 0);
        if (_.isUndefined(block)) { return undefined; }
        return Buffer.from(block.slice(0x05));
    }

    public getBlocks() {
        return this.blocks;
    }

    public getBlock(sectorIndex: number, blockIndex: number) {
        const index = getBlockIndex(sectorIndex, blockIndex);
        const block = this.blocks.get(index);
        if (_.isUndefined(block)) { return undefined; }
        return Buffer.from(block);
    }

    public setBlock(sectorIndex: number, blockIndex: number, block: Buffer) {
        const index = getBlockIndex(sectorIndex, blockIndex);
        return this.set("blocks", this.blocks.set(index, block));
    }

    public getSectors() {
        const sectors = [];
        for (let n = 0, step = 4; n < 256;) {
            if (n === 128) { step = 16; }
            const blocks = this.blocks.slice(n, n += step);
            if (blocks.isEmpty()) { break; }
            sectors.push(blocks);
        }
        return List(sectors);
    }

    public getKeys() {
        const keys: Buffer[] = [];
        this.getSectors().forEach((blocks) => {
            const block = new AccessControlBlock({ block: blocks.last() });
            keys.push(block.getKey("A"), block.getKey("B"));
        });
        keys.sort(Buffer.compare);
        keys.reverse();
        return _.union(_.map(keys, toString));
    }

    public toCard() {
        return Buffer.concat(this.blocks.toArray());
    }

    public isEmpty() {
        return this.blocks.isEmpty();
    }
}

function getBlockIndex(sectorIndex: number, blockIndex: number) {
    const base = (
        sectorIndex < 32
            ? sectorIndex * 4
            : 128 + (sectorIndex - 32) * 16
    );
    return base + blockIndex;
}
