import React, { useState } from "react";
import {
    TextInput,
    View,
    TouchableOpacity,
    Text
} from "react-native";
import BleModal from "./BleModal";

const BleInput = ({ onSubmitHandler, value, onChangeText }) => {
    return (
        <BleModal style={{
            opacity: 1,
            backgroundColor: "white"
        }}>
            <View style={{
                height: 250,
                width: 300,
                backgroundColor: "#999",
                alignItems: "center",
                justifyContent: "space-around"
            }}>
                <TextInput
                    style={{
                        height: 50,
                        margin: 10,
                        borderWidth: 1,
                        padding: 10,
                        width: 250,
                        backgroundColor: "white",
                        borderRadius: 5
                    }}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder="enter value"
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onSubmitHandler}
                    style={{
                        width: 150,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "brown"
                    }}>
                    <Text style={{ color: "white" }}>Update</Text>
                </TouchableOpacity>
            </View>

        </BleModal>
    )
}

export default BleInput;