export interface Place {
  id: string;
  name: string;
  desc?: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

export type RootStackParamList = {
  Map: undefined;
  PlacesList: undefined;
  PlaceDetail: { place: Place };
};