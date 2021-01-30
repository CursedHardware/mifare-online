import { ConnectedRouter } from "connected-react-router";
import _ from "lodash";
import React from "react";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import "./Entry.scss";
import { history, store } from "./store";

import Header from "components/Header";
import Help from "components/Help";
import MifareAccessBits from "components/MifareAccessBits";
import MifareEditor from "components/MifareEditor";

import "bootstrap/dist/css/bootstrap.css";

const routes: Record<string, React.ComponentType<any>> = {
    "/mifare/editor": MifareEditor,
    "/mifare/access-bits": MifareAccessBits,
    "/mifare/help": Help,
};

export const Entry = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <>
                <Header />
                <Switch>
                    {_.map(routes, (Component, path) => (
                        <Route
                            key={path}
                            path={path}
                            component={Component}
                        />
                    ))}
                    <Redirect to="/mifare/editor" />
                </Switch>
            </>
        </ConnectedRouter>
    </Provider>
);
