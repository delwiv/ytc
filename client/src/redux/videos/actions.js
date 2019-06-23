import RNFetchBlob from "rn-fetch-blob";
import { API_URL } from "react-native-dotenv";

import buildActions from "../buildActions.js";
import { requestWritePermission } from "../../utils/permissions.js";

export const sendUrlActions = buildActions("SEND_URL");
export const getVideosActions = buildActions("GET_VIDEOS");
export const downloadActions = buildActions("DOWNLOAD");

export const updateItemStatusActions = buildActions("UPDATE_ITEM_STATUS");

export const updateItemStatus = payload => async dispatch => {
  // console.warn(payload);
  dispatch(updateItemStatusActions.request(payload));
  try {
    dispatch(updateItemStatusActions.succeed(payload));
    if (payload.status === "converted" && payload.progress === 1) {
      dispatch(download({ videoId: payload._id, type: "audio", autoDL: true }));
    }
  } catch (error) {
    console.error(error);
  }
};

export const download = ({ videoId, type, autoDL }) => async (
  dispatch,
  getState
) => {
  const userId = getState().user.id;
  const { title } = getState().videos.items[videoId];
  dispatch(downloadActions.request({ userId, videoId, type }));
  try {
    await requestWritePermission();
    const uri = `${API_URL}/api/${userId}/${type}/${videoId}`;
    const mime = type === "audio" ? "audio/m4a" : "video/webm";
    const path =
      type === "audio"
        ? `${RNFetchBlob.fs.dirs.MusicDir}/${title}.m4a`
        : `${RNFetchBlob.fs.dirs.MovieDir}/${title}.webm`;
    const data = await RNFetchBlob.config({
      path
      //  addAndroidDownloads: {
      //    useDownloadManager: true,
      //    notification: true,
      //    mime,
      //    description: title
      //    mediaScannable: true
      //  }
    })
      .fetch("GET", uri)
      .progress((received, total) => {
        dispatch(
          updateItemStatus({
            _id: videoId,
            status: `fetching_${type}`,
            progress: +(received / total).toFixed(2)
          })
        );
      })
      .catch(error => alert(JSON.stringify({ errorFetch: error.message })));
    const media = data.path();
    dispatch(
      updateItemStatus({
        _id: videoId,
        status: "fetched",
        progress: 1,
        [type]: media
      })
    );

    dispatch(downloadActions.succeed({ videoId }));
    if (!autoDL) {
      RNFetchBlob.android.actionViewIntent(media, mime);
    }
  } catch (error) {
    console.warn("errCatch", error.message);
    dispatch(downloadActions.fail(error));
  }
};

export const sendUrl = url => async (dispatch, getState, api) => {
  const userId = getState().user.id;
  dispatch(sendUrlActions.request({ userId, url }));
  try {
    const data = await api.post(`/${userId}/video`, { url });

    dispatch(sendUrlActions.succeed(data.video));
  } catch (error) {
    dispatch(sendUrlActions.fail(error));
  }
};

export const getVideos = () => async (dispatch, getState, api) => {
  const getPaths = title => ({
    audio: `${RNFetchBlob.fs.dirs.MusicDir}/${title}.m4a`,
    video: `${RNFetchBlob.fs.dirs.MovieDir}/${title}.webm`
  });
  dispatch(getVideosActions.request());
  try {
    const userId = getState().user.id;
    const data = await api.get(`/${userId}/videos`);
    const videos = {};
    for (const cur of data.videos) {
      const { audio, video } = getPaths(cur.title);
      videos[cur._id] = {
        ...cur,
        audio: (await RNFetchBlob.fs.exists(audio)) ? audio : null,
        video: (await RNFetchBlob.fs.exists(video)) ? video : null
      };
    }
    dispatch(getVideosActions.succeed(videos));
  } catch (error) {
    console.error(error);
    dispatch(getVideosActions.fail(error));
  }
};
