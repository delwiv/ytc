import React, { Component } from "react";
import { ScrollView, Platform, StyleSheet, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { connect } from "react-redux";

import VideoInput from "./components/VideoInput";
import Item from "./components/Item";

import { setUserId } from "./redux/user/actions";
import {
  sendUrl,
  getVideos,
  updateItemStatus,
  download
} from "./redux/videos/actions";
import websocket, { registerUser } from "./utils/websocket";

class App extends Component {
  async componentDidMount() {
    this.props.setUserId();
    this.websocket = websocket;
    this.websocket.on("itemProgress", this.props.updateItemStatus);
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.userId && this.props.userId) {
      this.props.getVideos();
    }
  }
  render() {
    const { sendUrl, items, download } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Appbar>
          <Appbar.Content title="Converter" />
        </Appbar>
        <VideoInput sendUrl={sendUrl} />
        <ScrollView>
          {Object.keys(items)
            .sort((a, b) => items[a].createdAt - items[b].createdAt)
            .map(key => (
              <Item download={download} key={key} {...items[key]} />
            ))}
        </ScrollView>
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

export default connect(
  state => ({
    items: state.videos.items,
    userId: state.user.id
  }),
  dispatch => ({
    setUserId: () => dispatch(setUserId()),
    getVideos: () => dispatch(getVideos()),
    updateItemStatus: progress => dispatch(updateItemStatus(progress)),
    download: params => dispatch(download(params)),
    sendUrl: params => dispatch(sendUrl(params))
  })
)(App);
