import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from './types';

const PLACES_KEY = 'Places';

export async function loadPlaces(): Promise<Place[]> {
  try {
    const raw = await AsyncStorage.getItem(PLACES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('loadPlaces error', e);
    return [];
  }
}

export async function savePlace(place: Place): Promise<void> {
  try {
    const places = await loadPlaces();
    places.unshift(place);
    await AsyncStorage.setItem(PLACES_KEY, JSON.stringify(places));
  } catch (e) {
    console.warn('savePlace error', e);
  }
}