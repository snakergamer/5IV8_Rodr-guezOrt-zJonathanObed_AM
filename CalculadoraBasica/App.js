import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Linking 
} from 'react-native';

const App = () => {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  // Función para regresar al portafolio
  const goToPortfolio = () => {
    Alert.alert(
      "Regresar al Portafolio",
      "¿Quieres regresar al portafolio principal?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: () => {
            // En una app web, esto navegaría al index
            // En React Native, mostramos un mensaje
            Alert.alert("Éxito", "Redirigiendo al portafolio...");
            // Si es una app web con Expo, podrías usar:
            // Linking.openURL('/index.html');
          }
        }
      ]
    );
  };

  // Función para manejar la entrada de números
  const inputNumber = (num) => {
    if (waitingForSecondValue) {
      setDisplay(String(num));
      setWaitingForSecondValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Función para manejar los operadores
  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstValue === null) {
      setFirstValue(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstValue(result);
    }

    setWaitingForSecondValue(true);
    setOperator(nextOperator);
  };

  // Función para realizar los cálculos
  const performCalculation = () => {
    const inputValue = parseFloat(display);
    
    if (firstValue === null || operator === null) return inputValue;

    switch (operator) {
      case '+':
        return firstValue + inputValue;
      case '-':
        return firstValue - inputValue;
      case '*':
        return firstValue * inputValue;
      case '/':
        if (inputValue === 0) {
          Alert.alert('Error', 'No se puede dividir por cero');
          return firstValue;
        }
        return firstValue / inputValue;
      default:
        return inputValue;
    }
  };

  // Función para el botón igual
  const calculateResult = () => {
    const inputValue = parseFloat(display);
    
    if (firstValue !== null && operator !== null) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
    }
  };

  // Función para limpiar la calculadora
  const clearCalculator = () => {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  };

  // Función para el punto decimal
  const inputDecimal = () => {
    if (waitingForSecondValue) {
      setDisplay('0.');
      setWaitingForSecondValue(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  // Función para porcentaje
  const inputPercentage = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de regreso al portafolio */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={goToPortfolio}
      >
        <Text style={styles.backButtonText}>← Portafolio</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Calculadora Básica</Text>
      
      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1}>{display}</Text>
      </View>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        {/* Fila 1 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonClear} onPress={clearCalculator}>
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonClear} onPress={inputPercentage}>
            <Text style={styles.buttonText}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOperator} onPress={() => inputOperator('/')}>
            <Text style={styles.buttonText}>÷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOperator} onPress={() => inputOperator('*')}>
            <Text style={styles.buttonText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Fila 2 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(7)}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(8)}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(9)}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOperator} onPress={() => inputOperator('-')}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>

        {/* Fila 3 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(4)}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(5)}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(6)}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOperator} onPress={() => inputOperator('+')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Fila 4 */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(1)}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(2)}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={() => inputNumber(3)}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonEquals} onPress={calculateResult}>
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>

        {/* Fila 5 */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.buttonNumber, styles.zeroButton]} 
            onPress={() => inputNumber(0)}
          >
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNumber} onPress={inputDecimal}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 60,
    marginTop: 50,
    color: 'white',
  },
  displayContainer: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 48,
    textAlign: 'right',
    fontWeight: '300',
    color: 'white',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  buttonNumber: {
    width: 70,
    height: 70,
    backgroundColor: '#333',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonOperator: {
    width: 70,
    height: 70,
    backgroundColor: '#ff9500',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonClear: {
    width: 70,
    height: 70,
    backgroundColor: '#a6a6a6',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonEquals: {
    width: 70,
    height: 70,
    backgroundColor: '#ff9500',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  zeroButton: {
    width: 150,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
