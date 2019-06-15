import AsyncStorage from "@react-native-community/async-storage";
import uuid from "uuid/v4";

export const set = (key, value) => AsyncStorage.setItem(key, value);
export const get = key => AsyncStorage.getItem(key);

export const getUserId = async () => {
  const stored = await get("userId");
  if (stored) return stored;
  const userId = uuid();
  await set("userId", userId);
  return userId;
};
