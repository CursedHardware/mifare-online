import classNames from "classnames";
import { List } from "immutable";
import _ from "lodash";
import React from "react";
import { Table } from "reactstrap";
import { toString } from "utils/BufferUtils";
import { MifareCard } from "utils/Mifare";
import { AccessControlBlock } from "utils/Mifare/ACBlock";
import { AccessBitsModal } from "./AccessBits/Modal";
import { AccessBitsPopover } from "./AccessBits/Popover";
import style from "./index.scss";

interface IProps {
    card: MifareCard;
    onChange(card: MifareCard): void;
}

interface IState {
    isOpenAccessBitsEditorModal: boolean;
    sectorIndex: number;
    blockIndex: number;
}

export class MifareEditor extends React.Component<IProps, IState> {
    public state: IState = {
        isOpenAccessBitsEditorModal: false,
        sectorIndex: 0,
        blockIndex: 0,
    };

    public render() {
        const rows = this.props.card.getSectors()
            .map((blocks, index) => blocks.map(_.partialRight(this.makeBlock, index)));
        return (
            <Table responsive bordered size="sm" className={style.editor}>
                <thead>
                    <tr>
                        <th>Sector</th>
                        <th>Block</th>
                        <th>Data</th>
                        <th>Access</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
                {this.makeAccessBitsModal()}
            </Table>
        );
    }

    private makeAccessBitsModal = () => {
        const block = this.props.card.getBlock(
            this.state.sectorIndex,
            this.state.blockIndex,
        );
        if (!this.state.isOpenAccessBitsEditorModal) {
            return;
        }
        return (
            <AccessBitsModal
                block={AccessControlBlock.from(block!)}
                onChange={this.handleUpdateBlock}

                onToggle={this.handleOpenAccessBitsEditorModal}
            />
        );
    }

    private handleOpenAccessBitsEditorModal = () => {
        this.setState({
            isOpenAccessBitsEditorModal: !this.state.isOpenAccessBitsEditorModal,
        });
    }

    private makeBlock = (
        block: Buffer,
        blockIndex: number,
        blocks: List<Buffer>,
        sectorIndex: number,
    ) => {
        const sector = (
            blockIndex === 0 &&
            <td rowSpan={blocks.size}>{sectorIndex}</td>
        );
        return (
            <tr key={blockIndex} data-sector={sectorIndex} data-block={blockIndex}>
                {sector}
                <td>{blockIndex}</td>
                <td>{this.makeData(block, blockIndex, sectorIndex)}</td>
                {this.makeAccessBits(blocks, blockIndex)}
            </tr>
        );
    }

    private makeAccessBits = (blocks: List<Buffer>, blockIndex: number) => {
        const block = new AccessControlBlock({ block: blocks.last() });
        const index = AccessControlBlock.getBitsIndex(blockIndex, blocks.size);
        let rowSpan;
        if (blocks.size === 16) {
            if (blockIndex % 5 !== 0 || index > 3) {
                return null;
            } else if (blockIndex % 5 === 0 && index < 3) {
                rowSpan = 5;
            }
        }
        const className = classNames(style.access, {
            [style.verified]: block.isVerified(index),
        });
        return (
            <td className={className} rowSpan={rowSpan}>
                <AccessBitsPopover
                    bits={block.getBits(index)}
                    index={index}
                />
            </td>
        );
    }

    private makeData = (block: Buffer, blockIndex: number, sectorIndex: number) => {
        if (sectorIndex === 0 && blockIndex === 0) {
            return (
                <section className={style["manufacturer-block"]}>
                    {toString(block)}
                </section>
            );
        } else if (blockIndex === (sectorIndex < 32 ? 3 : 15)) {
            const access = new AccessControlBlock({ block });
            return (
                <section>
                    <b className={style["key-a"]}>
                        {toString(access.getKey("A"))}
                    </b>
                    <b className={style["access-bits"]} onClick={this.handleAccessBitsEditor}>
                        {toString(access.getAccessBits())}
                    </b>
                    <b className={style["key-b"]}>
                        {toString(access.getKey("B"))}
                    </b>
                </section>
            );
        }
        return toString(block);
    }

    private handleAccessBitsEditor = (event: React.MouseEvent<HTMLElement>) => {
        const row = event.currentTarget.closest("tr");
        if (row === null) { return; }
        const sectorIndex = Number.parseInt(row.dataset.sector!, 10);
        const blockIndex = Number.parseInt(row.dataset.block!, 10);
        this.setState({
            isOpenAccessBitsEditorModal: true,
            sectorIndex,
            blockIndex,
        });
    }

    private handleUpdateBlock = (block: Buffer | AccessControlBlock) => {
        let payload;
        if (Buffer.isBuffer(block)) {
            payload = block;
        } else if (block instanceof AccessControlBlock) {
            payload = block.block;
        } else {
            return;
        }
        this.props.onChange(
            this.props.card.setBlock(
                this.state.sectorIndex,
                this.state.blockIndex,
                payload,
            ),
        );
    }
}
