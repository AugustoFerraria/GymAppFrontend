import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { List, Button, IconButton } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const TrainerScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [routines, setRoutines] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const config = {
            headers: {
              "x-auth-token": token,
            },
          };
          const response = await axios.get(
            "http://localhost:3001/api/auth/user",
            config
          );
          setUser(response.data);

          if (response.data.role === "admin") {
            fetchStudents();
          } else {
            fetchRoutines(response.data._id);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      const fetchStudents = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const config = {
            headers: {
              "x-auth-token": token,
            },
          };
          const response = await axios.get(
            "http://localhost:3001/api/users/students",
            config
          );
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };

      fetchUser();
    }, [])
  );

  useEffect(() => {
    if (route.params?.refresh || shouldRefresh) {
      fetchAllRoutines();
      setShouldRefresh(false);
    }
  }, [route.params?.refresh, shouldRefresh]);

  const fetchRoutines = async (studentId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      const response = await axios.get(
        `http://localhost:3001/api/routines/student/${studentId}`,
        config
      );
      setRoutines((prev) => ({ ...prev, [studentId]: response.data }));
    } catch (error) {
      console.error("Error fetching routines:", error);
    }
  };

  const fetchAllRoutines = async () => {
    students.forEach((student) => fetchRoutines(student._id));
  };

  const handlePress = async (studentId) => {
    setExpanded((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
    if (!routines[studentId]) {
      fetchRoutines(studentId);
    }
  };

  const handleCreateRoutinePress = (studentId) => {
    navigation.navigate("CreateRoutine", {
      studentId,
      onGoBack: () => setShouldRefresh(true),
    });
  };

  const handleDeleteRoutine = async (routineId, studentId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      const response = await axios.delete(
        `http://localhost:3001/api/routines/${routineId}`,
        config
      );

      if (response.status === 200) {
        setRoutines((prevRoutines) => {
          const updatedRoutines = { ...prevRoutines };
          updatedRoutines[studentId] = updatedRoutines[studentId].filter(
            (routine) => routine._id !== routineId
          );
          return updatedRoutines;
        });
      }
    } catch (error) {
      console.error("Error al eliminar la rutina:", error);
    }
  };

  const renderRoutines = (studentId) => {
    const studentRoutines = routines[studentId] || [];

    return (
      <View>
        {studentRoutines.map((routine) => (
          <View key={routine._id} style={styles.routineItem}>
            <Text style={styles.routineText}>{routine.name}</Text>
            <View style={styles.buttonContainer}>
              <IconButton
                icon="eye"
                onPress={() =>
                  navigation.navigate("ViewRoutine", { routineId: routine._id })
                }
                style={styles.iconButton}
                size={20}
              />
              {user.role === "admin" && (
                <>
                  <IconButton
                    icon="pencil"
                    onPress={() =>
                      navigation.navigate("EditRoutine", {
                        routineId: routine._id,
                      })
                    }
                    style={styles.iconButton}
                    size={20}
                  />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDeleteRoutine(routine._id, studentId)}
                    style={styles.iconButton}
                    size={20}
                  />
                </>
              )}
            </View>
          </View>
        ))}
        {user.role === "admin" && (
          <Button
            mode="contained"
            onPress={() => handleCreateRoutinePress(studentId)}
            style={styles.createRoutineButton}
          >
            Crea Nuova Routine
          </Button>
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {user && user.role === "admin"
          ? students.map((student) => (
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
            ))
          : user && renderRoutines(user._id)}
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
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  accordion: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  accordionTitle: {
    color: "#252525",
    fontWeight: "bold",
  },
  routineItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routineText: {
    color: "#757575",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: -1,
  },
  createRoutineButton: {
    backgroundColor: "#FFD700",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default TrainerScreen;