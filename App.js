
import { StyleSheet, Text, View } from 'react-native';
import ChatScreen from './screens/chatScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
