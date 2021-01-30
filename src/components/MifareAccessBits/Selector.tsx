import classNames from "classnames";
import _ from "lodash";
import React from "react";
import { Table } from "reactstrap";
import {
    AccessConditionDataBlock,
    AccessConditionSectorTrailer,
} from "utils/Mifare/ACBits";

import style from "./Editor.scss";

const items = [0b000, 0b010, 0b100, 0b110, 0b001, 0b011, 0b101, 0b111];

interface IProps {
    bits: number;
    onChange(bits: number): void;
}

export const DataBlockSelector: React.SFC<IProps> = (props) => (
    <Table responsive size="sm" className={style["access-bits-block"]}>
        <thead>
            <tr>
                <th>#</th>
                <th>Read</th>
                <th>Write</th>
                <th>Increment</th>
                <th title="Transfer and Restore">Decrement</th>
                <th>Application</th>
            </tr>
        </thead>
        <tbody>
            {_.map(items, (item) => {
                const block = new AccessConditionDataBlock(item);
                return (
                    <tr
                        key={item}
                        className={classNames({ [style.selected]: item === props.bits })}
                        onClick={() => props.onChange(item)}
                    >
                        <td>{_.padStart(item.toString(2), 3, "0")}</td>
                        <td>{makeField(block.read)}</td>
                        <td>{makeField(block.write)}</td>
                        <td>{makeField(block.increment)}</td>
                        <td>{makeField(block.decrement)}</td>
                        <td>{block.application}</td>
                    </tr>
                );
            })}
        </tbody>
    </Table>
);

export const SectorTrailerSelector: React.SFC<IProps> = (props) => (
    <Table responsive size="sm" className={style["access-bits-block"]}>
        <thead>
            <tr>
                <th>#</th>
                <th>Key A (Read/Write)</th>
                <th>Access Bits (Read/Write)</th>
                <th>Key B (Read/Write)</th>
                <th>Remark</th>
            </tr>
        </thead>
        <tbody>
            {_.map(items, (item) => {
                const block = new AccessConditionSectorTrailer(item);
                return (
                    <tr
                        key={item}
                        className={classNames({ [style.selected]: item === props.bits })}
                        onClick={() => props.onChange(item)}
                    >
                        <td>{_.padStart(item.toString(2), 3, "0")}</td>
                        <td>{makeField(block.readKeyA)} / {makeField(block.writeKeyA)}</td>
                        <td>{makeField(block.readAccessBits)} / {makeField(block.writeAccessBits)}</td>
                        <td>{makeField(block.readKeyB)} / {makeField(block.writeKeyB)}</td>
                        <td>{block.remark}</td>
                    </tr>
                );
            })}
        </tbody>
    </Table>
);

const makeField = (value?: string | string[]) => {
    if (value === undefined) {
        return "never";
    }
    if (Array.isArray(value)) {
        return `${value.join("")} Key`;
    }
    return value;
};
