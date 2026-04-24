import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

import AuthenticatedRoute from "@/components/auth/AuthenticatedRoute";
import { Image } from "expo-image";
import { Asset, getAssetsAsync } from "expo-media-library";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ModalScreen() {
  const PAGE_SIZE = 48;
  const [assets, setAssets] = useState<Asset[]>([]);
  const endCursorRef = useRef<string | undefined>(undefined);
  const hasNextPageRef = useRef(true);
  const isLoadingMoreRef = useRef(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const getAlbums = useCallback(async (loadMore = false) => {
    if (isLoadingMoreRef.current) return;
    if (loadMore && !hasNextPageRef.current) return;

    try {
      isLoadingMoreRef.current = true;

      const albumAssets = await getAssetsAsync({
        mediaType: ["photo"],
        sortBy: "creationTime",
        first: PAGE_SIZE,
        after: loadMore ? endCursorRef.current : undefined,
      });

      endCursorRef.current = albumAssets.endCursor ?? undefined;
      hasNextPageRef.current = albumAssets.hasNextPage;
      setAssets((prev) =>
        loadMore ? [...prev, ...albumAssets.assets] : albumAssets.assets,
      );
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, []);

  // Load assets from media library
  useEffect(() => {
    getAlbums();
  }, [getAlbums]);

  console.log("assets", assets.length);

  return (
    <AuthenticatedRoute>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={assets}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setSelectedAsset(item)}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ flex: 1, aspectRatio: 1, borderRadius: 5 }}
            />
          </Pressable>
        )}
        initialNumToRender={20}
        onEndReachedThreshold={1}
        onEndReached={() => {
          getAlbums(true);
        }}
        numColumns={4}
        columnWrapperStyle={{ gap: 10 }}
      />

      {/* Media Preview Modal */}
      <Modal
        visible={!!selectedAsset}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedAsset(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedAsset(null)}
          >
            <SymbolView
              name="xmark.circle.fill"
              size={30}
              type="hierarchical"
              tintColor="white"
              fallback={
                <MaterialIcons name="close" size={30} color="white" />
              }
            />
          </TouchableOpacity>
          {selectedAsset && (
            <Image
              source={{ uri: selectedAsset.uri }}
              style={styles.fullImage}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </AuthenticatedRoute>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
