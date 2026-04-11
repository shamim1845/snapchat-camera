import { CameraType, FlashMode } from "expo-camera";
import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

interface CameraToolsProps {
  cameraZoom: number;
  setCameraZoom: Dispatch<SetStateAction<number>>;
  cameraFlash: FlashMode;
  setCameraFlash: Dispatch<SetStateAction<FlashMode>>;
  cameraTorch: boolean;
  setCameraTorch: Dispatch<SetStateAction<boolean>>;
  cameraFacing: CameraType;
  setCameraFacing: Dispatch<SetStateAction<CameraType>>;
}
const CameraTools = ({
  cameraZoom,
  setCameraZoom,
  cameraFlash,
  setCameraFlash,
  cameraTorch,
  setCameraTorch,
  cameraFacing,
  setCameraFacing,
}: CameraToolsProps) => {
  return (
    <View style={styles.container}>
      {/* Torch */}
      <TouchableOpacity
        style={styles.directionRow}
        onPress={() => setCameraTorch((prev) => !prev)}
      >
        <ThemedText>Torch {cameraTorch === true ? "On" : "Of"} </ThemedText>
        <IconSymbol
          name={cameraTorch ? "flashlight.off.circle" : "flashlight.on.circle"}
          color="white"
          size={40}
        />
      </TouchableOpacity>

      {/* Flash */}
      <TouchableOpacity
        style={styles.directionRow}
        onPress={() =>
          setCameraFlash((prev) =>
            prev === "auto" ? "on" : prev === "on" ? "off" : "auto",
          )
        }
      >
        <ThemedText>
          Flash{" "}
          {cameraFlash === "auto" ? "Auto" : cameraFlash === "on" ? "On" : "Of"}
        </ThemedText>
        <IconSymbol
          name={
            cameraFlash === "auto"
              ? "flashlight.slash.circle"
              : cameraFlash === "on"
                ? "flashlight.on.circle"
                : "flashlight.off.circle"
          }
          color="white"
          size={40}
        />
      </TouchableOpacity>

      {/* Zoom */}
      <TouchableOpacity
        style={styles.directionRow}
        onPress={() => setCameraZoom((prev) => (prev < 1 ? prev + 0.1 : prev))}
      >
        <ThemedText>Zoom In</ThemedText>
        <IconSymbol name="plus.magnifyingglass" color="white" size={40} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.directionRow}
        onPress={() => setCameraZoom((prev) => (prev > 0 ? prev - 0.1 : prev))}
      >
        <ThemedText>Zoom Out</ThemedText>
        <IconSymbol name="minus.magnifyingglass" color="white" size={40} />
      </TouchableOpacity>

      {/* Facing */}
      <TouchableOpacity
        style={styles.directionRow}
        onPress={() =>
          setCameraFacing((prev) => (prev === "back" ? "front" : "back"))
        }
      >
        <ThemedText>{cameraFacing === "back" ? "Back" : "Front"} </ThemedText>
        <IconSymbol name="minus.magnifyingglass" color="white" size={40} />
      </TouchableOpacity>
    </View>
  );
};

export default CameraTools;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "30%",
    right: 10,
    gap: 10,
    zIndex: 1,
  },
  directionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
});
