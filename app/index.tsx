import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Icon bawaan Expo

export default function HomeScreen() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]); // State untuk hasil filter
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('https://api.quran.gading.dev/surah')
      .then((res) => res.json())
      .then((json) => {
        setSurahs(json.data);
        setFilteredSurahs(json.data); // Inisialisasi filter dengan semua data
        setLoading(false);
      });
  }, []);

  // Fungsi untuk menangani pencarian
  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter((item: any) => {
        const surahName = item.name.transliteration.id.toLowerCase();
        const searchText = text.toLowerCase();
        return surahName.includes(searchText);
      });
      setFilteredSurahs(filtered);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2d6a4f" style={styles.center} />;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Cari Surah (contoh: Al-Fatihah)"
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({
              pathname: "/detail/[id]",
              params: { id: item.number, title: item.name.transliteration.id }
            })}
          >
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{item.number}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.surahName}>{item.name.transliteration.id}</Text>
              <Text style={styles.subTitle}>{item.revelation.id} • {item.numberOfVerses} Ayat</Text>
            </View>
            <Text style={styles.arabicNameSmall}>{item.name.short}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={{ color: '#888', marginTop: 20 }}>Surah tidak ditemukan</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  card: { 
    flexDirection: 'row', 
    paddingVertical: 15, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  numberCircle: { 
    width: 35, 
    height: 35, 
    borderRadius: 10, 
    backgroundColor: '#e9f5ef', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  numberText: { color: '#2d6a4f', fontWeight: 'bold' },
  surahName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subTitle: { fontSize: 12, color: '#888', marginTop: 2 },
  arabicNameSmall: { fontSize: 20, color: '#2d6a4f' },
});