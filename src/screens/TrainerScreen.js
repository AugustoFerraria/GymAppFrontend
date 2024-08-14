import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Button, Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrainerScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [routines, setRoutines] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get('http://localhost:3001/api/users/students', config);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handlePress = async (studentId) => {
    setExpanded((prev) => ({ ...prev, [studentId]: !prev[studentId] }));

    if (!routines[studentId]) {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const response = await axios.get(`http://localhost:3001/api/routines/student/${studentId}`, config);
        setRoutines((prev) => ({ ...prev, [studentId]: response.data }));
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    }
  };

  const renderRoutines = (studentId) => {
    const studentRoutines = routines[studentId] || [];

    if (studentRoutines.length === 0) {
      return (
        <View style={styles.emptyRoutineContainer}>
          <Text style={styles.emptyRoutineText}>Crea la prima routine per questo studente</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateRoutine', { studentId })}
            style={styles.fab}
            icon="plus"
          >
            Crea Routine
          </Button>
        </View>
      );
    }

    return studentRoutines.map((routine) => (
      <View key={routine._id} style={styles.routineItem}>
        <Text style={styles.routineText}>{routine.name}</Text>
      </View>
    ));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {students.map((student) => (
          <View key={student._id} style={styles.cardContainer}>
            <List.Accordion
              title={`${student.name} ${student.surname}`}
              expanded={expanded[student._id] || false}
              onPress={() => handlePress(student._id)}
              style={styles.accordion}
              titleStyle={styles.accordionTitle}
            >
              {renderRoutines(student._id)}
            </List.Accordion>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  cardContainer: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  accordion: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  accordionTitle: {
    color: '#252525',
    fontWeight: 'bold',
  },
  emptyRoutineContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  emptyRoutineText: {
    color: '#303030',
    marginBottom: 10,
  },
  routineItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  routineText: {
    color: '#757575',
  },
  fab: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
  },
});

export default TrainerScreen;