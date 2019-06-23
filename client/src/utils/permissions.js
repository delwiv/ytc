import { PermissionsAndroid } from "react-native";

export async function requestWritePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "YTC",
        message:
          "YTC needs to write on your external storage to download files",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can download files");
      return Promise.resolve();
    } else {
      console.log("Permission denied");
      return Promise.reject("denied");
    }
  } catch (err) {
    console.warn(err);
  }
}
