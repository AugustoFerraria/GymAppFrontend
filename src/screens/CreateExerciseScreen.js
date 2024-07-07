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
      Alert.alert('Successo', 'Esercizio creato con successo');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Errore', "C'è stato un errore nella creazione dell'esercizio");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome dell'esercizio"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrizione dell'esercizio"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Crea Esercizio" onPress={handleCreateExercise} />
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