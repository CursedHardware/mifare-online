import { loadMifare, updateMifare } from "actions/mifare";
import _ from "lodash";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { Alert, Button, Container, Row } from "reactstrap";
import { IRootState } from "reducers";
import { MifareCard } from "utils/Mifare";
import { MifareEditor } from "./Editor";
import style from "./index.scss";
import SaveFileModal from "./SaveFileModal";
import ShowKeysModal from "./ShowKeysModal";

interface IProps extends DispatchProp {
    blocks?: Buffer;
}

interface IState {
    isOpenShowKeys: boolean;
    isOpenSaveFile: boolean;
}

class ConnectedMifareEditor extends React.Component<IProps, IState> {
    public state: IState = {
        isOpenShowKeys: false,
        isOpenSaveFile: false,
    };

    public render() {
        const hidden = _.isNil(this.props.blocks);
        return (
            <Container>
                <Row className={style.toolbar}>
                    <Button
                        onClick={this.handleLoadFile}
                    >
                        Load File
                    </Button>
                    <Button
                        hidden={hidden}
                        onClick={this.handleSaveFileToggle}
                    >
                        Save File
                    </Button>
                    <Button
                        hidden={hidden}
                        onClick={this.handleShowKeysToggle}
                    >
                        Show Keys
                    </Button>
                </Row>
                {this.makeMifareEditor()}
            </Container>
        );
    }

    private makeMifareEditor = () => {
        if (_.isNil(this.props.blocks)) {
            return (
                <Alert color="warning">Please load mifare dump file.</Alert>
            );
        }
        const card = MifareCard.from(this.props.blocks);
        return (
            <Row>
                <MifareEditor
                    card={card}
                    onChange={this.handleUpdateCard}
                />
                <ShowKeysModal
                    keys={card.getKeys()}
                    open={this.state.isOpenShowKeys}
                    onToggle={this.handleShowKeysToggle}
                />
                <SaveFileModal
                    card={card}
                    open={this.state.isOpenSaveFile}
                    onToggle={this.handleSaveFileToggle}
                />
            </Row>
        );
    }

    private handleShowKeysToggle = () => {
        this.setState({ isOpenShowKeys: !this.state.isOpenShowKeys });
    }

    private handleSaveFileToggle = () => {
        this.setState({ isOpenSaveFile: !this.state.isOpenSaveFile });
    }

    private handleLoadFile = () => {
        const element = document.createElement("input");
        element.type = "file";
        element.addEventListener("change", () => {
            this.props.dispatch(loadMifare.action(_.first(element.files)));
        });
        element.click();
    }

    private handleUpdateCard = (card: MifareCard) => {
        this.props.dispatch(updateMifare(card.toCard()));
    }
}

const mapStateToProps = (state: IRootState) => ({
    blocks: state.mifare.blocks,
});

export default connect(mapStateToProps)(ConnectedMifareEditor);
