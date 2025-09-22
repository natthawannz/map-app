import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import { loadPlaces } from '../storage';
import { Place } from '../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Map: undefined;
  PlacesList: undefined;
  PlaceDetail: { place: Place };
};
type NavProps = StackNavigationProp<RootStackParamList, 'PlacesList'>;

export default function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const navigation = useNavigation<NavProps>();

  useEffect(() => {
    (async () => {
      const data = await loadPlaces();
      setPlaces(data);
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PlaceDetail', { place: item })}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text numberOfLines={1}>{item.desc}</Text>
            <Text style={{ fontSize: 10, color: '#555' }}>
              {item.coords.latitude.toFixed(6)}, {item.coords.longitude.toFixed(6)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});