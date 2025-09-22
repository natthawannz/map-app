import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Platform } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Place } from '../types'; 

type RootStackParamList = {
  Map: undefined;
  PlacesList: undefined;
  PlaceDetail: { place: Place };
};

type MapNavProps = StackNavigationProp<RootStackParamList, 'Map'>;

export default function MapScreen() {
  const navigation = useNavigation<MapNavProps>();
  const [region, setRegion] = useState<Region>({
    latitude: 13.736717,
    longitude: 100.523186,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const perm = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        const res = await request(perm);
        if (res !== RESULTS.GRANTED) {
          Alert.alert('Warning', 'ต้องให้อนุญาตใช้ตำแหน่งด้วยนะ');
        }
      } catch (e) {}
    })();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ latitude, longitude });
        setRegion({ ...region, latitude, longitude });
        mapRef.current?.animateToRegion({ ...region, latitude, longitude }, 500);
      },
      (error) => {
        Alert.alert('Error', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };


  const handleSavePlace = () => {
    if (!currentCoords) {
      Alert.alert('ไม่มีตำแหน่ง', 'กดปุ่ม หาตำแหน่งปัจจุบันก่อน');
      return;
    }
    setName('');
    setDesc('');
    setModalVisible(true);
  };

  const savePlace = async () => {
    if (!name.trim()) {
      Alert.alert('ชื่อไม่ถูกต้อง', 'โปรดกรอกชื่อ');
      return;
    }
    const newPlace: Place = {
      id: Math.random().toString(),
      name: name.trim(),
      desc: desc.trim(),
      coords: currentCoords!
    };
    await import('../storage').then(module => module.savePlace(newPlace));
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {currentCoords && <Marker coordinate={currentCoords} title="ตำแหน่งของคุณ" />}
      </MapView>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={getCurrentLocation}>
          <Text style={styles.btnText}>หาตำแหน่งปัจจุบัน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleSavePlace}>
          <Text style={styles.btnText}>บันทึกสถานที่</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('PlacesList')}
        >
          <Text style={styles.btnText}>รายการสถานที่</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalBack}>
          <View style={styles.modalBox}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>บันทึกสถานที่</Text>
            <TextInput placeholder="ชื่อสถานที่" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="คำบรรยาย" value={desc} onChangeText={setDesc} style={styles.input} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 10 }}>
                <Text>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={savePlace}>
                <Text>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
  },
  modalBack: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.3)',
    justifyContent:'center',
    alignItems:'center',
  },
  modalBox: {
    width:'80%',
    backgroundColor:'white',
    borderRadius:8,
    padding:20,
  },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:4,
    padding:8,
    marginBottom:10,
  }
});