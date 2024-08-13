import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewRoutineScreen = ({ route }) => {
  const { studentId } = route.params;
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      try {
        const response = await axios.get(`http://localhost:3001/api/routines/${studentId}`, config);
        setRoutine(response.data);
      } catch (error) {
        console.error('Error fetching routine:', error);
      }
    };

    fetchRoutine();
  }, [studentId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutina</Text>
      {routine ? (
        <Text style={styles.routine}>{routine}</Text>
      ) : (
        <Text>No hay rutina disponible</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  routine: {
    fontSize: 16,
  },
});

export default ViewRoutineScreen;