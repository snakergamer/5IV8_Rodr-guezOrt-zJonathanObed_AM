import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function App() {
  // 6. Usar useState para almacenar el valor del contador
  const [count, setCount] = useState(0);

  // 7. Funciones para sumar y restar
  const sumar = () => {
    setCount(count + 1);
  };

  const restar = () => {
    setCount(count - 1);
  };

  return (
    // 8. Contenedor Principal (outerContainer)
    <View style={styles.outerContainer}>
      <StatusBar style="auto" />
      
      {/* Título */}
      <Text style={styles.titulo}>Mi Contador</Text>
      
      {/* Contenedor principal */}
      <View style={styles.container}>
        
        {/* Subcontenedor para botones y contador */}
        <View style={styles.subcontainer}>
          
          {/* Botón restar */}
          <TouchableOpacity style={[styles.btn, styles.btnRestar]} onPress={restar}>
            <Text style={[styles.btnText, styles.btnTextRestar]}>-</Text>
          </TouchableOpacity>
          
          {/* Contenedor de la cuenta */}
          <View style={styles.cuentaContainer}>
            <Text style={styles.cuentaText}>{count}</Text>
          </View>
          
          {/* Botón sumar */}
          <TouchableOpacity style={[styles.btn, styles.btnSumar]} onPress={sumar}>
            <Text style={[styles.btnText, styles.btnTextSumar]}>+</Text>
          </TouchableOpacity>
          
        </View>
        
        {/* Imagen */}
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.image}
        />
        
        {/* Descripción */}
        <Text style={styles.description}>
          Presiona los botones + y - para incrementar o decrementar el contador
        </Text>
        
      </View>
    </View>
  );
}

// 9. Estilos definidos con StyleSheet.create
const styles = StyleSheet.create({
  // Contenedor Principal
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  // Título
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  
  // Contenedor principal
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  
  // Subcontenedor
  subcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  
  // Botones
  btn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  
  btnSumar: {
    backgroundColor: '#ffd6cc', // Pastel rojo
  },
  
  btnRestar: {
    backgroundColor: '#ccf2ff', // Pastel azul
  },
  
  btnText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  btnTextSumar: {
    color: '#e74c3c',
  },
  
  btnTextRestar: {
    color: '#3498db',
  },
  
  // Contenedor de la cuenta
  cuentaContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 15,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  
  cuentaText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  // Imagen
  image: {
    width: 150,
    height: 150,
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  
  // Descripción
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
  },
});
