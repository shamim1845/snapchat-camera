import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { usePermissions as useMediaLibraryPermissions } from "expo-media-library";
import { useEffect, useState } from "react";

export const FIRST_OPEN_KEY = "hasOpened";

export function useFirstTimeOpen() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [cameraPermission] = useCameraPermissions();
  const [microphonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission] = useMediaLibraryPermissions();

  useEffect(() => {
    const checkFirstTime = async () => {
      setIsLoading(true);

      try {
        const hasOpened = await AsyncStorage.getItem(FIRST_OPEN_KEY);

        if (
          hasOpened &&
          cameraPermission?.granted &&
          microphonePermission?.granted &&
          mediaLibraryPermission?.granted
        ) {
          setIsFirstTime(false);
        } else {
          // first time
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error("Error checking first time open:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstTime();
  }, [
    cameraPermission?.granted,
    microphonePermission?.granted,
    mediaLibraryPermission?.granted,
  ]);

  return { isFirstTime, isLoading };
}
