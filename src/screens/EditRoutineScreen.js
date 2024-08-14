import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const EditRoutineScreen = ({ route, navigation }) => {
  const { routineId } = route.params;
  const [routine, setRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get(`http://localhost:3001/api/routines/${routineId}`, config);
        setRoutine(response.data);
      } catch (error) {
        console.error('Error fetching routine:', error);
      }
    };

    const fetchExercises = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get('http://localhost:3001/api/exercises/all', config);
        setExercises(response.data.map(exercise => ({ label: exercise.name, value: exercise._id })));
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchRoutine();
    fetchExercises();
  }, [routineId]);

  const handleAddExercise = () => {
    if (selectedExercise && quantity) {
      setRoutine(prevRoutine => ({
        ...prevRoutine,
        exercises: [
          ...prevRoutine.exercises,
          { exerciseId: selectedExercise, quantity: parseInt(quantity, 10) }
        ],
      }));
      setSelectedExercise(null);
      setQuantity('');
    }
  };

  const handleSaveRoutine = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`http://localhost:3001/api/routines/${routineId}`, routine, config);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving routine:', error);
    }
  };

  const handleRemoveExercise = (index) => {
    setRoutine(prevRoutine => ({
      ...prevRoutine,
      exercises: prevRoutine.exercises.filter((_, i) => i !== index)
    }));
  };

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome della routine:</Text>
      <TextInput
        style={styles.input}
        value={routine.name}
        onChangeText={(text) => setRoutine({ ...routine, name: text })}
      />

      <Text style={styles.label}>Descrizione:</Text>
      <TextInput
        style={styles.input}
        value={routine.description}
        onChangeText={(text) => setRoutine({ ...routine, description: text })}
      />

      <Text style={styles.label}>Esercizi:</Text>
      {routine.exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseItem}>
          <Text style={styles.exerciseText}>{exercise.exerciseId.name}</Text>
          <Text style={styles.exerciseText}>{exercise.quantity}</Text>
          <Button onPress={() => handleRemoveExercise(index)}>Rimuovi</Button>
        </View>
      ))}

      <DropDownPicker
        open={openDropdown}
        value={selectedExercise}
        items={exercises}
        setOpen={setOpenDropdown}
        setValue={setSelectedExercise}
        placeholder="Seleziona esercizio"
        style={styles.dropdown}
      />
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantità"
        keyboardType="numeric"
      />
      <Button mode="contained" onPress={handleAddExercise} style={styles.addButton}>
        Aggiungi esercizio
      </Button>

      <Button mode="contained" onPress={handleSaveRoutine} style={styles.saveButton}>
        Salva Routine
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  label: {
    fontSize: 16,
    color: '#151515',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: '#007BFF',
  },
  saveButton: {
    backgroundColor: '#FFD700',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  exerciseText: {
    color: '#151515',
  }
});

export default EditRoutineScreen;