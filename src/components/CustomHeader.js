import React from 'react';
import { Header } from 'react-native-elements';

const CustomHeader = ({ title, navigation }) => {
  return (
    <Header
      centerComponent={{ text: title, style: { color: '#fff', fontSize: 18 } }}
      containerStyle={{ backgroundColor: '#FFD700' }}
      leftComponent={{ icon: 'menu', color: '#fff', onPress: () => navigation.toggleDrawer() }}
    />
  );
};

export default CustomHeader;