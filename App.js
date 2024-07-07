import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RutinaScreen from './src/screens/RutinaScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreateExerciseScreen from './src/screens/CreateExerciseScreen';

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
      <Stack.Screen name="Rutina" component={RutinaScreen} options={{ headerTitle: 'Routine' }} />
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
      <Stack.Screen
        name="Progresos"
        component={ProgressScreen}
        options={({ navigation }) => ({
          headerTitle: 'Progressi',
          headerRight: () => (
            <Icon
              name="add"
              type="material"
              color="#fff"
              onPress={() => navigation.navigate('CreateExercise')}
              containerStyle={{ marginRight: 15 }}
            />
          ),
        })}
      />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ headerTitle: 'Dettaglio Esercizio' }} />
      <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} options={{ headerTitle: 'Crea Esercizio' }} />
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
      <Stack.Screen name="Perfil" component={ProfileScreen} options={{ headerTitle: 'Profilo' }} />
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
      <Tab.Screen name="Rutina" component={RutinaStackNavigator} options={{ title: 'Routine' }} />
      <Tab.Screen name="Progresos" component={ProgressStackNavigator} options={{ title: 'Progressi' }} />
      <Tab.Screen name="Perfil" component={ProfileStackNavigator} options={{ title: 'Profilo' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            setInitialRoute('Home');
          } else {
            AsyncStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Token non valido:', error);
          AsyncStorage.removeItem('token');
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
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