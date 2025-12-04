import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  SafeAreaView,
  Modal,
  ScrollView,
  StatusBar,
  Vibration,
  TextInput,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [scannedData, setScannedData] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState('off');
  const [showResultModal, setShowResultModal] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleLogin = () => {
    if (loginAttempts >= 3) {
      setLoginError('Demasiados intentos fallidos');
      return;
    }

    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
      setLoginAttempts(0);
    } else {
      setLoginAttempts(prev => prev + 1);
      setLoginError(`Credenciales incorrectas. Intentos: ${loginAttempts + 1}/3`);
      setPassword('');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          onPress: () => {
            setIsAuthenticated(false);
            setShowLoginModal(true);
            setUsername('');
            setPassword('');
            setLoginAttempts(0);
            setScanHistory([]);
          }
        },
      ]
    );
  };

  const handleBarCodeScanned = ({ type, data }) => {
    Vibration.vibrate(100);
    setScannedData(data);
    setShowResultModal(true);
    
    const newScan = {
      id: Date.now().toString(),
      data: data,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: new Date().toLocaleDateString(),
      type: detectQRType(data),
    };
    
    setScanHistory(prev => [newScan, ...prev.slice(0, 9)]);
  };

  const detectQRType = (data) => {
    if (data.startsWith('http://') || data.startsWith('https://')) return '🌐 URL';
    if (data.startsWith('tel:')) return '📞 Teléfono';
    if (data.startsWith('mailto:')) return '📧 Email';
    if (data.startsWith('WIFI:')) return '📶 WiFi';
    if (data.startsWith('BEGIN:VCARD')) return '👤 Contacto';
    if (data.match(/^\d+$/)) return '#️⃣ Número';
    if (data.length > 100) return '📄 Texto Largo';
    return '📝 Texto';
  };

  const handleAction = (action) => {
    switch (action) {
      case 'open':
        if (scannedData.startsWith('http') || scannedData.startsWith('tel:') || scannedData.startsWith('mailto:')) {
          Linking.openURL(scannedData).catch(err =>
            Alert.alert('Error', 'No se pudo abrir')
          );
        }
        break;
      case 'copy':
        Alert.alert('Copiado', 'Texto copiado');
        break;
    }
    setShowResultModal(false);
    resetScanner();
  };

  const resetScanner = () => {
    setScannedData('');
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'torch' : 'off');
  };

  const clearHistory = () => {
    Alert.alert(
      'Limpiar Historial',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpiar', onPress: () => setScanHistory([]) },
      ]
    );
  };

  const getTypeColor = (type) => {
    const typeKey = type.replace(/[^a-zA-Z]/g, '');
    const colors = {
      'URL': '#4CAF50',
      'Teléfono': '#2196F3',
      'Email': '#FF9800',
      'WiFi': '#9C27B0',
      'Contacto': '#F44336',
      'Número': '#607D8B',
      'Texto': '#795548',
      'TextoLargo': '#3F51B5',
    };
    return colors[typeKey] || '#757575';
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLoginModal}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            <View style={styles.loginModalContent}>
              <Text style={styles.loginTitle}>🔐 Iniciar Sesión</Text>
              <Text style={styles.loginSubtitle}>QR Scanner Pro</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
                
                {loginError ? (
                  <Text style={styles.errorText}>{loginError}</Text>
                ) : null}
                
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Ingresar</Text>
                </TouchableOpacity>
                
                <View style={styles.credentialsInfo}>
                  <Text style={styles.credentialsText}>Usuario: admin</Text>
                  <Text style={styles.credentialsText}>Contraseña: 1234</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.pantalla}>
        <Text>Solicitando permiso para la cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.pantalla}>
        <Text>No hay acceso a la cámara</Text>
        <TouchableOpacity style={styles.boton} onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.botonTexto}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={showResultModal ? undefined : handleBarCodeScanned}
        flash={flashMode}
      />
      
      <View style={styles.overlay}>
        <View style={styles.marcoQR} />
        <Text style={styles.instructionText}>Apunta al código QR</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>📱 QR Scanner</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>👤</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => setShowHistoryModal(true)}
        >
          <Text style={styles.historyButtonText}>
            Historial ({scanHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      

      <Modal
        animationType="slide"
        transparent={true}
        visible={showResultModal}
        onRequestClose={() => {
          setShowResultModal(false);
          resetScanner();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>QR Escaneado</Text>
            
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(detectQRType(scannedData)) }]}>
              <Text style={styles.typeText}>{detectQRType(scannedData)}</Text>
            </View>
            
            <ScrollView style={styles.dataContainer}>
              <Text style={styles.dataText} selectable={true}>
                {scannedData}
              </Text>
            </ScrollView>
            
            <View style={styles.actionButtons}>
              {(scannedData.startsWith('http') || scannedData.startsWith('tel:') || scannedData.startsWith('mailto:')) && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.openButton]}
                  onPress={() => handleAction('open')}
                >
                  <Text style={styles.actionButtonText}>Abrir</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.actionButton, styles.copyButton]}
                onPress={() => handleAction('copy')}
              >
                <Text style={styles.actionButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowResultModal(false);
                resetScanner();
              }}
            >
              <Text style={styles.closeButtonText}>Escanear otro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showHistoryModal}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Historial</Text>
              {scanHistory.length > 0 && (
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={styles.clearHistoryText}>Limpiar</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {scanHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>No hay escaneos</Text>
              </View>
            ) : (
              <ScrollView style={styles.historyList}>
                {scanHistory.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => {
                      setScannedData(item.data);
                      setShowHistoryModal(false);
                      setShowResultModal(true);
                    }}
                  >
                    <View style={styles.historyItemHeader}>
                      <View style={[styles.typeBadgeSmall, { backgroundColor: getTypeColor(item.type) }]}>
                        <Text style={styles.typeTextSmall}>{item.type}</Text>
                      </View>
                      <Text style={styles.historyTime}>{item.timestamp}</Text>
                    </View>
                    <Text style={styles.historyData} numberOfLines={1}>
                      {item.data}
                    </Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHistoryModal(false)}
            >
              <Text style={styles.closeButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  loginModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  credentialsInfo: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  credentialsText: {
    color: '#2196F3',
    fontSize: 14,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pantalla: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  boton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  marcoQR: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#00FF00',
    borderRadius: 10,
    backgroundColor: 'transparent',
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
  header: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    color: 'white',
  },
  historyButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  historyButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flashButton: {
    alignItems: 'center',
  },
  flashIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  flashIconText: {
    fontSize: 24,
  },
  flashText: {
    color: 'white',
    fontSize: 12,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  clearHistoryText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dataContainer: {
    maxHeight: 150,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#2196F3',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyHistory: {
    padding: 40,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  historyList: {
    maxHeight: 400,
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTextSmall: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  historyTime: {
    fontSize: 11,
    color: '#666',
  },
  historyData: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default App;