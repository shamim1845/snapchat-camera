import { Colors } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraMode } from "expo-camera";
import { Image } from "expo-image";
import { Asset, getAssetsAsync } from "expo-media-library";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface MainRowActionsProps {
  handleTakePicture: () => void;
  cameraMode: CameraMode;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainRowActions({
  handleTakePicture,
  cameraMode,
  isRecording,
  setIsRecording,
}: MainRowActionsProps) {
  const PAGE_SIZE = 8;
  const [assets, setAssets] = useState<Asset[]>([]);
  const endCursorRef = useRef<string | undefined>(undefined);
  const hasNextPageRef = useRef(true);
  const isLoadingMoreRef = useRef(false);

  const getAlbums = useCallback(async (loadMore = false) => {
    if (isLoadingMoreRef.current) return;
    if (loadMore && !hasNextPageRef.current) return;

    try {
      isLoadingMoreRef.current = true;
      // const fetchedAlbums = await getAlbumsAsync();
      // console.log("Albums:", JSON.stringify(fetchedAlbums, null, 2));

      const albumAssets = await getAssetsAsync({
        // album: fetchedAlbums[0],
        mediaType: ["photo"],
        sortBy: "creationTime",
        first: PAGE_SIZE,
        after: loadMore ? endCursorRef.current : undefined,
      });

      // console.log(
      //   "Assets in first album:",
      //   JSON.stringify(albumAssets.assets.length, null, 2),
      // );
      endCursorRef.current = albumAssets.endCursor ?? undefined;
      hasNextPageRef.current = albumAssets.hasNextPage;
      setAssets((prev) =>
        loadMore ? [...prev, ...albumAssets.assets] : albumAssets.assets,
      );
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, []);

  useEffect(() => {
    getAlbums();
  }, [getAlbums]);

  console.log("assets", assets.length);

  return (
    <View style={styles.container}>
      {/* Media Library */}
      <View style={styles.sideContainer}>
        <FlatList
          data={assets}
          inverted
          style={styles.sideScroller}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.uri }}
              style={{ width: 40, height: 40, borderRadius: 5 }}
            />
          )}
          initialNumToRender={4}
          onEndReachedThreshold={2}
          onEndReached={() => {
            getAlbums(true);
          }}
          horizontal
          contentContainerStyle={styles.assetsContent}
        />
      </View>

      {/* Camera action */}
      <View style={styles.cameraContainer}>
        <TouchableOpacity
          onPress={() => {
            if (cameraMode === "picture") {
              handleTakePicture();
            } else {
              setIsRecording(!isRecording);
            }
          }}
        >
          <SymbolView
            name={
              cameraMode === "picture"
                ? "circle"
                : isRecording
                  ? "record.circle"
                  : "circle.circle"
            }
            size={90}
            type="hierarchical"
            tintColor={isRecording ? Colors.light.snapPrimary : "white"}
            animationSpec={{
              effect: {
                type: isRecording ? "pulse" : "bounce",
              },
              repeating: isRecording,
            }}
            fallback={
              <MaterialIcons
                name={
                  cameraMode === "picture"
                    ? "lens-blur"
                    : isRecording
                      ? "fiber-manual-record"
                      : "radio-button-unchecked"
                }
                size={90}
                color={
                  cameraMode === "video" && isRecording
                    ? Colors.light.snapPrimary
                    : "white"
                }
              />
            }
          />
        </TouchableOpacity>
      </View>

      {/* Tools */}
      <View style={styles.sideContainer}>
        <ScrollView
          horizontal
          style={styles.sideScroller}
          contentContainerStyle={styles.toolsContent}
          showsHorizontalScrollIndicator={false}
        >
          {[0, 1, 2, 3].map((i) => (
            <SymbolView
              key={i}
              name="face.dashed"
              size={40}
              type="hierarchical"
              tintColor={"white"}
              fallback={<MaterialIcons name="face" size={40} color="white" />}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 45,
    height: 100,
    gap: 12,
  },
  sideContainer: {
    width: 120,
    minWidth: 120,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sideScroller: {
    width: "100%",
  },
  assetsContent: {
    gap: 6,
    alignItems: "center",
  },
  toolsContent: {
    gap: 2,
    alignItems: "center",
  },
  cameraContainer: {
    width: 100,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
