import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";

const sendUrl = url =>
  fetch(`http://localhost:3005/api/video`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ url })
  });
export default () => {
  const [url, setUrl] = useState("");
  const _setUrl = url => {
    return;
  };
  return (
    <>
      <TextInput
        label="URL Bitch"
        value={url}
        onChangeText={setUrl}
        placeholder="Enter a YouTube URL"
      />
      <Button mode="contained" onPress={() => sendUrl(url)}>
        GO
      </Button>
    </>
  );
};
