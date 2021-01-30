import ready from "domready";
import React from "react";
import ReactDOM from "react-dom";

import { Entry } from "./Entry";

const insertBody = (container: Element) => {
    document.body = document.createElement("body");
    document.body.appendChild(container);
};

ready(() => {
    const element = (
        <Entry />
    );
    const container = document.createElement("main");
    insertBody(container);
    ReactDOM.render(element, container);
});
