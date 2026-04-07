import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const FIRST_OPEN_KEY = "hasOpened";

export function useFirstTimeOpen() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstTime = async () => {
      setIsLoading(true);

      try {
        const hasOpened = await AsyncStorage.getItem(FIRST_OPEN_KEY);

        if (hasOpened === null) {
          // first time
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error("Error checking first time open:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstTime();
  }, []);

  return { isFirstTime, isLoading };
}
