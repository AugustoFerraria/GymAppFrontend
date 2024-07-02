import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

const ProgressScreen = () => {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [data, setData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exercises, setExercises] = useState([]);
  const [userId, setUserId] = useState("");
  const [isWeightMode, setIsWeightMode] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserId(decodedToken.user.id);
      }
    };

    const fetchExercises = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/exercises/all");
        setExercises(res.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchUserId();
    fetchExercises();
  }, []);

  useEffect(() => {
    const fetchProgresses = async () => {
      if (userId && selectedExercise) {
        try {
          const res = await axios.get(
            `http://localhost:3001/api/progresses?userId=${userId}&exerciseId=${selectedExercise}`
          );
          setData(res.data);
        } catch (error) {
          console.error("Error fetching progress data:", error);
        }
      }
    };

    fetchProgresses();
  }, [userId, selectedExercise]);

  const handleAddProgress = async () => {
    const value = isWeightMode ? parseFloat(weight) : parseInt(reps);

    if (isNaN(value) || !selectedExercise) {
      Alert.alert(
        "Por favor ingrese valores válidos y seleccione un ejercicio."
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/progresses/new", {
        userId,
        exerciseId: selectedExercise,
        value,
        type: isWeightMode ? "weight" : "reps",
        date: new Date(),
      });
      setData([...data, res.data]);
      setWeight("");
      setReps("");
    } catch (error) {
      console.error("Error adding progress:", error);
    }
  };

  const renderChart = () => {
    const filteredData = data.filter((entry) =>
      isWeightMode ? entry.weight : entry.reps
    );

    if (filteredData.length === 0) return <Text>No data available</Text>;

    const dates = filteredData.map((entry) => {
      const date = new Date(entry.date);
      return date instanceof Date && !isNaN(date)
        ? date.toLocaleDateString()
        : "Invalid Date";
    });

    const values = filteredData.map((entry) =>
      isWeightMode ? entry.weight : entry.reps
    );

    return (
      <LineChart
        data={{
          labels: dates,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={screenWidth - 40} // from react-native
        height={300}
        yAxisSuffix={isWeightMode ? "kg" : "reps"}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={selectedExercise}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedExercise(itemValue)}
        >
          <Picker.Item label="Seleccionar Ejercicio" value="" />
          {exercises.map((exercise) => (
            <Picker.Item
              key={exercise._id}
              label={exercise.name}
              value={exercise._id}
            />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder={isWeightMode ? "Peso" : "Repeticiones"}
          keyboardType="numeric"
          value={isWeightMode ? weight : reps}
          onChangeText={isWeightMode ? setWeight : setReps}
        />
        <Button
          title={isWeightMode ? "Agregar Peso" : "Agregar Repeticiones"}
          onPress={handleAddProgress}
          color="#FFD700"
        />
      </View>
      {renderChart()}
      <View style={styles.toggleContainer}>
        <Button
          title="PESO"
          onPress={() => setIsWeightMode(true)}
          color={isWeightMode ? "#FFD700" : "grey"}
        />
        <Button
          title="REPS"
          onPress={() => setIsWeightMode(false)}
          color={!isWeightMode ? "#FFD700" : "grey"}
        />
      </View>
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
    marginBottom: 16,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 8,
    marginBottom: 16,
    fontSize: 18,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});

export default ProgressScreen;