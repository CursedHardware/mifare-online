import { connectRouter } from "connected-react-router";
import { combineReducers, Reducer } from "redux";

import { History } from "history";
import mifare from "./mifare";

declare type ReducerState<T> = T extends Reducer<infer S> ? S : never;

export const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    mifare,
});

export type IRootState = ReducerState<ReturnType<typeof createRootReducer>>;
