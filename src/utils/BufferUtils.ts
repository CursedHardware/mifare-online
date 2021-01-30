export function setBlock(payload: Buffer, block: Buffer, offset?: number) {
    const cloned = Buffer.from(payload);
    cloned.set(block, offset);
    return cloned;
}

export function toString(block?: Buffer) {
    if (block === undefined) { return ""; }
    return block.toString("hex").toUpperCase();
}

export function* diff(a: Buffer, b: Buffer) {
    if (a.length !== b.length) {
        throw new Error("length error");
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            yield i;
        }
    }
}
