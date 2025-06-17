import { Link } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    // view is same as div
    <View
      style={myStyles.container}
    >
      <Text>Edit app/index.tsx to edit this screen. 1234</Text>
      <Link href={"./about"}>About</Link>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }
})
