import { Image } from "expo-image";
import {View, Text} from "react-native"

const about = () => {
    return (
        <View>
            <Text>About</Text>
            <Image
                source={require("@/assets/images/react-logo.png")}
                style={{width:100, height:100}}
            >

            </Image>
        </View>
    )
}

export default about;
