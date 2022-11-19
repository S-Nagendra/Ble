import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BleScanner from "./components/BleScanner";
import BleConnect from "./components/BleConnect";

const RootStack = createNativeStackNavigator();

const RootNavigator = (props) => {
    return(
        <RootStack.Navigator>
            <RootStack.Screen name="Scanner" component={BleScanner} />
            <RootStack.Screen name="Connect" component={BleConnect}/>
        </RootStack.Navigator>
    )
}

export default RootNavigator;