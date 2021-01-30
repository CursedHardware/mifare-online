import _ from "lodash";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { MifareCard } from "utils/Mifare";
import { FileType, getDownloadableFileName, saveFile } from "utils/Mifare/Store";

interface IProps {
    card: MifareCard;

    open: boolean;
    onToggle(): void;
}

class SaveFileModal extends React.Component<IProps> {
    public render() {
        const types: Record<FileType, string> = {
            [FileType.MFD]: "Mifare Dump (.mfd)",
            [FileType.EML]: "Proxmark3 Dump (.eml)",
            [FileType.MCT]: "Mifare Classic Tool (.mct)",
            [FileType.Text]: "Text - GBK Encoded (.txt)",
        };
        return (
            <Modal isOpen={this.props.open} toggle={this.props.onToggle}>
                <ModalHeader toggle={this.props.onToggle}>
                    Save File Type
                </ModalHeader>
                <ModalBody>
                    {_.map(types, (name, type: FileType) => (
                        <Button
                            key={type}
                            block
                            onClick={() => this.handleSaveFile(type)}
                        >
                            {name}
                        </Button>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.onToggle}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }

    private handleSaveFile = (type: FileType) => {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(saveFile(this.props.card, type));
        element.download = getDownloadableFileName(this.props.card, type);
        element.click();
    }
}

export default SaveFileModal;
