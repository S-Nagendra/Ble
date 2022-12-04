import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";
import Modal from "react-native-modal";

const Dialog = (props) => {
    const { visible } = props;
    return (
        <View style={styles.container}>
            <Modal isVisible={visible}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    {props.children}
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    }
});

export default Dialog;