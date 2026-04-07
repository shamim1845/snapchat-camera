import { IconSymbol } from "@/components/ui/icon-symbol";
import { CameraMode } from "expo-camera";
import { Link } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

const ICON_SIZE = 20;

export default function BottomRowTools({
  cameraMode,
  setCameraMode,
}: {
  cameraMode: CameraMode;
  setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}) {
  return (
    <View style={styles.container}>
      <Link href="/media-library" asChild>
        <Pressable style={styles.button} onPress={() => {}}>
          <IconSymbol name="photo.stack" color="white" size={ICON_SIZE} />
        </Pressable>
      </Link>

      <View style={styles.directionRowItemsCenter}>
        <TouchableOpacity
          style={cameraMode === "picture" ? styles.activeButton : {}}
          onPress={() => {
            setCameraMode("picture");
          }}
        >
          <ThemedText>Snap</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: cameraMode === "video" ? "white" : "transparent",
          }}
          onPress={() => {
            setCameraMode("video");
          }}
        >
          <ThemedText>Video</ThemedText>
        </TouchableOpacity>
      </View>

      <Pressable style={styles.button} onPress={() => {}}>
        <IconSymbol name="magnifyingglass" color="white" size={ICON_SIZE} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 5,
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: ICON_SIZE * 2,
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    justifyContent: "center",
    alignItems: "center",
  },

  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  activeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
