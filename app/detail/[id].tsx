import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const VerseItem = React.memo(({ item, onPlay, currentUrl, globalIsPlaying }: any) => {
  const isThisVerseActive = currentUrl === item.audio.primary;
  
  return (
    <View style={styles.verseBox}>
      <View style={styles.verseHeader}>
        <TouchableOpacity onPress={() => onPlay(item.audio.primary)}>
          <Ionicons 
            name={isThisVerseActive && globalIsPlaying ? "pause-circle" : "play-circle"} 
            size={36} 
            color="#2d6a4f" 
          />
        </TouchableOpacity>
        <View style={styles.numberCircle}>
          <Text style={styles.verseNumber}>{item.number.inSurah}</Text>
        </View>
      </View>
      <Text style={styles.arabicText}>{item.text.arab}</Text>
      <Text style={styles.latinText}>{item.text.transliteration.en}</Text>
      <Text style={styles.translationText}>{item.translation.id}</Text>
    </View>
  );
});

export default function DetailScreen() {
  const { id, title } = useLocalSearchParams();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // Inisialisasi player dengan URL kosong
  const player = useAudioPlayer(currentUrl);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    fetch(`https://api.quran.gading.dev/surah/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setDetail(json.data);
        setLoading(false);
      });
  }, [id]);

  // Efek untuk memutar audio secara otomatis ketika ayat dipilih (currentUrl berubah)
  useEffect(() => {
    if (currentUrl) {
      player.play();
    }
  }, [currentUrl, player]);

  const handlePlay = (url: string) => {
    // Jika user klik ayat yang sama
    if (currentUrl === url) {
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      // Jika user klik ayat baru
      setCurrentUrl(url); 
    }
  };

  const renderItem = useMemo(() => ({ item }: any) => (
    <VerseItem 
      item={item} 
      onPlay={handlePlay} 
      currentUrl={currentUrl}
      globalIsPlaying={status.playing}
    />
  ), [currentUrl, status.playing]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2d6a4f" /></View>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: title as string }} />
      <FlatList
        data={detail?.verses}
        keyExtractor={(item) => item.number.inSurah.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  verseBox: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  verseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  numberCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e9f5ef', justifyContent: 'center', alignItems: 'center' },
  verseNumber: { fontSize: 12, color: '#2d6a4f', fontWeight: 'bold' },
  arabicText: { fontSize: 30, textAlign: 'right', color: '#333', lineHeight: 55, fontFamily: 'serif', marginBottom: 10 },
  latinText: { fontSize: 16, color: '#2d6a4f', fontStyle: 'italic', marginBottom: 8 },
  translationText: { fontSize: 15, color: '#555', lineHeight: 22 },
});