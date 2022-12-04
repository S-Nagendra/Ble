import React from "react";
import {
    View,
    StyleSheet
} from "react-native";
import Constants from "../Constants";
import { Touchable } from "./Touchable";

const Home = (props) => {

    const navigateToScreen = function (screenName) {
        props.navigation.navigate(screenName);
    }

    const CustomButton = function (buttonName, bgColor, onPress) {
        return (
            <Touchable
                title={buttonName}
                onPress={onPress}
                styles={{
                    backgroundColor: bgColor
                }}
            />
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                {CustomButton("Ble Module", Constants.COLOR.ORANGE, () => navigateToScreen(Constants.ROUTES.BLE))}
                {CustomButton("Contacts Module", Constants.COLOR.DARKBLUE, () => navigateToScreen(Constants.ROUTES.CONTACTS))}
            </View>
            <View style={styles.section}>
                {CustomButton("Map Module", Constants.COLOR.LIGHTBLUE, () => navigateToScreen(Constants.ROUTES.MAP))}
                {CustomButton("Calendar Module", Constants.COLOR.BROWN, () => navigateToScreen(Constants.ROUTES.CALENDAR))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        flexDirection: "row",
        justifyContent: "space-around"
    }
})

export default Home;