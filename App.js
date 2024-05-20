import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Sidebar from './components/sidebar';


export default function App() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{color:'white'}}>lorem ipsum</Text>
      <Sidebar></Sidebar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323'
  },
});
