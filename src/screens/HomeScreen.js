import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

const HomeScreen = ({ route, navigation }) => {
  const { role } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Button
          title="Rutina"
          onPress={() => navigation.navigate('Rutina')}
          buttonStyle={styles.button}
        />
        <Button
          title="Esercizi"
          onPress={() => navigation.navigate('Esercizi')}
          buttonStyle={styles.button}
        />
        {role === 'admin' && (
          <Button
            title="Studenti"
            onPress={() => navigation.navigate('Studenti')}
            buttonStyle={styles.button}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginBottom: 12,
    backgroundColor: '#2089dc',
  },
});

export default HomeScreen;