import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RutinaScreen from './src/screens/RutinaScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
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

function ProgressStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFD700' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: null,
      }}
    >
      <Stack.Screen name="Progresos" component={ProgressScreen} options={{ headerTitle: 'Progresos' }} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ headerTitle: 'Detalle del Ejercicio' }} />
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
      <Stack.Screen name="Perfil" component={ProfileScreen} options={{ headerTitle: 'Perfil' }} />
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
          } else if (route.name === 'Progresos') {
            iconName = 'fitness-center';
          } else if (route.name === 'Perfil') {
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
      <Tab.Screen name="Progresos" component={ProgressStackNavigator} />
      <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
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
            options={{ title: 'Acceder' }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Registrar' }} 
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