import { StyleSheet, Text, View } from 'react-native';
import React from 'react';


function HomeScreen() {
  return (
      <View style={styles.container}>
        <Text style={{color:'white'}}>lorem ipsum</Text>
      </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323'
  },
});
