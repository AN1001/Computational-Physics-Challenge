import { StyleSheet, Text, View } from 'react-native';
import React from 'react';


function Task1() {
  return (
      <View style={styles.container}>
        <Text style={{color:'white'}}>Task 1 here</Text>
      </View>
  );
}

export default Task1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323'
  },
});
