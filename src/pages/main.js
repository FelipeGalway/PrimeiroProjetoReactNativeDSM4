import React, {useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import useLocation from '../hooks/useLocation';
import {Text} from 'react-native';

export default function Main({navigation}) {
  const [latitude, setLatitude] = useState(-20.527853877303137);//-20.5149138
  const [longitude, setLongitude] = useState(-47.4290420865069);//-47.4006943

  const {coords, errorMsg} = useLocation();

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if(!coords) {
    return <Text>Carregando...</Text>;
  }

  return (
    <MapView
      style={{
        flex: 1,
      }}
      initialRegion={{
        latitude: coords ? coords.latitude : latitude,
        longitude: coords ? coords.longitude : longitude,
        latitudeDelta: 0.010,
        longitudeDelta: 0.010,
      }}>
      <Marker
        coordinate={{
          latitude: coords ? coords.latitude : latitude,
          longitude: coords ? coords.longitude : longitude,
        }}
        title="Você está aqui"
        description="Essa é a sua localização atual"
        />
      </MapView>
  );
}
