import React from 'react';
import { Header } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const CustomHeader = ({ title, navigation }) => {
  return (
    <Header
      centerComponent={{ text: title, style: styles.centerComponent }}
      containerStyle={styles.headerContainer}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFD700',
    width: '100%',
    borderBottomWidth: 0, 
  },
  centerComponent: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CustomHeader;
