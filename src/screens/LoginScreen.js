import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../components/Background';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Login button pressed');
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });
      console.log('Login successful', res.data);
      const { token, user } = res.data;  // Suponiendo que res.data también contiene información del usuario
      await AsyncStorage.setItem('token', token);
      console.log('Token stored in AsyncStorage');
      navigation.navigate('Home', { role: user.role });
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      Alert.alert('Errore di accesso', 'Credenziali non valide o errore del server');
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
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