import { reducers, rootInitialState } from "./state/reducers";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

export const store = createStore(
  reducers,
  rootInitialState,
  composeWithDevTools()
);
