import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
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
      <DataTable>
        <DataTable.Header>
          <DataTable.Title textStyle={styles.headerText}>Exercise</DataTable.Title>
          <DataTable.Title textStyle={styles.headerText} numeric>Quantity</DataTable.Title>
        </DataTable.Header>

        {routine.exercises.map((exercise, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>
              <Text style={styles.tableCellText}>{exercise.exerciseId.name}</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.tableCellText}>{exercise.quantity}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
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
  headerText: {
    fontSize: 16,
    color: '#151515',
  },
  tableCellText: {
    fontSize: 16,
    color: '#151515',
  },
});

export default ViewRoutineScreen;