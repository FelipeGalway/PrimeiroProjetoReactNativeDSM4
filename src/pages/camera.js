import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Camera = () => {
  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permissão da Câmera',
            message: 'O aplicativo precisa de permissão para acessar a câmera',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Erro de permissão de câmera', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissão de Escrita em Armazenamento Externo',
            message:
              'O aplicativo precisa de permissão para escrever em armazenamento externo',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Erro de permissão de escrita', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeigth: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Resposta = ', response);
        if (response.didCancel) {
          alert('O usuário cancelou a seleção da câmera');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Câmera não disponivel no dispositivo');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permissão não concedida');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response);
      });
    }
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeigth: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Resposta =', response);

      if (response.didCancel) {
        alert('O usuário cancelou a seleção da câmera');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Câmera não disponivel no dispositivo');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permissão não concedida');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response);
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Exemplo de Image Picker no React Native
      </Text>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}>
          <Text style={styles.textStyle}>CÂMERA FOTO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('video')}>
          <Text style={styles.textStyle}>CÂMERA VÍDEO</Text>
        </TouchableOpacity>        
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>GALERIA FOTO</Text>
        </TouchableOpacity>        
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('video')}>
          <Text style={styles.textStyle}>GALERIA VÍDEO</Text>
        </TouchableOpacity>        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        padding: 10,
        color: 'black',
        textAlign: 'center'
    },
    buttonStyle: {
        alignItems: 'center',
        backgroundColor: '#ADD8E6',
        padding: 5,
        marginVertical: 10,
        width: 250,
    }
})

export default Camera;