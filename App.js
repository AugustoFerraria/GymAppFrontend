import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import RutinaScreen from './src/screens/RutinaScreen';
import EserciziScreen from './src/screens/EserciziScreen';
import StudentiScreen from './src/screens/StudentiScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Rutina" component={RutinaScreen} />
        <Stack.Screen name="Esercizi" component={EserciziScreen} />
        <Stack.Screen name="Studenti" component={StudentiScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;