// Función para decodificar el JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]; // Obtener la parte del payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Ejemplo de uso en RutinaScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RutinaScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Fetching user...');
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token from AsyncStorage:', token);

        if (token) {
          const decoded = decodeJWT(token); // Usar la función manual
          console.log('Decoded user:', decoded);

          setUser(decoded.user);

          if (decoded.user.role === 'admin') {
            console.log('User is admin, fetching students...');
            await fetchStudents(decoded.user.id);
          }
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error in fetchUser:', error);
      }
    };

    const fetchStudents = async (adminId) => {
      try {
        console.log('Fetching students for admin:', adminId);
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/users/students`, {
          headers: { 'x-auth-token': token }
        });
        console.log('Students fetched:', response.data);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    console.log('User not set yet...');
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user.role === 'admin') {
    console.log('Rendering admin view...');
    return (
      <View style={styles.container}>
        <FlatList
          data={students}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ViewRoutine', { studentId: item._id })}>
              <View style={styles.studentItem}>
                <Text>{item.name} {item.surname}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  console.log('Rendering user view...');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutina</Text>
      {/* Aquí puedes añadir la lógica para mostrar la rutina del usuario */}
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
  studentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RutinaScreen;