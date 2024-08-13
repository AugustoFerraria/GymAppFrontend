import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem } from 'react-native-elements';
import jwt_decode from 'jwt-decode';

const TrainerScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwt_decode(token);
        setUser(decoded.user);
      }
    };

    const fetchStudents = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        console.log('Fetching students with config:', config); // Agrega este log para depurar
        try {
          const response = await axios.get('http://localhost:3001/api/users/students', config);
          setStudents(response.data);
          console.log('Students fetched:', response.data); // Agrega este log para depurar
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchUser();
    fetchStudents();
  }, []);

  const toggleDropdown = (studentId) => {
    setSelectedStudentId(selectedStudentId === studentId ? null : studentId);
  };

  const renderStudent = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => toggleDropdown(item._id)}>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.name} {item.surname}</ListItem.Title>
            <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
      {selectedStudentId === item._id && (
        <View style={styles.dropdown}>
          <Button
            title="Crear Rutina"
            onPress={() => navigation.navigate('CreateRoutine', { studentId: item._id })}
          />
          <Button
            title="Ver Rutina"
            onPress={() => navigation.navigate('ViewRoutine', { studentId: item._id })}
          />
        </View>
      )}
    </View>
  );

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alumnos</Text>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item._id}
      />
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
  dropdown: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
});

export default TrainerScreen;