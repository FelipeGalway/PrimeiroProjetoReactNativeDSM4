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

import {
  launchCamera, // Função para abrir a câmera
  launchImageLibrary, // Função para abrir a biblioteca de imagens
} from 'react-native-image-picker';

// Declaração do componente principal
const Camera = () => {
  // Define um estado para armazenar informações do arquivo selecionado
  const [filePath, setFilePath] = useState({});

  // Função para solicitar permissão de acesso à câmera (apenas para Android)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Tenta solicitar permissão para usar a câmera
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permissão da Câmera',
            message: 'O aplicativo precisa de permissão para acessar a câmera',
          },
        );
        // Se a permissão da câmera for concedida, retorna verdadeiro
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Erro de permissão de câmera', err);
        return false;
      }
    } else return true; // Se a plataforma não for Android, retorna verdadeiro
  };

  // Função para solicitar permissão de escrita externa (apenas para Android)
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Tenta solicitar permissão para escrever em armazenamento externo
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissão de Escrita em Armazenamento Externo',
            message:
              'O aplicativo precisa de permissão para escrever em armazenamento externo',
          },
        );
        // Se a permissão para escrita externa for concedida, retorna verdadeiro
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Erro de permissão de escrita', err);
      }
      return false;
    } else return true;
  };

  // Função para capturar uma imagem da câmera
  const captureImage = async type => {
    let options = {
      mediaType: type, // Tipo de mídia a ser capturada (foto ou vídeo)
      maxWidth: 300, // Largura máxima da imagem
      maxHeight: 550, // Altura máxima da imagem
      quality: 1, // Qualidade da imagem (0 a 1)
      videoQuality: 'low', // Qualidade do vídeo (baixa)
      durationLimit: 30, // Duração máxima do vídeo em segundos
      saveToPhotos: true, // Salvar na galeria de fotos
    };

    let isCameraPermitted = await requestCameraPermission(); // Verifica permissão da câmera
    // let isStoragePermitted = await requestExternalWritePermission(); // Verifica permissão de escrita externa
    if (isCameraPermitted) {
      // Se ambas as permissões forem concedidas, abre a câmera
      launchCamera(options, response => {
        console.log('Resposta = ', response);

        if (response.didCancel) {
          alert('O usuário cancelou a seleção da câmera');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Câmera não disponível no dispositivo');
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

  // Função para escolher um arquivo da biblioteca de imagens
  const chooseFile = type => {
    let options = {
      mediaType: type, // Tipo de mídia a ser selecionada (foto ou vídeo)
      maxWidth: 300, // Largura máxima da imagem
      maxHeight: 550, // Altura máxima da imagem
      quality: 1, // Qualidade da imagem (0 a 1)
    };
    launchImageLibrary(options, response => {
      console.log('Resposta = ', response);

      if (response.didCancel) {
        alert('O usuário cancelou a seleção da câmera');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Câmera não disponível no dispositivo');
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

  // Componente de interface do usuário
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
          <Text style={styles.textStyle}>Abrir Câmera para Capturar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('video')}>
          <Text style={styles.textStyle}>Abrir Câmera para Capturar Vídeo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Galeria de Imagens</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('video')}>
          <Text style={styles.textStyle}>Galeria de Vídeos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
});

export default Camera;
