import _ from "lodash";
import { actionCreatorFactory } from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { loadFile } from "utils/Mifare/Store";

const create = actionCreatorFactory("MIFARE");
const createAsync = asyncFactory(create);

export const loadMifare = createAsync("LOAD_MIFARE", loadFile);

export const updateMifare = create<Buffer>("UPDATE_MIFARE");
