// App.js - Versión completa en un solo archivo
import React, { useState, useRef, useEffect } from 'react';
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
  Platform,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const App = () => {
  // Estados
  const [scannedData, setScannedData] = useState('');
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  
  // Referencias
  const scannerRef = useRef(null);

  // Solicitar permisos de cámara
  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'Esta app necesita acceso a la cámara para escanear QR',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS maneja los permisos automáticamente con react-native-camera
      setHasCameraPermission(true);
    }
  };

  // Manejar escaneo exitoso
  const handleQRScan = (e) => {
    const data = e.data;
    setScannedData(data);
    setShowResultModal(true);
    setIsScannerActive(false);
    
    // Agregar al historial
    const newScan = {
      id: Date.now().toString(),
      data: data,
      timestamp: new Date().toLocaleString(),
      type: detectQRType(data),
    };
    
    setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); // Mantener solo últimos 10
  };

  // Detectar tipo de QR
  const detectQRType = (data) => {
    if (data.startsWith('http')) return 'URL';
    if (data.startsWith('tel:')) return 'Teléfono';
    if (data.startsWith('mailto:')) return 'Email';
    if (data.startsWith('WIFI:')) return 'WiFi';
    if (data.startsWith('BEGIN:VCARD')) return 'Contacto';
    if (data.match(/^\d+$/)) return 'Número';
    return 'Texto';
  };

  // Acciones del resultado
  const handleAction = (action) => {
    switch (action) {
      case 'open':
        if (scannedData.startsWith('http')) {
          Linking.openURL(scannedData).catch(err =>
            Alert.alert('Error', 'No se pudo abrir el enlace')
          );
        }
        break;
      case 'copy':
        Alert.alert('Copiado', 'Texto copiado al portapapeles');
        // Aquí podrías implementar react-native-clipboard
        break;
      case 'share':
        Alert.alert('Compartir', 'Funcionalidad de compartir');
        // Implementar react-native-share
        break;
    }
    setShowResultModal(false);
    resetScanner();
  };

  // Resetear escáner
  const resetScanner = () => {
    setScannedData('');
    setIsScannerActive(true);
    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.reactivate();
      }
    }, 500);
  };

  // Alternar flash
  const toggleFlash = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off
    );
  };

  // Limpiar historial
  const clearHistory = () => {
    Alert.alert(
      'Limpiar Historial',
      '¿Estás seguro de que quieres borrar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpiar', onPress: () => setScanHistory([]) },
      ]
    );
  };

  // Renderizar pantalla principal del escáner
  const renderScanner = () => {
    if (!hasCameraPermission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Se necesita permiso para acceder a la cámara
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <QRCodeScanner
        ref={scannerRef}
        onRead={handleQRScan}
        flashMode={flashMode}
        reactivate={isScannerActive}
        reactivateTimeout={3000}
        showMarker={true}
        cameraStyle={styles.camera}
        topContent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Escáner QR</Text>
            <TouchableOpacity onPress={() => setShowHistoryModal(true)}>
              <Text style={styles.historyButton}>Historial ({scanHistory.length})</Text>
            </TouchableOpacity>
          </View>
        }
        bottomContent={
          <View style={styles.controls}>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Text style={styles.flashButtonText}>
                {flashMode === RNCamera.Constants.FlashMode.off ? '🔦' : '💡'}
              </Text>
              <Text style={styles.flashButtonLabel}>
                {flashMode === RNCamera.Constants.FlashMode.off ? 'Flash' : 'Apagar'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.scanArea}>
              <Text style={styles.scanInstruction}>
                Coloca el código QR dentro del marco
              </Text>
            </View>
          </View>
        }
      />
    );
  };

  // Modal de resultado
  const renderResultModal = () => (
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
          <Text style={styles.modalTitle}>Código Escaneado</Text>
          
          <View style={styles.qrTypeBadge}>
            <Text style={styles.qrTypeText}>
              {detectQRType(scannedData)}
            </Text>
          </View>
          
          <ScrollView style={styles.dataContainer}>
            <Text style={styles.dataText} selectable={true}>
              {scannedData}
            </Text>
          </ScrollView>
          
          <View style={styles.actionButtons}>
            {scannedData.startsWith('http') && (
              <TouchableOpacity
                style={[styles.actionButton, styles.openButton]}
                onPress={() => handleAction('open')}
              >
                <Text style={styles.actionButtonText}>🌐 Abrir</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.actionButton, styles.copyButton]}
              onPress={() => handleAction('copy')}
            >
              <Text style={styles.actionButtonText}>📋 Copiar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={() => handleAction('share')}
            >
              <Text style={styles.actionButtonText}>↗️ Compartir</Text>
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
  );

  // Modal de historial
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const renderHistoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showHistoryModal}
      onRequestClose={() => setShowHistoryModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Historial de Escaneos</Text>
            {scanHistory.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearHistoryText}>Limpiar</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {scanHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                No hay escaneos recientes
              </Text>
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
                    <View style={[styles.typeBadge, 
                      { backgroundColor: getTypeColor(item.type) }]}>
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <Text style={styles.historyTime}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.historyData} numberOfLines={2}>
                    {item.data}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowHistoryModal(false)}
          >
            <Text style={styles.closeButtonText}>Volver al escáner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Color por tipo de QR
  const getTypeColor = (type) => {
    const colors = {
      'URL': '#4CAF50',
      'Teléfono': '#2196F3',
      'Email': '#FF9800',
      'WiFi': '#9C27B0',
      'Contacto': '#F44336',
      'Número': '#607D8B',
      'Texto': '#795548',
    };
    return colors[type] || '#757575';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {renderScanner()}
      {renderResultModal()}
      {renderHistoryModal()}
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Permisos
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Cámara
  camera: {
    height: '100%',
  },
  
  // Controles
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  flashButton: {
    alignItems: 'center',
    padding: 10,
  },
  flashButtonText: {
    fontSize: 28,
    marginBottom: 5,
  },
  flashButtonLabel: {
    color: 'white',
    fontSize: 12,
  },
  scanArea: {
    flex: 1,
    alignItems: 'center',
  },
  scanInstruction: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  // Modales
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
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
  
  // Resultado QR
  qrTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 15,
  },
  qrTypeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dataContainer: {
    maxHeight: 150,
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  
  // Botones de acción
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
  shareButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Botón cerrar
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
  
  // Historial
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
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
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
  },
});

export default App;
