import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button } from "react-native-paper";

export default ({ sendUrl }) => {
  const [url, setUrl] = useState("");
  return (
    <View style={{ flexDirection: "row" }}>
      <TextInput
        label="URL Bitch"
        value={url}
        onChangeText={setUrl}
        placeholder="Enter a YouTube URL"
        style={{ flex: 1 }}
      />
      <Button
        style={{
          //padding: 15,
          //flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
        mode="contained"
        onPress={() => sendUrl(url)}
      >
        GO
      </Button>
    </View>
  );
};
