import React, { useState, useEffect } from "react";
import { ScrollView, Alert, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "../../components/InputField";
import PickerField from "../../components/PickerField";
import ErrorText from "../../components/ErrorText";
import Background from "../../components/Background";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [role, setRole] = useState("user");
  const [professorId, setProfessorId] = useState("");
  const [professors, setProfessors] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users/all");
        setProfessors(response.data.filter((user) => user.role === "admin"));
      } catch (error) {
        console.error("Errore nel recupero dei professori:", error);
      }
    };

    fetchProfessors();
  }, []);

  const handleRegister = async () => {
    let validationErrors = {};

    if (!name) validationErrors.name = "Questo campo è obbligatorio";
    if (!surname) validationErrors.surname = "Questo campo è obbligatorio";
    if (!email) validationErrors.email = "Questo campo è obbligatorio";
    if (!password) validationErrors.password = "Questo campo è obbligatorio";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Questo campo è obbligatorio";
    if (password !== confirmPassword)
      validationErrors.confirmPassword = "Le password non corrispondono";

    if (role === "user" && !professorId) {
      validationErrors.professorId = "Devi selezionare un professore";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        name,
        surname,
        email,
        password,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        role,
        professorId: role === "user" ? professorId : null,
      });

      const { token, user } = res.data;

      if (token) {
        await AsyncStorage.setItem("token", token);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home", params: { role: user.role } }],
        });
      } else {
        console.error("No token returned after registration");
      }
    } catch (error) {
      console.error(
        "Errore durante la registrazione:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.error });
      } else {
        Alert.alert(
          "Errore durante la registrazione",
          "C'è stato un problema durante la registrazione dell'utente"
        );
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
          <InputField
            placeholder="Cognome"
            value={surname}
            onChangeText={setSurname}
            error={errors.surname}
          />
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <InputField
            placeholder="Conferma Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />
          <InputField
            placeholder="Età"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <InputField
            placeholder="Peso"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <InputField
            placeholder="Altezza"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <PickerField
            label="Ruolo"
            selectedValue={role}
            onValueChange={setRole}
            items={[
              { label: "Utente", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
          />
          {role === "user" && (
            <PickerField
              label="Seleziona Professore"
              selectedValue={professorId}
              onValueChange={setProfessorId}
              items={[
                { label: "Seleziona Professore", value: "" },
                ...professors.map((prof) => ({
                  label: `${prof.name} ${prof.surname}`,
                  value: prof._id,
                })),
              ]}
              error={errors.professorId}
            />
          )}
          <Button
            title="Registrati"
            onPress={handleRegister}
            buttonStyle={styles.button}
          />
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
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
    justifyContent: "center",
    padding: 16,
  },
  innerContainer: {
    paddingTop: 25,
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2089dc",
    marginTop: 16,
  },
  link: {
    marginTop: 16,
    color: "blue",
    textAlign: "center",
  },
});

export default RegisterScreen;