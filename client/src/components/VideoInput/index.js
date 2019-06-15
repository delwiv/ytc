import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import {API_URL} from 'react-native-dotenv'

const sendUrl = url =>
  fetch(`${API_URL}/api/video`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ url })
  });
export default () => {
  const [url, setUrl] = useState("");
  return (
    <>
      <TextInput
        label="URL Bitch"
        value={url}
        onChangeText={setUrl}
        placeholder="Enter a YouTube URL"
      />
      <Button mode="contained" onPress={() => sendUrl(url)}>
        GO {API_URL}
      </Button>
    
    </>
  );
};
