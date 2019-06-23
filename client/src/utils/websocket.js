import io from "socket.io-client";
import { API_URL } from "react-native-dotenv";

import { getUserId } from "./storage";

export default socket = io(API_URL);

const registerUser = userId => socket.emit("registerUser", { userId });

socket.on("connect", async () => {
  const userId = await getUserId();
  registerUser(userId);
});
