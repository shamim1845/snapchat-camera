import BottomRowTools from "@/components/BottomRowTools";
import { CameraMode, CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CameraView
        ref={cameraRef}
        mode={cameraMode}
        style={{
          flex: 1,
        }}
      >
        <BottomRowTools cameraMode={cameraMode} setCameraMode={setCameraMode} />
      </CameraView>
    </View>
  );
}
