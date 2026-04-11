import BottomRowTools from "@/components/BottomRowTools";
import CameraTools from "@/components/CameraTools";
import MainRowActions from "@/components/MainRowActions";
import QRCodeButton from "@/components/QRCodeButton";
import {
  BarcodeScanningResult,
  CameraMode,
  CameraType,
  CameraView,
  FlashMode,
} from "expo-camera";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const [isRecording, setIsRecording] = useState(false);
  const [qrCodeDetected, setQrCodeDetected] = useState<string>("");
  const [isBrowsing, setIsBrowsing] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQrDataRef = useRef<string>("");
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const [cameraZoom, setCameraZoom] = useState<number>(0);
  const [cameraTorch, setCameraTorch] = useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = useState<FlashMode>("auto");
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

  // Track AppState
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasInBackground =
        appStateRef.current === "inactive" ||
        appStateRef.current === "background";

      if (isBrowsing && wasInBackground && nextAppState === "active") {
        // Android custom tabs usually return control by app state transition.
        setIsBrowsing(false);
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isBrowsing]);

  // Handlers
  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync();
        console.log("Picture taken:", result);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const handleOpenQrCode = async () => {
    setIsBrowsing(true);

    // Open the QR code in the browser
    try {
      const browserResult = await openBrowserAsync(qrCodeDetected, {
        presentationStyle: WebBrowserPresentationStyle.FORM_SHEET,
      });
      console.log("Browser result:", browserResult);

      // ios close signals
      if (browserResult.type === "dismiss" || browserResult.type === "cancel") {
        setIsBrowsing(false);
      }
    } catch (error) {
      console.error("Error opening QR code:", error);
      setIsBrowsing(false);
    }
  };

  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (!scanningResult.data) return;

    // Barcode callbacks fire many times per second while the code stays in view.
    // Updating state on every callback re-renders CameraView and can flash a black frame.
    if (lastQrDataRef.current !== scanningResult.data) {
      lastQrDataRef.current = scanningResult.data;
      setQrCodeDetected(scanningResult.data);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      lastQrDataRef.current = "";
      setQrCodeDetected("");
    }, 1000);
  };

  // We don't want to show anything while browsing
  if (isBrowsing) return <></>;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CameraView
        ref={cameraRef}
        mode={cameraMode}
        zoom={cameraZoom}
        flash={cameraFlash}
        enableTorch={cameraTorch}
        facing={cameraFacing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
        style={{
          flex: 1,
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          {/* Keep overlay mounted so the native preview does not restart when QR appears */}
          <View
            pointerEvents={qrCodeDetected ? "box-none" : "none"}
            style={[
              StyleSheet.absoluteFillObject,
              {
                justifyContent: "center",
                alignItems: "center",
                opacity: qrCodeDetected ? 1 : 0,
              },
            ]}
          >
            <QRCodeButton handleOpenQrCode={handleOpenQrCode} />
          </View>

          {/* Camera Tools */}
          <CameraTools
            cameraZoom={cameraZoom}
            setCameraZoom={setCameraZoom}
            cameraFlash={cameraFlash}
            setCameraFlash={setCameraFlash}
            cameraTorch={cameraTorch}
            setCameraTorch={setCameraTorch}
            cameraFacing={cameraFacing}
            setCameraFacing={setCameraFacing}
          />

          {/* Main Row Actions */}
          <MainRowActions
            cameraMode={cameraMode}
            handleTakePicture={handleTakePicture}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
          <BottomRowTools
            cameraMode={cameraMode}
            setCameraMode={setCameraMode}
          />
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
