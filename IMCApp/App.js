// App.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Linking 
} from 'react-native';
import { styles } from './styles';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [imc, setImc] = useState(null);
  const [classification, setClassification] = useState('');

  const calculateIMC = () => {
    if (!weight || !height) {
      Alert.alert('Error', 'Por favor ingresa peso y altura');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;

    if (isNaN(weightNum) || isNaN(heightNum) || heightNum === 0) {
      Alert.alert('Error', 'Por favor ingresa valores válidos');
      return;
    }

    const calculatedIMC = weightNum / (heightNum * heightNum);
    setImc(calculatedIMC.toFixed(1));
    setClassification(getClassification(calculatedIMC));
  };

  const getClassification = (imcValue) => {
    if (imcValue < 18.5) return 'Bajo peso';
    if (imcValue < 25) return 'Peso normal';
    if (imcValue < 30) return 'Sobrepeso';
    if (imcValue < 35) return 'Obesidad grado I';
    if (imcValue < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  };

  const getClassificationColor = () => {
    if (!imc) return '#666';
    const imcValue = parseFloat(imc);
    if (imcValue < 18.5) return '#3498db';
    if (imcValue < 25) return '#2ecc71';
    if (imcValue < 30) return '#f39c12';
    return '#e74c3c';
  };

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setImc(null);
    setClassification('');
  };

  const goBack = () => {
    Linking.openURL('../index.html');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calculadora de IMC</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 70"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 175"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateIMC}>
        <Text style={styles.buttonText}>Calcular IMC</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetForm}>
        <Text style={styles.buttonText}>Limpiar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={goBack}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>

      {imc && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultado:</Text>
          <Text style={styles.imcValue}>IMC: {imc}</Text>
          <Text style={[styles.classification, { color: getClassificationColor() }]}>
            {classification}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Clasificación del IMC:</Text>
        <Text style={styles.infoItem}>• Bajo peso: menos de 18.5</Text>
        <Text style={styles.infoItem}>• Normal: 18.5 - 24.9</Text>
        <Text style={styles.infoItem}>• Sobrepeso: 25 - 29.9</Text>
        <Text style={styles.infoItem}>• Obesidad: 30 o más</Text>
      </View>
    </ScrollView>
  );
}