import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BleScanner from "./components/BleScanner";
import Calendar from "./components/Calendar";
import UserContacts from "./components/UserContacts";
import Map from "./components/Map";
import Home from "./components/Home";
import Constants from "./Constants";

const RootStack = createNativeStackNavigator();

const RootNavigator = (props) => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name={Constants.ROUTES.HOME} component={Home} />
            <RootStack.Screen name={Constants.ROUTES.BLE} component={BleScanner} />
            <RootStack.Screen name={Constants.ROUTES.CALENDAR} component={Calendar} />
            <RootStack.Screen name={Constants.ROUTES.CONTACTS} component={UserContacts} />
            <RootStack.Screen name={Constants.ROUTES.MAP} component={Map} />
        </RootStack.Navigator>
    )
}

export default RootNavigator;