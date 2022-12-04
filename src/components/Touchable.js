import { TouchableOpacity, Text } from "react-native";
import Constants from "../Constants";

export const Touchable = ({ title, onPress, styles }) => {
    return (
        <TouchableOpacity style={[{
            height: 50,
            width: 150,
            backgroundColor: Constants.COLOR.ORANGE,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginVertical: 15
        }, styles]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Text style={{ color: Constants.COLOR.WHITE }}>{title}</Text>
        </TouchableOpacity>
    )
}