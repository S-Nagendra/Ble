import React from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import CalendarModule from "./CalendarModule";

const BleConnect = props => {
    const onPress = () => {
        CalendarModule.createCalendarEvent('MyFirstReactNativeEvent', 'hyderabad');
    };
    return (
        <React.StrictMode>
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={{
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "orange"
                }}
                    activeOpacity={0.7}
                    onPress={onPress}>
                    <Text>NativeModule</Text>
                </TouchableOpacity>
            </View>
        </React.StrictMode>
    )
}

export default BleConnect;