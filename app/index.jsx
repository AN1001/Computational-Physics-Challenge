import { StyleSheet, Text, View } from 'react-native';
import React from 'react';


function App() {
  return (
      <View style={styles.container}>
        <Text style={{color:'white'}}>lorem ipsum</Text>
        <Text style={{color:'white'}}>lorem ipsum</Text>
      </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323'
  },
});
