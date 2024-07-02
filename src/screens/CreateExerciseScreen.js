import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateExerciseScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateExercise = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://localhost:3001/api/exercises/new', {
        name,
        description,
      }, {
        headers: { 'x-auth-token': token }
      });
      Alert.alert('Exito', 'Ejercicio creado con éxito');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un error al crear el ejercicio');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del ejercicio"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción del ejercicio"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Crear Ejercicio" onPress={handleCreateExercise} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default CreateExerciseScreen;