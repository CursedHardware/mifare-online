import _ from "lodash";
import React from "react";
import { Popover, PopoverBody } from "reactstrap";
import { AccessConditionDataBlock, AccessConditionSectorTrailer } from "utils/Mifare/ACBits";

interface IProps {
    index: number;
    bits: number;
}

interface IState {
    isOpen: boolean;
}

export class AccessBitsPopover extends React.Component<IProps, IState> {
    public state: IState = { isOpen: false };

    private target = React.createRef<HTMLElement>();

    public render() {
        let popover;
        if (this.state.isOpen && this.target.current) {
            popover = (
                <Popover
                    placement="right"
                    isOpen
                    target={this.target.current}
                    toggle={this.handleToggle}
                    trigger="legacy"
                >
                    <PopoverBody>
                        {this.props.index < 3
                            ? this.makeDataBlock(this.props.bits)
                            : this.makeSectorTrailer(this.props.bits)}
                    </PopoverBody>
                </Popover>
            );
        }
        return (
            <>
                <span ref={this.target} onClick={this.handleToggle}>
                    {_.padStart(this.props.bits.toString(2), 3, "0")}
                </span>
                {popover}
            </>
        );
    }

    private makeDataBlock = (bits: number) => {
        const block = new AccessConditionDataBlock(bits);
        const fields = {
            "Read": block.read,
            "Write": block.write,
            "Increment": block.increment,
            "Decrement, Transfer, Restore": block.decrement,
            "Application": block.application,
        };
        return this.makeDetailsList(fields);
    }

    private makeSectorTrailer = (bits: number) => {
        const block = new AccessConditionSectorTrailer(bits);
        const fields = {
            "Read for Key A": block.readKeyA,
            "Write for Key A": block.writeKeyA,
            "Read for Access Bits": block.readAccessBits,
            "Write for Access Bits": block.writeAccessBits,
            "Read for Key B": block.readKeyB,
            "Write for Key B": block.writeKeyB,
            "Remark": block.remark,
        };
        return this.makeDetailsList(fields, ["Remark"]);
    }

    private makeDetailsList = (
        fields: Record<string, string | string[] | undefined>,
        ignoreFields?: string[],
    ) => (
            <dl>
                {_.map(fields, (value, name) => {
                    let details = value || "never";
                    if (_.isArray(value)) {
                        details = _.map(value, (item) => `${item} Key`).join(" / ");
                    } else if (_.isNil(value) && _.includes(ignoreFields, name)) {
                        return null;
                    }
                    return (
                        <React.Fragment key={name}>
                            <dt>{name}</dt>
                            <dd>{details}</dd>
                        </React.Fragment>
                    );
                })}
            </dl>
        )

    private handleToggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
