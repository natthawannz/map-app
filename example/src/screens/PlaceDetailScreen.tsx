import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { RouteProp } from '@react-navigation/native';
import { Place } from '../types';

type Props = {
  route: RouteProp<{ params: { place: Place } }, 'params'>;
};

export default function PlaceDetailScreen({ route }: Props) {
  const { place } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: place.coords.latitude,
          longitude: place.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={place.coords} title={place.name} description={place.desc} />
      </MapView>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{place.name}</Text>
        <Text>{place.desc}</Text>
      </View>
    </View>
  );
}