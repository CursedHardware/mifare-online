import classNames from "classnames";
import _ from "lodash";
import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { toString } from "utils/BufferUtils";
import { AccessControlBlock } from "utils/Mifare/ACBlock";
import { DataBlockSelector, SectorTrailerSelector } from "./Selector";

import style from "./Editor.scss";

interface IProps {
    block: AccessControlBlock;
    onChange(block: AccessControlBlock): void;
}

interface IState {
    activeTab: number;
}

export class AccessBitsEditor extends React.Component<IProps, IState> {
    public state: IState = { activeTab: 0 };

    public render() {
        const accessBits = this.props.block.getAccessBits();
        return (
            <>
                <p>{toString(accessBits)}</p>
                <Nav tabs className={style["nav-tab"]}>
                    {this.makeTabs()}
                </Nav>
                {this.makeContent()}
            </>
        );
    }

    private makeTabs = () => _.map(_.range(0, 4), (index) => {
        const className = classNames({
            active: this.state.activeTab === index,
        });
        const handleClick = () => this.handleToggle(index);
        return (
            <NavItem key={index}>
                <NavLink className={className} onClick={handleClick}>
                    {index} Block
                </NavLink>
            </NavItem>
        );
    })

    private makeContent = () => {
        const { onChange, block } = this.props;
        const index = this.state.activeTab;
        const Selector = index < 3
            ? DataBlockSelector
            : SectorTrailerSelector;
        return (
            <Selector
                bits={block.getBits(index)}
                onChange={(bits: number) => onChange(block.setBits(index, bits))}
            />
        );
    }

    private handleToggle = (activeTab: number) => {
        if (this.state.activeTab === activeTab) { return; }
        this.setState({ activeTab });
    }
}
