import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router'


function App() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
    </Stack>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323'
  },
});
