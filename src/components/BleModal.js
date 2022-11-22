import React from "react";
import { View } from "react-native";

const BleModal = (props) => {
    return (
        <View style={{
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "#000",
            opacity: 0.5,
            zIndex: 100, 
            position: "absolute",
            alignItems:"center",
            justifyContent:"center"
        }}>
            {props.children}
        </View>
    )
}

export default BleModal;