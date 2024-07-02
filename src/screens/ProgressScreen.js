import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProgressScreen = () => {
  const navigation = useNavigation();
  const [newExercise, setNewExercise] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleAddExercise = () => {
    if (newExercise.trim()) {
      setExercises([...exercises, newExercise]);
      setNewExercise("");
    }
  };

  const renderButtons = () => {
    return exercises.map((exercise, index) => (
      <Button
        key={index}
        title={exercise}
        onPress={() =>
          navigation.navigate("ExerciseDetail", { exerciseName: exercise })
        }
      />
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progresos</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nuevo ejercicio"
          value={newExercise}
          onChangeText={setNewExercise}
        />
        <Button title="Agregar" onPress={handleAddExercise} />
      </View>
      <View style={styles.buttonContainer}>{renderButtons()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginRight: 8,
    flex: 1,
    fontSize: 18,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default ProgressScreen;