import { API_URL } from "react-native-dotenv";
import qs from "query-string";

const parseResponse = async data => {
  try {
    const result = await data.json();
    return result;
  } catch (error) {
    throw new Error("request-failed", error.message);
  }
};

const makeRequest = ({ route, method, data }) =>
  fetch(`${API_URL}/api${route}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method,
    body: data && JSON.stringify(data)
  }).then(parseResponse);

export default {
  get: (route, data) => {
    const query = data ? `?${qs.stringify(data)}` : "";
    return makeRequest({ route: route + query, method: "GET" });
  },
  post: (route, data) => makeRequest({ route, data, method: "POST" })
};
