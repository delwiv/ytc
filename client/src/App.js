import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

import VideoInput from "./components/VideoInput";
import Item from "./components/Item";

import connectWS from "./utils/websocket";
import { getUserId } from "./utils/storage";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default class App extends Component {
  state = {
    items: [
      {
        _id: "5d04d9d58c257a6f4c9b5da2",
        url: "https://m.youtube.com/watch?v=nLpaOVVFlAM&t=33s",
        youtubeId: "nLpaOVVFlAM",
        progress: 100,
        status: "converted",
        title: "Kaamelott en Lego - La Botte Secrète 2",
        videoPath: "/tmp/ytc/video/Kaamelott en Lego - La Botte Secrète 2.webm",
        audioPath: "/tmp/ytc/audio/Kaamelott en Lego - La Botte Secrète 2.m4a"
      }
    ]
  };
  componentDidMount() {
    connectWS();
  }
  render() {
    return (
      <View>
        <Appbar>
          <Appbar.Content title="Converter" />
        </Appbar>
        <VideoInput />
        {this.state.items.map(Item)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
