import { COLORS } from "@/constants/colors.js";
import {View } from "react-native";
import {useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({children}) => {
    const insets = useSafeAreaInsets()
    return(
        <View style={{paddingTop:insets.top,flex:1,backgroundColor:COLORS.background}}>{children}</View>
    )
}

export {SafeScreen};