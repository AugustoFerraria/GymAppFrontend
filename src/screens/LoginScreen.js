import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import Background from '../components/Background';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });
      console.log('Login successful', res.data);
      const { role } = res.data.user;
      navigation.navigate('Home', { role: role });
    } catch (error) {
      console.error('Error logging in', error);
      Alert.alert('Errore di accesso', 'Credenziali non valide o errore del server');
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Nome utente"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Accedi" onPress={handleLogin} buttonStyle={styles.button} />
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Non hai un account? Registrati
          </Text>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2089dc',
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default LoginScreen;