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
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

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

  const renderChart = () => {
    if (data.length === 0) return <Text>No data available</Text>;

    const dates = data.map((entry) => {
      const date = new Date(entry.date);
      return date instanceof Date && !isNaN(date)
        ? date.toLocaleDateString()
        : "Invalid Date";
    });
    const weights = data.map((entry) =>
      !isNaN(entry.weight) ? entry.weight : 0
    );

    return (
      <LineChart
        data={{
          labels: dates,
          datasets: [
            {
              data: weights,
            },
          ],
        }}
        width={screenWidth - 40} // from react-native
        height={300}
        yAxisSuffix="kg"
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
      {renderChart()}
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