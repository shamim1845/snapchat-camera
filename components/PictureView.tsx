import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import React from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface PictureViewProps {
    picture: string;
    setPicture: React.Dispatch<React.SetStateAction<string | null>>;
}

const PictureView = ({ picture, setPicture }: PictureViewProps) => {
    return (
        <View>
            {/* Control Buttons RightSide */}
            <View style={{
                position: 'absolute',
                top: 50,
                right: 30,
                zIndex: 1,
                gap: 20,
            }}>
                <TouchableOpacity onPress={async () => {
                    await saveToLibraryAsync(picture)
                    Alert.alert('Picture saved to library')
                }}>
                    <IconSymbol name="arrow.down" color="white" size={30} />
                </TouchableOpacity>

                {/* upload button */}
                <TouchableOpacity onPress={async () => {
                    await shareAsync(picture)
                }} >
                    <IconSymbol name="square.and.arrow.up" color="white" size={30} />
                </TouchableOpacity>

            </View>
            {/* Control Buttons LeftSide */}
            <View style={{
                position: 'absolute',
                top: 50,
                left: 30,
                zIndex: 1,
                gap: 20,
            }}>


                {/* close button */}
                <TouchableOpacity onPress={() => setPicture(null)} >
                    <IconSymbol name="xmark.circle" color="white" size={30} />
                </TouchableOpacity>

            </View>

            {/* Image */}
            <Image
                source={{ uri: picture }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />

        </View>
    )
}

export default PictureView