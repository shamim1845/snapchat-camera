import { IconSymbol } from "@/components/ui/icon-symbol";
import { CameraMode } from "expo-camera";
import { Link } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

// constants
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
          onPress={() => {
            setCameraMode("picture");
          }}
        >
          <ThemedText
            style={
              cameraMode === "picture"
                ? styles.activeButton
                : styles.deactiveButton
            }
          >
            Snap
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCameraMode("video");
          }}
        >
          <ThemedText
            style={
              cameraMode === "video"
                ? styles.activeButton
                : styles.deactiveButton
            }
          >
            Video
          </ThemedText>
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
    fontWeight: "bold",
    transitionTimingFunction: "ease-in-out",
    transitionProperty: "font-weight",
    transitionDuration: "200ms",
  },
  deactiveButton: {
    fontWeight: "100",
    transitionTimingFunction: "ease-in-out",
    transitionProperty: "font-weight",
    transitionDuration: "200ms",
  },
});
