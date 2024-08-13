import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

// Importar pantallas
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import RutinaScreen from "./src/screens/RutinaScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import ExerciseDetailScreen from "./src/screens/ExerciseDetailScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CreateExerciseScreen from "./src/screens/CreateExerciseScreen";
import TrainerScreen from "./src/screens/TrainerScreen";
import CreateRoutineScreen from "./src/screens/CreateRoutineScreen";
import ViewRoutineScreen from "./src/screens/ViewRoutineScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RutinaStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFD700" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Rutina"
        component={RutinaScreen}
        options={{ headerTitle: "Rutina" }}
      />
      <Stack.Screen
        name="ViewRoutine"
        component={ViewRoutineScreen}
        options={{ headerTitle: "Ver Rutina" }}
      />
    </Stack.Navigator>
  );
}

function ProgressStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFD700" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Progresos"
        component={ProgressScreen}
        options={({ navigation }) => ({
          headerTitle: "Progressi",
          headerRight: () => (
            <Icon
              name="add"
              type="material"
              color="#fff"
              onPress={() => navigation.navigate("CreateExercise")}
              containerStyle={{ marginRight: 15 }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ headerTitle: "Dettaglio esercizio" }}
      />
      <Stack.Screen
        name="CreateExercise"
        component={CreateExerciseScreen}
        options={{ headerTitle: "Crea esercizio" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFD700" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ headerTitle: "Profilo" }}
      />
    </Stack.Navigator>
  );
}

function TrainerStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFD700" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Alunni"
        component={TrainerScreen}
        options={{ headerTitle: "Alunni" }}
      />
      <Stack.Screen
        name="CreateRoutine"
        component={CreateRoutineScreen}
        options={{ headerTitle: "Crea Routine" }}
      />
      <Stack.Screen
        name="ViewRoutine"
        component={ViewRoutineScreen}
        options={{ headerTitle: "Vedi Routine" }}
      />
    </Stack.Navigator>
  );
}

function HomeTabNavigator({ userRole }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Rutina" || route.name === "Alunni") {
            iconName = "home";
          } else if (route.name === "Progresos") {
            iconName = "fitness-center";
          } else if (route.name === "Perfil") {
            iconName = "person";
          }
          return (
            <Icon name={iconName} type="material" color={color} size={size} />
          );
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      {userRole === "admin" ? (
        <Tab.Screen
          name="Alunni"
          component={TrainerStackNavigator}
          options={{ title: "Alunni" }}
        />
      ) : (
        <Tab.Screen
          name="Rutina"
          component={RutinaStackNavigator}
          options={{ title: "Rutina" }}
        />
      )}
      <Tab.Screen
        name="Progresos"
        component={ProgressStackNavigator}
        options={{ title: "Progressi" }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStackNavigator}
        options={{ title: "Profilo" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Login");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwt_decode(token);
          console.log("Decoded token:", decoded); // Verificar qué hay en el token
          setUserRole(decoded.user.role);
          if (decoded.exp * 1000 > Date.now()) {
            setInitialRoute("Home");
          } else {
            AsyncStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token no valido:", error);
          AsyncStorage.removeItem("token");
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
            headerStyle: { backgroundColor: "#FFD700" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Accedi" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Registrati" }}
          />
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {() => <HomeTabNavigator userRole={userRole} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}