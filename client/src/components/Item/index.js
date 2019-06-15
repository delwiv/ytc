import React from "react";
import {
  Surface,
  ProgressBar,
  Card,
  Text,
  Title,
  IconButton
} from "react-native-paper";

const Item = props => {
  const { status, progress, title } = props;
  const color = status === "downloading" ? "blue" : "green";
  return (
    <Card>
      <Card.Content>
        <Title>{title}</Title>
        <Text>Status : {status}</Text>
        {status !== "converted" ? (
          <ProgressBar progress={progress / 100} color={color} />
        ) : (
          <Surface
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <IconButton icon="videocam" />
            <IconButton icon="audiotrack" />
          </Surface>
        )}
      </Card.Content>
    </Card>
  );
};

export default Item;
