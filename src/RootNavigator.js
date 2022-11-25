import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BleScanner from "./components/BleScanner";
import BleConnect from "./components/BleConnect";
import UserContacts from "./components/UserContacts";
import Map from "./components/Map";

const RootStack = createNativeStackNavigator();

const RootNavigator = (props) => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name="Scanner" component={BleScanner} />
            <RootStack.Screen name="Connect" component={BleConnect} />
            <RootStack.Screen name="User_Contacts" component={UserContacts} />
            <RootStack.Screen name="Map" component={Map} />
        </RootStack.Navigator>
    )
}

export default RootNavigator;