import { getUserId } from "../../utils/storage.js";
import buildActions from "../buildActions.js";

export const setUserIdActions = buildActions("SET_USER_ID");

export const setUserId = () => async dispatch => {
  dispatch(setUserIdActions.request());
  try {
    const userId = await getUserId();
    dispatch(setUserIdActions.succeed(userId));
  } catch (error) {
    dispatch(setUserIdActions.fail(error));
  }
};
