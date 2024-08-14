import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateRoutineScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [professor, setProfessor] = useState('');
  const [studentName, setStudentName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([]);
  const [exerciseId, setExerciseId] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStudentAndProfessor = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        // Obtener la información del estudiante y su profesor
        const studentResponse = await axios.get(`http://localhost:3001/api/users/${studentId}`, config);
        setStudentName(`${studentResponse.data.name} ${studentResponse.data.surname}`);
        setProfessor(studentResponse.data.professor);

        // Obtener la información del profesor
        const professorResponse = await axios.get(`http://localhost:3001/api/users/${studentResponse.data.professor}`, config);
        setProfessorName(`${professorResponse.data.name} ${professorResponse.data.surname}`);

        // Obtener la lista de ejercicios
        const exercisesResponse = await axios.get('http://localhost:3001/api/exercises/all', config);
        const exerciseItems = exercisesResponse.data.map(exercise => ({
          label: exercise.name,
          value: exercise._id,
        }));
        setExerciseList(exerciseItems);
      } catch (error) {
        console.error('Error fetching student, professor, or exercises:', error);
      }
    };

    fetchStudentAndProfessor();
  }, [studentId]);

  const handleAddExercise = () => {
    if (exerciseId && quantity) {
      const newExercise = { exerciseId, quantity };
      setExercises([...exercises, newExercise]);
      setExerciseId(null);
      setQuantity('');
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const response = await axios.post('http://localhost:3001/api/routines/create', {
        name,
        description,
        studentId,
        professorId: professor,
        exercises,
      }, config);

      console.log('Routine created:', response.data);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating routine:', error);
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
        open={isDropdownOpen}
        value={exerciseId}
        items={exerciseList}
        setOpen={setIsDropdownOpen}
        setValue={setExerciseId}
        setItems={setExerciseList}
        placeholder="Seleziona esercizio"
        style={styles.dropdown}
        placeholderStyle={{ color: '#999' }}
        labelStyle={{ color: '#000' }}
        containerStyle={{ marginBottom: 10 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantità"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <Text style={styles.addButtonText}>Aggiungi esercizio</Text>
      </TouchableOpacity>

      {exercises.length > 0 && (
        <View style={styles.exerciseList}>
          {exercises.map((ex, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text>{exerciseList.find(exItem => exItem.value === ex.exerciseId)?.label} - {ex.quantity} volte</Text>
              <TouchableOpacity onPress={() => {
                const newExercises = exercises.filter((_, i) => i !== index);
                setExercises(newExercises);
              }}>
                <Text style={styles.removeButton}>Rimuovi</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
        <Text style={styles.createButtonText}>Crea Routine</Text>
      </TouchableOpacity>
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
  },
  input: {
    height: 40,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  dropdown: {
    borderColor: '#FFD700',
    borderRadius: 5,
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  removeButton: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});

export default CreateRoutineScreen;