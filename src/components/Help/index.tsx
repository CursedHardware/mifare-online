import React from "react";
import Markdown from "react-markdown";
import { Container } from "reactstrap";

import payload from "./help.md";
import style from "./index.scss";

class Help extends React.PureComponent {
    public render() {
        return (
            <Container>
                <Markdown
                    className={style.markdown}
                    source={payload}
                />
            </Container>
        );
    }
}

export default Help;
