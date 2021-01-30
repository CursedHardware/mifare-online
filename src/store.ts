import { routerMiddleware } from "connected-react-router";
import { createHashHistory } from "history";
import { AnyAction, applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware, { ThunkDispatch, ThunkMiddleware } from "redux-thunk";

import { createRootReducer, IRootState } from "./reducers";

export const history = createHashHistory();

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
    }
}

declare module "redux" {
    // tslint:disable-next-line:interface-name
    interface Dispatch<A = AnyAction>
        extends ThunkDispatch<IRootState, undefined, AnyAction> { }
}

const composeEnhancers = process.env.NODE_ENV === "production"
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    createRootReducer(history),
    composeEnhancers(
        applyMiddleware(
            routerMiddleware(history),
            thunkMiddleware as ThunkMiddleware<IRootState, AnyAction>,
        ),
    ),
);
