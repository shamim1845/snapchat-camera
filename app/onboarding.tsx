import { Alert, Button, StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { FIRST_OPEN_KEY } from "@/hooks/useFirstTimeOpen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { usePermissions } from "expo-media-library";
import { router } from "expo-router";

export default function OnBoardingScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    usePermissions();

  async function handleContinue() {
    const allPermissionsGranted = await requestAllPermissions();
    if (allPermissionsGranted) {
      console.log("All permissions granted");
      router.replace("/(tabs)");
    } else {
      Alert.alert("To continue please provide permissions in settings");
    }
  }

  async function requestAllPermissions() {
    // Request camera permission
    const cameraStatus = await requestCameraPermission();
    if (!cameraStatus.granted) {
      Alert.alert("Error", "Camera permission is required");
      return false;
    }

    // Request microphone permission
    const microphoneStatus = await requestMicrophonePermission();
    if (!microphoneStatus.granted) {
      Alert.alert("Error", "Microphone permission is required");
      return false;
    }

    // Request media library permission
    const mediaLibraryStatus = await requestMediaLibraryPermission();
    if (!mediaLibraryStatus.granted) {
      Alert.alert("Error", "Media library permission is required");
      return false;
    }

    // All permissions granted
    await AsyncStorage.setItem(FIRST_OPEN_KEY, "true");
    return true;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          name="camera.circle"
          size={250}
          color={Colors.dark.snapPrimary}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Snapchat Camera!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText>
        Welcome to friend! To provide the best experience, this app requires
        permissions for the following:
      </ThemedText>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Camera Permissions</ThemedText>
        <ThemedText>📷 For taking pictures</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Microphone Permissions</ThemedText>
        <ThemedText>🎙️For taking videos with audio</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Media Library Permissions</ThemedText>
        <ThemedText>🖼️ To save/view your amazing shots</ThemedText>
      </ThemedView>

      <Button title="Continue" onPress={handleContinue} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
