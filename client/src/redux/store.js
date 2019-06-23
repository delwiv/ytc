import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";

import api from "../utils/api";
import rootReducer from "./rootReducer";

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(thunk.withExtraArgument(api)))
);

export default store;
