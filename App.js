import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RutinaScreen from './src/screens/RutinaScreen';
import EserciziScreen from './src/screens/EserciziScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RutinaStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFD700' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: null,
      }}
    >
      <Stack.Screen name="Rutina" component={RutinaScreen} options={{ headerTitle: 'Rutina' }} />
    </Stack.Navigator>
  );
}

function EserciziStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFD700' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: null,
      }}
    >
      <Stack.Screen name="Esercizi" component={EserciziScreen} options={{ headerTitle: 'Esercizi' }} />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFD700' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: null,
      }}
    >
      <Stack.Screen name="Profilo" component={ProfileScreen} options={{ headerTitle: 'Profilo' }} />
    </Stack.Navigator>
  );
}

function HomeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Rutina') {
            iconName = 'home';
          } else if (route.name === 'Esercizi') {
            iconName = 'fitness-center';
          } else if (route.name === 'Profilo') {
            iconName = 'person';
          }
          return <Icon name={iconName} type="material" color={color} size={size} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Rutina" component={RutinaStackNavigator} />
      <Tab.Screen name="Esercizi" component={EserciziStackNavigator} />
      <Tab.Screen name="Profilo" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#FFD700' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Accedi' }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Registrati' }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeTabNavigator} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}