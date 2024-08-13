import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateRoutineScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [routine, setRoutine] = useState('');

  const handleCreateRoutine = async () => {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      await axios.post(`http://localhost:3001/api/routines`, { studentId, routine }, config);
      alert('Rutina creada con éxito');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating routine:', error);
      alert('Error al crear la rutina');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Rutina</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe la rutina aquí..."
        value={routine}
        onChangeText={setRoutine}
      />
      <Button title="Crear" onPress={handleCreateRoutine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateRoutineScreen;