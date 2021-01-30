import { AccessBitsEditor } from "components/MifareAccessBits/Editor";
import _ from "lodash";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { AccessControlBlock } from "utils/Mifare/ACBlock";

interface IProps {
    block: AccessControlBlock;

    onChange(block: AccessControlBlock): void;
    onToggle(): void;
}

export const AccessBitsModal: React.SFC<IProps> = ({ onToggle, onChange, block }) => (
    <Modal isOpen toggle={onToggle} size="lg">
        <ModalHeader toggle={onToggle}>Access Bits Editor</ModalHeader>
        <ModalBody>
            <AccessBitsEditor
                block={block}
                onChange={onChange}
            />
        </ModalBody>
    </Modal>
);
