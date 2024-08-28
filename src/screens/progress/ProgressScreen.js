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
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const ProgressScreen = () => {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [data, setData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exercises, setExercises] = useState([]);
  const [userId, setUserId] = useState("");
  const [isWeightMode, setIsWeightMode] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserId(decodedToken.user.id);
      }
    };

    fetchUserId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchExercises = async () => {
        try {
          const res = await axios.get("http://localhost:3001/api/exercises/all");
          setExercises(res.data);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };

      const fetchProgresses = async () => {
        if (userId && selectedExercise) {
          try {
            const res = await axios.get(
              `http://localhost:3001/api/progresses?userId=${userId}&exerciseId=${selectedExercise}`
            );
            setData(res.data);
          } catch (error) {
            console.error("Errore durante il recupero dei dati di progresso:", error);
          }
        }
      };

      fetchExercises();
      fetchProgresses();
    }, [shouldRefresh, userId, selectedExercise])
  );

  const handleAddProgress = async () => {
    const value = isWeightMode ? parseFloat(weight) : parseInt(reps);

    if (isNaN(value) || !selectedExercise) {
      Alert.alert(
        "Per favore inserisci valori validi e seleziona un esercizio."
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
      console.error("Errore durante l'aggiunta del progresso:", error);
    }
  };

  const handleExerciseChange = async (exerciseId) => {
    setSelectedExercise(exerciseId);
    setData([]);

    if (userId && exerciseId) {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/progresses?userId=${userId}&exerciseId=${exerciseId}`
        );
        setData(res.data);
      } catch (error) {
        console.error("Errore durante il recupero dei dati di progresso:", error);
      }
    }
  };

  const renderChart = () => {
    const filteredData = data.filter((entry) =>
      isWeightMode ? entry.weight : entry.reps
    );

    if (filteredData.length === 0) return <Text>Nessun dato disponibile</Text>;

    const dates = filteredData.map((entry) => {
      const date = new Date(entry.date);
      return date instanceof Date && !isNaN(date)
        ? date.toLocaleDateString()
        : "Data non valida";
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
        width={screenWidth - 40}
        height={300}
        yAxisSuffix={isWeightMode ? "kg" : "reps"}
        chartConfig={{
          backgroundColor: "#B0B0B0",
          backgroundGradientFrom: "rgba(70, 77, 79, 0.6)",
          backgroundGradientTo: "rgba(0, 0, 0, 0.6)",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(243, 243, 25, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(243, 243, 25, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#FFD700",
          },
          propsForLabels: {
            fontSize: "12",
            fontWeight: "bold",
            fill: "#FFD700",
          },
          yAxisLabel: "",
          yAxisInterval: 1,
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        decorator={() => {
          return values.map((value, index) => {
            return (
              <Text
                key={index}
                style={{
                  position: "absolute",
                  top: `${300 - value}px`,
                  left: `${index * (screenWidth - 40) / values.length}px`,
                  color: "#FFD700",
                }}
              >
                {value}
              </Text>
            );
          });
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
          onValueChange={handleExerciseChange}
        >
          <Picker.Item label="Esercizio" value="" />
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
          placeholder={isWeightMode ? "Peso" : "Ripetizioni"}
          keyboardType="numeric"
          value={isWeightMode ? weight : reps}
          onChangeText={isWeightMode ? setWeight : setReps}
        />
        <Button
          title={isWeightMode ? "Aggiungi Peso" : "Aggiungi Ripetizioni"}
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
          title="RIPETIZIONI"
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