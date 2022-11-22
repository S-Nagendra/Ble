import React from "react";
import { 
    View, 
    Text, 
    NativeModules,
    TouchableOpacity 
} from "react-native";

const { CalendarModule } = NativeModules;

const BleConnect = props => {
    const onPress = () => {
        console.log("onPress:_");
        CalendarModule.createCalendarEvent('testName', 'testLocation');
    };
    return(
        <View style={{ flex: 1}}>
            <TouchableOpacity style={{
                padding: 10,
                alignItems:"center",
                justifyContent:"center",
                backgroundColor:"orange"
            }}
            activeOpacity={0.7}
            onPress={onPress}>
                <Text>NativeModule</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BleConnect;