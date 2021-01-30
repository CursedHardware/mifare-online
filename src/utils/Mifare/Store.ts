import { format } from "date-fns";
import _ from "lodash";
import { readBuffer } from "utils/BlobUtils";
import { toString } from "utils/BufferUtils";
import { matchAll } from "utils/RegExpUtils";
import { MifareCard } from "./Card";

export enum FileType {
    MFD = "mfd",
    EML = "eml",
    MCT = "mct",
    Text = "txt",
}

const readers: Record<FileType, (buffer: Buffer) => Buffer> = {
    [FileType.MFD](buffer) {
        return buffer;
    },
    [FileType.EML](buffer) {
        const matched = matchAll(
            /[0-9A-F]{32}/gi,
            buffer.toString(),
            (m) => m[0],
        );
        return Buffer.from(matched.join(""), "hex");
    },
    [FileType.MCT](buffer) {
        const matched = matchAll(
            /[0-9A-F]{32}/gi,
            buffer.toString(),
            (m) => m[0],
        );
        return Buffer.from(matched.join(""), "hex");
    },
    [FileType.Text](buffer) {
        const matched = matchAll(
            /(?:[0-9A-F]{2}(?:\s+)?){16}/gi,
            buffer.toString(),
            (m) => m[0].replace(/\s+/g, ""),
        );
        return Buffer.from(matched.join(""), "hex");
    },
};

export const loadFile = async (payload?: Blob) => {
    if (_.isNil(payload)) {
        throw new Error("unknown data");
    }
    const buffer = await readBuffer(payload);
    for (const loader of _.values(readers)) {
        try {
            const card = loader(buffer);
            if (MifareCard.isSupportedCard(card)) {
                return card;
            }
        } catch (e) {
            // ignore
        }
    }
    throw new Error("unknown data");
};

const writers: Record<FileType, (card: MifareCard) => Buffer | string> = {
    [FileType.MFD](card) {
        return card.toCard();
    },
    [FileType.EML](card) {
        return card.getBlocks().map(toString).join("\n");
    },
    [FileType.MCT](card) {
        const sectors = card.getSectors().flatMap((blocks, index) => [
            `+Sector: ${index}`,
            blocks.map(toString).join("\n"),
        ]);
        return sectors.join("\n");
    },
    [FileType.Text](card) {
        const sectors = card.getSectors().map((blocks, sectorIndex) => {
            const toBlockLine = (block: Buffer, index: number) => {
                const data = toString(block).match(/.{2}/g)!.join(" ");
                return `${index} \xC9\xC8\xC7\xF8: ${data}`;
            };
            const sector = [
                `${sectorIndex} \xC7\xF8\xBF\xE9`,
                blocks.map(toBlockLine).join("\r\n"),
            ];
            return sector.join("\r\n");
        });
        return Buffer.from(sectors.join("\r\n\r\n"), "binary");
    },
};

export const saveFile = (card: MifareCard, type: FileType) => {
    return new Blob(
        [writers[type](card)],
        { type: "application/octet-stream" },
    );
};

export const getDownloadableFileName = (card: MifareCard, type: FileType) => {
    const formattedUID = toString(card.getUID());
    const formattedDateTime = format(Date.now(), "YYYYMMDDHHMMss");
    return `UID_${formattedUID}_${formattedDateTime}.${type}`;
};
