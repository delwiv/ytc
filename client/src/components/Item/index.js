import React from "react";
import { Linking, View, Image } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

import {
  Surface,
  ProgressBar,
  Card,
  Text,
  Title,
  IconButton
} from "react-native-paper";

const Item = ({
  thumb = "",
  status,
  progress = 0,
  title,
  download,
  _id,
  video,
  audio
}) => {
  const color = status === "downloading" ? "blue" : "green";
  const onClick = type => {
    if (type === "audio") {
      if (audio) {
        RNFetchBlob.android
          .actionViewIntent(audio, "audio/m4a")
          .catch(console.error);
      } else {
        download({ videoId: _id, type, title });
      }
    } else if (type === "video") {
      if (video) {
        RNFetchBlob.android.actionViewIntent(video, "video/webm");
      } else {
        download({ videoId: _id, type, title });
      }
    }
  };
  return (
    <Card>
      <Card.Cover
        source={
          thumb ? { uri: thumb } : require("./youtube_social_squircle_red.png")
        }
      />
      <Card.Content>
        <Title>{title}</Title>
        <Text>Status : {status}</Text>
        <ProgressBar progress={progress} color={color} />
        <Surface
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <IconButton
            onPress={() => onClick("video")}
            color={video ? "green" : "orange"}
            icon="videocam"
          />
          <IconButton
            onPress={() => onClick("audio")}
            color={audio ? "green" : "orange"}
            icon="audiotrack"
          />
        </Surface>
      </Card.Content>
    </Card>
  );
};

export default Item;
