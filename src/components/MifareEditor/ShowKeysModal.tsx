import _ from "lodash";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import style from "./index.scss";

interface IProps {
    keys: string[];

    open: boolean;
    onToggle(): void;
}

const ShowKeysModal: React.SFC<IProps> = (props) => (
    <Modal isOpen={props.open} toggle={props.onToggle} className={style["show-key-modal"]}>
        <ModalHeader toggle={props.onToggle}>
            Show Keys
        </ModalHeader>
        <ModalBody>
            {_.map(props.keys, (key) => (
                <code key={key}>{key}</code>
            ))}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={props.onToggle}>Close</Button>
        </ModalFooter>
    </Modal>
);

export default ShowKeysModal;
