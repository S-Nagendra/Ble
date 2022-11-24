import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BleScanner from "./components/BleScanner";
import BleConnect from "./components/BleConnect";
import UserContacts from "./components/UserContacts";

const RootStack = createNativeStackNavigator();

const RootNavigator = (props) => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name="Scanner" component={BleScanner} />
            <RootStack.Screen name="Connect" component={BleConnect} />
            <RootStack.Screen name="User_Contacts" component={UserContacts} />
        </RootStack.Navigator>
    )
}

export default RootNavigator;