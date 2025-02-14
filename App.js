import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function App() {
  const [choices, setChoices] = useState([]);
  const [currentChoice, setCurrentChoice] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isDeciding, setIsDeciding] = useState(false);
  
  const titleScale = useSharedValue(1);
  const decisionScale = useSharedValue(1);
  const resultOpacity = useSharedValue(0);

  const addChoice = () => {
    if (currentChoice.trim()) {
      setChoices(prevChoices => [...prevChoices, currentChoice.trim()]);
      setCurrentChoice('');
    }
  };

  const removeChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
  };

  const makeDecision = useCallback(() => {
    if (choices.length < 2) {
      alert('Please add at least 2 choices');
      return;
    }

    setIsDeciding(true);
    setSelectedChoice(null);
    resultOpacity.value = 0;

    // Animate decision button
    decisionScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1.1),
      withSpring(1)
    );

    // Simulate decision making with animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * choices.length);
      setSelectedChoice(choices[randomIndex]);
      setIsDeciding(false);
      resultOpacity.value = withSpring(1);
    }, 1000);
  }, [choices, decisionScale, resultOpacity]);

  // Animated styles
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const decisionButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decisionScale.value }],
  }));

  const resultStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [
      { 
        scale: withSpring(resultOpacity.value, {
          damping: 12,
          stiffness: 100,
        })
      }
    ],
  }));

  // Hover animations for web
  const onHoverIn = () => {
    titleScale.value = withSpring(1.1);
  };

  const onHoverOut = () => {
    titleScale.value = withSpring(1);
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.container}>
        <Animated.Text 
          style={[styles.title, titleStyle]}
          onMouseEnter={onHoverIn}
          onMouseLeave={onHoverOut}
        >
          Decidere
        </Animated.Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentChoice}
            onChangeText={setCurrentChoice}
            placeholder="Enter a choice..."
            onSubmitEditing={addChoice}
            placeholderTextColor="#666"
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addChoice}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.choicesContainer}>
          {choices.map((choice, index) => (
            <Animated.View
              key={index}
              entering={withDelay(index * 100, withSpring({ opacity: 1, scale: 1 }))}
              style={styles.choiceItem}
            >
              <Text style={styles.choiceText}>{choice}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeChoice(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <AnimatedTouchableOpacity
          style={[styles.decideButton, isDeciding && styles.decidingButton, decisionButtonStyle]}
          onPress={makeDecision}
          disabled={isDeciding}
        >
          <Text style={styles.buttonText}>
            {isDeciding ? 'Deciding...' : 'Make Decision'}
          </Text>
        </AnimatedTouchableOpacity>

        {selectedChoice && (
          <Animated.View style={[styles.resultContainer, resultStyle]}>
            <Text style={styles.resultLabel}>Your decision:</Text>
            <Text style={styles.resultText}>{selectedChoice}</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#1e1b4b',
    minHeight: Platform.select({ web: '100vh', default: '100%' }),
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: Platform.select({ web: '100%', default: '100%' }),
    maxWidth: 800,
    backgroundColor: '#1e1b4b',
    padding: Platform.select({ web: 40, default: 20 }),
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      },
    }),
  },
  title: {
    fontSize: Platform.select({ web: 48, default: 32 }),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    ...Platform.select({
      web: {
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        cursor: 'default',
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      },
    }),
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: Platform.select({ web: 16, default: 12 }),
    marginRight: 10,
    fontSize: Platform.select({ web: 18, default: 16 }),
    ...Platform.select({
      web: {
        outline: 'none',
        border: 'none',
      },
    }),
  },
  addButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: Platform.select({ web: 16, default: 12 }),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#6366f1',
        },
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.select({ web: 18, default: 16 }),
    fontWeight: 'bold',
  },
  choicesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  choiceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: Platform.select({ web: 20, default: 16 }),
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          transform: 'translateX(5px)',
        },
      },
    }),
  },
  choiceText: {
    color: '#fff',
    fontSize: Platform.select({ web: 18, default: 16 }),
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
    padding: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  removeButtonText: {
    color: '#ff4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  decideButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: Platform.select({ web: 20, default: 16 }),
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#6366f1',
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
  decidingButton: {
    backgroundColor: '#312e81',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: Platform.select({ web: 30, default: 20 }),
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      },
    }),
  },
  resultLabel: {
    color: '#fff',
    fontSize: Platform.select({ web: 20, default: 16 }),
    marginBottom: 12,
    opacity: 0.9,
  },
  resultText: {
    color: '#fff',
    fontSize: Platform.select({ web: 32, default: 24 }),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
