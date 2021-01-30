import { loadMifare, updateMifare } from "actions/mifare";
import { produce } from "immer";
import { reducerWithInitialState } from "typescript-fsa-reducers";

interface IState {
    blocks?: Buffer;
}

const defaultState: IState = {
    blocks: undefined,
};

export default reducerWithInitialState(defaultState)
    .case(loadMifare.async.failed, (state) => produce(state, (draft) => {
        draft.blocks = undefined;
    }))
    .case(loadMifare.async.done, (state, { result }) => produce(state, (draft) => {
        draft.blocks = result;
    }))
    .case(updateMifare, (state, blocks) => produce(state, (draft) => {
        draft.blocks = Buffer.from(blocks);
    }));
