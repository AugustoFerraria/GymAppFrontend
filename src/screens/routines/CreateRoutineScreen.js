import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateRoutineScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [professor, setProfessor] = useState("");
  const [studentName, setStudentName] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [sets, setSets] = useState("");
  const [notes, setNotes] = useState("");
  const [exerciseList, setExerciseList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const fetchStudentAndProfessor = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const config = {
          headers: {
            "x-auth-token": token,
          },
        };

        const studentResponse = await axios.get(
          `http://localhost:3001/api/users/${studentId}`,
          config
        );
        setStudentName(
          `${studentResponse.data.name} ${studentResponse.data.surname}`
        );
        setProfessor(studentResponse.data.professor);

        const professorResponse = await axios.get(
          `http://localhost:3001/api/users/${studentResponse.data.professor}`,
          config
        );
        setProfessorName(
          `${professorResponse.data.name} ${professorResponse.data.surname}`
        );

        const exercisesResponse = await axios.get(
          "http://localhost:3001/api/exercises/all",
          config
        );
        setExerciseList(
          exercisesResponse.data.map((exercise) => ({
            label: exercise.name,
            value: exercise._id,
          }))
        );
      } catch (error) {
        console.error(
          "Error fetching student, professor, or exercises:",
          error
        );
      }
    };

    fetchStudentAndProfessor();
  }, [studentId]);

  const handleAddExercise = () => {
    if (selectedExercise && quantity) {
      const newExercise = { exerciseId: selectedExercise, quantity, sets, notes };
      setExercises([...exercises, newExercise]);
      setSelectedExercise(null);
      setQuantity("");
      setSets("");
      setNotes("");
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || exercises.length === 0 || !professor) {
      Alert.alert('Error', 'Per favore, compila tutti i campi e aggiungi almeno un esercizio.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      const payload = {
        name,
        description,
        studentId,
        professorId: professor,
        exercises: exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          quantity: ex.quantity,
          sets: ex.sets || 1,
          notes: ex.notes || "",
        })),
      };

      const response = await axios.post(
        "http://localhost:3001/api/routines/create",
        payload,
        config
      );

      if (response.status === 201) {
        navigation.goBack();
        route.params?.onGoBack();
      }
    } catch (error) {
      console.error("Error creating routine:", error);
      Alert.alert('Error', 'Failed to create routine.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Studente: {studentName}</Text>
      <Text style={styles.label}>Professore: {professorName}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome della routine"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrizione"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Esercizi:</Text>
      <DropDownPicker
        open={openDropdown}
        value={selectedExercise}
        items={exerciseList}
        setOpen={setOpenDropdown}
        setValue={setSelectedExercise}
        placeholder="Seleziona esercizio"
        style={styles.picker}
      />
      <TextInput
        style={styles.input}
        placeholder="Ripetizioni"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Serie"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Note"
        value={notes}
        onChangeText={setNotes}
      />

      <Button
        mode="contained"
        onPress={handleAddExercise}
        style={styles.addButton}
      >
        Aggiungi esercizio
      </Button>

      {exercises.length > 0 && (
        <View style={styles.exerciseTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Esercizio</Text>
            <Text style={styles.tableHeaderText}>Ripetizioni</Text>
            <Text style={styles.tableHeaderText}>Serie</Text>
            <Text style={styles.tableHeaderText}>Note</Text>
          </View>
          {exercises.map((exercise, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellText}>
                {exerciseList.find((ex) => ex.value === exercise.exerciseId)?.label}
              </Text>
              <Text style={styles.tableCellText}>{exercise.quantity}</Text>
              <Text style={styles.tableCellText}>{exercise.sets}</Text>
              <Text style={styles.tableCellText}>{exercise.notes}</Text>
            </View>
          ))}
        </View>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.saveButton}
      >
        Crea Routine
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#151515',
  },
  input: {
    height: 40,
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    color: '#151515',
  },
  picker: {
    borderColor: "#FFD700",
    borderRadius: 5,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007BFF',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#FFD700',
  },
  exerciseTable: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#FFD700",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  tableCellText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
});

export default CreateRoutineScreen;