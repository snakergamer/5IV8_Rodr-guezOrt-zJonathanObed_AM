import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Image, ScrollView } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system/legacy';

export default function App() {
  const cameraRef = useRef(null);
  const [permisoCamara, setPermisoCamara] = useState(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  useEffect(() => {
    solicitarPermisoCamara();
  }, []);

  useEffect(() => {
    if (sesionActiva) {
      cargarFotos();
    }
  }, [sesionActiva]);

  const cargarFotos = async () => {
    try {
      const carpetaFotos = FileSystem.documentDirectory + 'fotos_perfil/';
      const carpetaInfo = await FileSystem.getInfoAsync(carpetaFotos);
      
      if (carpetaInfo.exists) {
        const archivos = await FileSystem.readDirectoryAsync(carpetaFotos);
        const fotosDelUsuario = archivos.filter(f => f.includes(usuario));
        setFotos(fotosDelUsuario.map(f => carpetaFotos + f));
      } else {
        setFotos([]);
      }
    } catch (error) {
      console.error('Error cargando fotos:', error);
      setFotos([]);
    }
  };

  const solicitarPermisoCamara = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermisoCamara(status === 'granted');
  };

  const iniciarSesion = () => {
    if (usuario === 'admin' && contrasena === '123') {
      setSesionActiva(true);
      Alert.alert('Éxito', 'Sesión iniciada');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const cerrarSesion = () => {
    setSesionActiva(false);
    setMostrarCamara(false);
    setFotoCapturada(null);
    setUsuario('');
    setContrasena('');
  };

  const capturarFoto = async () => {
    if (cameraRef.current) {
      try {
        const foto = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setFotoCapturada(foto);
      } catch (error) {
        Alert.alert('Error', 'No se pudo capturar la foto: ' + error.message);
      }
    }
  };

  const guardarFoto = async () => {
    if (!fotoCapturada) return;
    
    setGuardando(true);
    try {
      const carpetaFotos = FileSystem.documentDirectory + 'fotos_perfil/';
      
      // Crear carpeta si no existe
      const carpetaInfo = await FileSystem.getInfoAsync(carpetaFotos);
      if (!carpetaInfo.exists) {
        await FileSystem.makeDirectoryAsync(carpetaFotos, { intermediates: true });
      }

      const nombreFoto = `perfil_${usuario}_${Date.now()}.jpg`;
      const rutaDestino = carpetaFotos + nombreFoto;
      
      // Copiar archivo de foto a la ubicación destino
      await FileSystem.copyAsync({
        from: fotoCapturada.uri,
        to: rutaDestino,
      });

      Alert.alert('✅ Éxito', `Foto guardada:\n${nombreFoto}\n\nRuta: ${rutaDestino}`, [
        { text: 'OK', onPress: () => {
          rechazarFoto();
          cargarFotos();
        } }
      ]);
    } catch (error) {
      console.error('Error guardando foto:', error);
      Alert.alert('Error', 'No se pudo guardar la foto:\n' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const rechazarFoto = () => {
    setFotoCapturada(null);
  };

  if (permisoCamara === null) {
    return (
      <View style={styles.pantalla}>
        <Text>Solicitando permiso para la cámara...</Text>
      </View>
    );
  }

  if (permisoCamara === false) {
    return (
      <View style={styles.pantalla}>
        <Text>No hay acceso a la cámara</Text>
        <Button onPress={solicitarPermisoCamara}>Intentar de nuevo</Button>
      </View>
    );
  }

  if (!sesionActiva) {
    return (
      <View style={styles.pantalla}>
        <Text style={styles.titulo}>Iniciar Sesión</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
        
        <Button mode="contained" onPress={iniciarSesion} style={styles.boton}>
          Entrar
        </Button>

        <Text style={styles.nota}>Usuario: admin | Contraseña: 123</Text>
      </View>
    );
  }

  if (mostrarCamara) {
    if (fotoCapturada) {
      return (
        <View style={styles.pantalla}>
          <Text style={styles.titulo}>Vista Previa</Text>
          <Image
            source={{ uri: fotoCapturada.uri }}
            style={styles.imagenPreview}
          />
          <View style={styles.botonesCamara}>
            <Button
              mode="contained"
              onPress={guardarFoto}
              loading={guardando}
              disabled={guardando}
              style={styles.boton}
            >
              Guardar Foto
            </Button>
            <Button
              mode="outlined"
              onPress={rechazarFoto}
              style={styles.boton}
            >
              Retomar
            </Button>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contenedorCamara}>
        <CameraView
          ref={cameraRef}
          style={styles.camara}
          facing="back"
        />
        
        <View style={styles.overlay}>
          <View style={styles.marcoQR} />
          <Text style={styles.instructionText}>Apunta hacia tu cara</Text>
        </View>
        
        <View style={styles.botonesCamara}>
          <Button
            mode="contained"
            onPress={capturarFoto}
            style={styles.boton}
          >
            Capturar Foto
          </Button>
          <Button
            mode="outlined"
            onPress={() => setMostrarCamara(false)}
            style={styles.boton}
          >
            Cerrar Cámara
          </Button>
        </View>
      </View>
    );
  }

  if (mostrarGaleria && sesionActiva) {
    return (
      <View style={styles.pantalla}>
        <Text style={styles.titulo}>Mis Fotos de Perfil</Text>
        <ScrollView style={styles.galeríaContainer}>
          {fotos.length > 0 ? (
            fotos.map((foto, index) => (
              <View key={index} style={styles.fotoItem}>
                <Image
                  source={{ uri: foto }}
                  style={styles.fotoGaleria}
                />
                <Text style={styles.fotoNombre}>{foto.split('/').pop()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sinFotos}>No hay fotos guardadas aún</Text>
          )}
        </ScrollView>
        <View style={styles.botonesGaleria}>
          <Button
            mode="outlined"
            onPress={() => setMostrarGaleria(false)}
            style={styles.boton}
          >
            Volver
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Bienvenido</Text>
      <Text style={styles.subtitulo}>Usuario: {usuario}</Text>
      
      <Button mode="contained" onPress={() => setMostrarCamara(true)} style={styles.boton}>
        Tomar Foto de Perfil
      </Button>

      {fotos.length > 0 && (
        <Button mode="outlined" onPress={() => setMostrarGaleria(true)} style={styles.boton}>
          Ver Mis Fotos ({fotos.length})
        </Button>
      )}
      
      <Button mode="outlined" onPress={cerrarSesion} style={styles.boton}>
        Cerrar Sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0'
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666'
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  boton: {
    width: '100%',
    marginVertical: 5,
    padding: 5
  },
  nota: {
    marginTop: 20,
    fontSize: 12,
    color: '#888'
  },
  camara: {
    flex: 1,
    width: '100%'
  },
  imagenPreview: {
    width: '100%',
    height: '60%',
    marginVertical: 10,
    borderRadius: 10,
  },
  contenedorCamara: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  instructionText: {
    position: 'absolute',
    top: 40,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  marcoQR: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: '#6200ee',
    borderRadius: 10,
    backgroundColor: 'transparent'
  },
  botonesCamara: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20
  },
  galeríaContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 16,
  },
  fotoItem: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  fotoGaleria: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 8,
  },
  fotoNombre: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sinFotos: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 32,
  },
  botonesGaleria: {
    width: '100%',
    paddingHorizontal: 16,
  }
});