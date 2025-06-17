
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={myStyles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container:{
        backgroundColor: 'purple',
        justifyContent: "center",
        alignItems: "center",
      }
})
