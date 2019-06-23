import { combineReducers } from "redux";

import user from "./user/reducer.js";
import videos from "./videos/reducer.js";

export default combineReducers({ user, videos });
