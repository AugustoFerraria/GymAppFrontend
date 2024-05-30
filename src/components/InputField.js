import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Input } from 'react-native-elements';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry, error, keyboardType }) => {
  return (
    <View style={styles.container}>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        errorMessage={error}
        keyboardType={keyboardType}
        inputStyle={styles.input}
        containerStyle={styles.inputContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 10,
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
});

export default InputField;