import { setUserId, setUserIdActions } from "./actions";

export default (state = {}, action) => {
  switch (action.type) {
    case setUserIdActions.requested:
      return {
        ...state,
        setting: true
      };
    case setUserIdActions.failed:
      return {
        ...state,
        setting: false,
        error: action.payload
      };
    case setUserIdActions.succeeded:
      return {
        ...state,
        setting: false,
        error: null,
        id: action.payload
      };
    default:
      return state;
  }
};
