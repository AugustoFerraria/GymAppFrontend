import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [role, setRole] = useState('user');

  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    let validationErrors = {};

    if (!name) validationErrors.name = "Questo campo e obbligatorio";
    if (!surname) validationErrors.surname = "Questo campo e obbligatorio";
    if (!username) validationErrors.username = "Questo campo e obbligatorio";
    if (!password) validationErrors.password = "Questo campo e obbligatorio";
    if (!confirmPassword) validationErrors.confirmPassword = "Questo campo e obbligatorio";
    if (password !== confirmPassword) validationErrors.confirmPassword = "Le passwords non corrispondono";
    if (!age) validationErrors.age = "Questo campo e obbligatorio";
    if (!weight) validationErrors.weight = "Questo campo e obbligatorio";
    if (!height) validationErrors.height = "Questo campo e obbligatorio";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        surname,
        username,
        password,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        role,
      });
      console.log('Registration successful', res.data);
      const userId = res.data.user.id; // Ajusta esto según la estructura de la respuesta real
      navigation.navigate('UserProfile', { userId });
    } catch (error) {
      console.error('Error registering', error);
      if (error.response && error.response.data && error.response.data.msg) {
        setErrors({ general: error.response.data.msg });
      } else {
        Alert.alert('Errore di registrazione', 'Errore del server');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrati</Text>
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={[styles.input, errors.name && styles.errorInput]}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        placeholder="Cognome"
        value={surname}
        onChangeText={setSurname}
        style={[styles.input, errors.surname && styles.errorInput]}
      />
      {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}
      <TextInput
        placeholder="Nome utente"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, errors.username && styles.errorInput]}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, errors.password && styles.errorInput]}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TextInput
        placeholder="Conferma Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, errors.confirmPassword && styles.errorInput]}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      <TextInput
        placeholder="Età"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={[styles.input, errors.age && styles.errorInput]}
      />
      {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
      <TextInput
        placeholder="Peso"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={[styles.input, errors.weight && styles.errorInput]}
      />
      {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
      <TextInput
        placeholder="Altezza"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={[styles.input, errors.height && styles.errorInput]}
      />
      {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Ruolo</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>
      <Button title="Registrati" onPress={handleRegister} />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        Hai già un account? Accedi
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default RegisterScreen;