import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Button, Icon } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    role: "",
  });
  const [token, setToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        fetchUserData(storedToken);
      } else {
        Alert.alert("Errore", "Nessun token trovato");
      }
    };
    fetchToken();
  }, []);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get("http://localhost:3001/api/users/me", {
        headers: { "x-auth-token": token },
      });
      setUserData({
        ...res.data,
        age: res.data.age ? res.data.age.toString() : "",
        height: res.data.height ? res.data.height.toString() : "",
        weight: res.data.weight ? res.data.weight.toString() : "",
      });
    } catch (error) {
      console.error("Errore durante il recupero dei dati utente", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/api/users/me",
        {
          name: userData.name,
          surname: userData.surname,
          age: userData.age ? parseInt(userData.age) : null,
          height: userData.height ? parseFloat(userData.height) : null,
          weight: userData.weight ? parseFloat(userData.weight) : null,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      Alert.alert("Successo", "Dati utente aggiornati con successo");
      setIsEditing(false);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati utente", error);
      Alert.alert("Errore", "Impossibile aggiornare i dati utente");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          icon={<Icon name="edit" type="material" color="#fff" />}
          buttonStyle={styles.editButton}
          onPress={() => setIsEditing(true)}
        />
      ),
      headerStyle: { backgroundColor: "#FFD700" },
      headerTintColor: "#fff",
      headerTitle: "Profilo",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
        editable={isEditing}
      />
      <Text style={styles.label}>Cognome</Text>
      <TextInput
        style={styles.input}
        value={userData.surname}
        onChangeText={(text) => setUserData({ ...userData, surname: text })}
        editable={isEditing}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={userData.email} editable={false} />
      <Text style={styles.label}>Età</Text>
      <TextInput
        style={styles.input}
        value={userData.age}
        keyboardType="numeric"
        onChangeText={(text) => setUserData({ ...userData, age: text })}
        editable={isEditing}
      />
      <Text style={styles.label}>Altezza</Text>
      <TextInput
        style={styles.input}
        value={userData.height}
        keyboardType="numeric"
        onChangeText={(text) => setUserData({ ...userData, height: text })}
        editable={isEditing}
      />
      <Text style={styles.label}>Peso</Text>
      <TextInput
        style={styles.input}
        value={userData.weight}
        keyboardType="numeric"
        onChangeText={(text) => setUserData({ ...userData, weight: text })}
        editable={isEditing}
      />
      <Text style={styles.label}>Ruolo</Text>
      <TextInput style={styles.input} value={userData.role} editable={false} />
      <View style={styles.buttonContainer}>
        {isEditing && (
          <Button
            title="Salva"
            onPress={handleSave}
            buttonStyle={styles.saveButton}
            icon={<Icon name="save" type="material" color="#fff" />}
          />
        )}
        <Button
          title="Esci"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          icon={<Icon name="logout" type="material" color="#fff" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#2089dc",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    width: 150,
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 150,
  },
  editButton: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
});

export default ProfileScreen;