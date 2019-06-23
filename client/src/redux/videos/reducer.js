import {
  sendUrlActions,
  getVideosActions,
  updateItemStatusActions
} from "./actions";

const initialState = {
  sending: false,
  error: null,
  items: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case sendUrlActions.requested:
      return {
        ...state,
        sending: true
      };
    case sendUrlActions.failed:
      return {
        ...state,
        sending: false,
        error: action.payload
      };
    case sendUrlActions.succeeded:
      return {
        ...state,
        sending: false,
        error: null,
        items: {
          [action.payload._id]: action.payload,
          ...state.items
        }
      };
    case getVideosActions.requested:
      return {
        ...state,
        fetching: true
      };
    case getVideosActions.failed:
      return {
        ...state,
        fetching: false,
        error: action.payload
      };
    case getVideosActions.succeeded:
      return {
        ...state,
        sending: false,
        error: null,
        items: action.payload
      };
    case updateItemStatusActions.succeeded: {
      const { _id, ...payload } = action.payload;
      return {
        ...state,
        items: {
          ...state.items,
          [_id]: { ...state.items[_id], ...payload }
        }
      };
    }
    default:
      return state;
  }
};
