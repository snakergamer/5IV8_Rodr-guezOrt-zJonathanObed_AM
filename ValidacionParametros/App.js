import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const imagenesPerfil = [
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
    'https://cdn-icons-png.flaticon.com/512/4333/4333607.png',
    'https://cdn-icons-png.flaticon.com/512/219/219986.png',
  ];

  const validarLogin = () => {
    const validUser = 'admin';
    const validPass = '1234';
    
    if (!user.trim() || !pass.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    
    if (user === validUser && pass === validPass) {
      Alert.alert('Correcto', 'Inicio de sesión exitoso');
      setLoggedIn(true);
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const cambiarImagen = () => {
    const imagenAleatoria = imagenesPerfil[Math.floor(Math.random() * imagenesPerfil.length)];
    setImageUri(imagenAleatoria);
    Alert.alert('Éxito', 'Foto de perfil cambiada');
  };

  const cerrarSesion = () => {
    setLoggedIn(false);
    setUser('');
    setPass('');
    setImageUri(null);
    Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loggedIn ? (
        <View style={styles.loginBox}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          
          <TextInput
            placeholder="Usuario"
            style={styles.input}
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity style={styles.loginButton} onPress={validarLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.credentialsHint}>
            <Text style={styles.hintText}>Usuario: admin</Text>
            <Text style={styles.hintText}>Contraseña: 1234</Text>
          </View>
        </View>
      ) : (
        <View style={styles.profileBox}>
          <Text style={styles.welcomeTitle}>Bienvenido {user}!</Text>
          
          <TouchableOpacity onPress={cambiarImagen} style={styles.imageContainer}>
            <Image
              source={{ 
                uri: imageUri || 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' 
              }}
              style={styles.profileImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.changeImageText}>Cambiar Foto</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.imageHint}>Toca la imagen para cambiar</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginBox: {
    width: '85%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileBox: {
    width: '85%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginVertical: 15,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    paddingVertical: 5,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
  },
  changeImageText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  imageHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  credentialsHint: {
    marginTop: 10,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});