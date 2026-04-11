import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

interface QRCodeButtonProps {
  handleOpenQrCode: () => void;
}

const QRCodeButton = ({ handleOpenQrCode }: QRCodeButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handleOpenQrCode}
      style={{
        width: 200,
        alignItems: "center",
        alignSelf: "center",
        padding: 6,
        borderWidth: 3,
        borderRadius: 10,
        borderStyle: "dashed",
        borderColor: "white",
      }}
    >
      <IconSymbol name="qrcode" color="white" size={40} />
      <ThemedText style={{ color: "white" }}>QR Code Detected</ThemedText>
    </TouchableOpacity>
  );
};

export default QRCodeButton;
