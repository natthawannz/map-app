import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; 
import MapView, { Marker, LatLng } from 'react-native-maps'; 

import { RouteProp, useRoute } from '@react-navigation/native';
import { Place } from './types'; //


type PlaceDetailRouteParams = {
  place: Place;
};

type PlaceDetailRouteProp = RouteProp<{
  PlaceDetail: PlaceDetailRouteParams;
}, 'PlaceDetail'>;

export default function PlaceDetailScreen() {
  const route = useRoute<PlaceDetailRouteProp>();
  const { place } = route.params;


  const initialRegion = {
    latitude: place.coords.latitude,
    longitude: place.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const markerCoordinate: LatLng = { 
    latitude: place.coords.latitude,
    longitude: place.coords.longitude,
  };


  const markerDescription = typeof place.desc === 'string' ? place.desc : '';


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}

      >
        <Marker
          coordinate={markerCoordinate}
          title={place.name}
          description={markerDescription} 
        />
      </MapView>

      <View style={styles.detailsContainer}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeDescription}>{place.desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, 
  },
  detailsContainer: {
    padding: 12,
    backgroundColor: '#fff', 
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  placeName: {
    fontSize: 22, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 16, 
    color: '#555', 
  },
});