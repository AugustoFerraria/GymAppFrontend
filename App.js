import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TrainerScreen from "./src/screens/TrainerScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import ExerciseDetailScreen from "./src/screens/ExerciseDetailScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CreateExerciseScreen from "./src/screens/CreateExerciseScreen";
import CreateRoutineScreen from "./src/screens/CreateRoutineScreen";
import ViewRoutineScreen from "./src/screens/ViewRoutineScreen";
import EditRoutineScreen from "./src/screens/EditRoutineScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        name="Routine"
        component={TrainerScreen}
        options={{ headerTitle: "Routine", headerLeft: null }}
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
      <Stack.Screen
        name="EditRoutine"
        component={EditRoutineScreen}
        options={{ headerTitle: "Modifica Routine" }}
      />
    </Stack.Navigator>
  );
}

function ProgressStackNavigator() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.user.role === "admin") {
          setIsAdmin(true);
        }
      }
    };

    checkUserRole();
  }, []);

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
          headerRight: () =>
            isAdmin ? (
              <Icon
                name="add"
                type="material"
                color="#fff"
                onPress={() => navigation.navigate("CreateExercise")}
                containerStyle={{ marginRight: 15 }}
              />
            ) : null,
          headerLeft: null,
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
        options={{ headerTitle: "Profilo", headerLeft: null }}
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
          if (route.name === "Routine" || route.name === "Rutina") {
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
      <Tab.Screen
        name="Routine"
        component={TrainerStackNavigator}
        options={{ title: "Routine" }}
      />
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

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Login");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = decodeJWT(token);
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