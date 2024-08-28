import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";

const ExerciseDetailScreen = ({ route }) => {
  const { exerciseName } = route.params;
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/progresses/${exerciseName}`)
      .then((response) => {
        setData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [exerciseName]);

  const handleAddWeight = () => {
    const weightValue = parseFloat(weight);
    const repsValue = parseInt(reps);

    if (isNaN(weightValue) || isNaN(repsValue)) {
      alert("Por favor ingrese valores válidos para peso y repeticiones.");
      return;
    }

    axios
      .post(`/api/progresses/new`, {
        exerciseName,
        weight: weightValue,
        reps: repsValue,
        date: new Date(),
      })
      .then((response) => {
        setData([...data, response.data]);
        setWeight("");
        setReps("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles de {exerciseName}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Peso"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Repeticiones"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
        <Text style={styles.unit}>KG</Text>
      </View>
      <Button title="Agregar Peso" onPress={handleAddWeight} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 8,
    flex: 1,
    fontSize: 18,
  },
  unit: {
    marginLeft: 8,
    fontSize: 18,
  },
});

export default ExerciseDetailScreen;