import React from "react";
import { Col, Container } from "reactstrap";
import { AccessControlBlock } from "utils/Mifare/ACBlock";
import { AccessBitsEditor } from "./Editor";

interface IState {
    block: AccessControlBlock;
}

class MifareAccessBits extends React.Component<{}, IState> {
    public state: IState = {
        block: new AccessControlBlock(),
    };

    public render() {
        return (
            <Container>
                <Col>
                    <AccessBitsEditor
                        block={this.state.block}
                        onChange={(block) => this.setState({ block })}
                    />
                </Col>
            </Container>
        );
    }
}

export default MifareAccessBits;
