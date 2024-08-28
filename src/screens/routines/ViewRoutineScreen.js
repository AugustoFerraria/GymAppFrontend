import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewRoutineScreen = ({ route }) => {
  const { routineId } = route.params;
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get(`http://localhost:3001/api/routines/${routineId}`, config);
        setRoutine(response.data);
      } catch (error) {
        console.error('Error fetching routine:', error);
      }
    };

    fetchRoutine();
  }, [routineId]);

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.description}>{routine.description}</Text>
      <View style={styles.exerciseTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Esercizio</Text>
          <Text style={styles.tableHeaderText}>Ripetizioni</Text>
          <Text style={styles.tableHeaderText}>Serie</Text>
          <Text style={styles.tableHeaderText}>Note</Text>
        </View>
        {routine.exercises.map((exercise, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCellText}>{exercise.exerciseId.name}</Text>
            <Text style={styles.tableCellText}>{exercise.quantity}</Text>
            <Text style={styles.tableCellText}>{exercise.sets}</Text>
            <Text style={styles.tableCellText}>{exercise.notes}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#101010',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#202020',
    marginBottom: 20,
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

export default ViewRoutineScreen;