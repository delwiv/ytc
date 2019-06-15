import io from "socket.io-client";
import { API_URL } from "react-native-dotenv";

export default () => {
  const socket = io(API_URL);
  socket.on("connect", () => {
    socket.send("hello");
  });
};
