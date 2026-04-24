import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface VideoViewComponentProps {
    video: string;
    setVideo: React.Dispatch<React.SetStateAction<string | null>>;
}

const VideoViewComponent = ({ video, setVideo }: VideoViewComponentProps) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const videoViewRef = useRef<VideoView>(null);
    const player = useVideoPlayer(video, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
    })

    // track playing state
    useEffect(() => {
        const event = player.addListener("playingChange", ({ isPlaying }) => {
            setIsPlaying(isPlaying);
        })

        return () => {
            event.remove();
        }
    }, [player])

    return (
        <View>
            {/* Top Right Side Control Buttons */}
            <View style={{
                position: 'absolute',
                top: 50,
                right: 30,
                zIndex: 1,
                gap: 20,
            }}>
                {/* save button */}
                <TouchableOpacity onPress={async () => {
                    await saveToLibraryAsync(video)
                    Alert.alert('Video saved to library')
                }}>
                    <IconSymbol name="arrow.down" color="white" size={30} />
                </TouchableOpacity>

                {/* share button */}
                <TouchableOpacity onPress={async () => {
                    await shareAsync(video)
                }} >
                    <IconSymbol name="square.and.arrow.up" color="white" size={30} />
                </TouchableOpacity>

                {/* Play and Pause button */}
                <TouchableOpacity onPress={() => {
                    if (isPlaying) {
                        player.pause()
                    } else {
                        player.play()
                    }
                }} >
                    <IconSymbol name={isPlaying ? "pause" : "play"} color="white" size={30} />
                </TouchableOpacity>

            </View>

            {/* Top Left Side Control Buttons */}
            <View style={{
                position: 'absolute',
                top: 50,
                left: 30,
                zIndex: 1,
                gap: 20,
            }}>
                {/* close button */}
                <TouchableOpacity onPress={() => setVideo(null)} >
                    <IconSymbol name="xmark.circle" color="white" size={30} />
                </TouchableOpacity>

            </View>


            {/* video */}
            <VideoView
                ref={videoViewRef}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                player={player}
                allowsFullscreen
                nativeControls={true}
            />

        </View>
    )
}

export default VideoViewComponent