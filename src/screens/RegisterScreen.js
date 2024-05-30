import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import InputField from '../components/InputField';
import PickerField from '../components/PickerField';
import ErrorText from '../components/ErrorText';
import Background from '../components/Background';

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
      navigation.navigate('Home', { role: role });
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
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <ErrorText error={errors.general} />
          <InputField
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <ErrorText error={errors.name} />
          <InputField
            placeholder="Cognome"
            value={surname}
            onChangeText={setSurname}
            error={errors.surname}
          />
          <ErrorText error={errors.surname} />
          <InputField
            placeholder="Nome utente"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />
          <ErrorText error={errors.username} />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <ErrorText error={errors.password} />
          <InputField
            placeholder="Conferma Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />
          <ErrorText error={errors.confirmPassword} />
          <InputField
            placeholder="Età"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            error={errors.age}
          />
          <ErrorText error={errors.age} />
          <InputField
            placeholder="Peso"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            error={errors.weight}
          />
          <ErrorText error={errors.weight} />
          <InputField
            placeholder="Altezza"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            error={errors.height}
          />
          <ErrorText error={errors.height} />
          <PickerField
            label="Ruolo"
            selectedValue={role}
            onValueChange={setRole}
            items={[
              { label: 'Utente', value: 'user' },
              { label: 'Allenatore', value: 'admin' },
            ]}
          />
          <Button title="Registrati" onPress={handleRegister} buttonStyle={styles.button} />
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Hai già un account? Accedi
          </Text>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    margin: 0,
  },
  innerContainer: {
    paddingTop: 25,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2089dc',
    marginTop: 16,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default RegisterScreen;