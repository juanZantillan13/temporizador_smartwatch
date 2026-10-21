import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const WORK_TIME = 25 * 60; // 25 minutos
const BREAK_TIME = 5 * 60; // 5 minutos

export default function App() {
  const [isWorkMode, setIsWorkMode] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      
      // Vibración háptica fuerte al terminar el ciclo
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Alternar automáticamente entre modo trabajo y descanso
      if (isWorkMode) {
        setIsWorkMode(false);
        setTimeLeft(BREAK_TIME);
      } else {
        setIsWorkMode(true);
        setTimeLeft(WORK_TIME);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    Haptics.selectionAsync();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(false);
    setTimeLeft(isWorkMode ? WORK_TIME : BREAK_TIME);
  };

  return (
    <View style={styles.container}>
      {/* Pantalla circular simulando un Smartwatch */}
      <View style={styles.watchScreen}>
        <Text style={styles.modeText}>
          {isWorkMode ? '🎯 Enfoque' : '☕ Descanso'}
        </Text>
        
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isRunning ? styles.stopButton : styles.startButton]} 
            onPress={toggleTimer}
          >
            <Text style={styles.buttonText}>{isRunning ? 'Pausar' : 'Iniciar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.resetButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchScreen: {
    width: 220,
    height: 220,
    borderRadius: 110, // Forma circular perfecta
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#333333',
    padding: 15,
  },
  modeText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#222222',
    borderRadius: 15,
  },
  resetButtonText: {
    fontSize: 12,
  },
});