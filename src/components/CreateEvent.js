import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Constants from "../Constants";
import {
    addHours,
    formatDate,
    formatTime,
    hasDatesDiff
} from "../utils";
import { Touchable } from "./Touchable";

const CreateEvent = ({ hideDialog, eventHandler }) => {
    const [title, onChangeTitle] = useState("");
    const [location, onChangeLocation] = useState("");
    const [displayEndDate, setEndDateDisplay] = useState(false);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(addHours(date, 1)));
    const [displayButton, setDisplayButton] = useState(false);

    const eventDate = useMemo(() => {
        return formatDate(date);
    }, [date]);

    const eventTime = useMemo(() => {
        return formatTime(date);
    }, [date]);

    const eventEndDate = useMemo(() => {
        return formatDate(endDate);
    }, [endDate])

    const eventEndTime = useMemo(() => {
        return formatTime(endDate);
    }, [endDate])

    useEffect(() => {
        if (title && location) {
            if (!displayButton) {
                setDisplayButton(true);
            }
        } else {
            if (displayButton) {
                setDisplayButton(false);
            }
        }
    }, [title, location]);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const onChange = function (event, selectedDate) {
        const currentDate = selectedDate;
        setShow(false);
        setShow(false);
        if (displayEndDate) {
            if (!hasDatesDiff(date, currentDate)) return;
            setEndDate(currentDate);
            setEndDateDisplay(false);
            return;
        }
        setDate(currentDate);
        setEndDate(addHours(currentDate, 1));
    };

    const displayInput = (value, onChangeText, placeholder) => {
        return (
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                keyboardType="default"
            />
        )
    }

    const displayDateSection = (title, onDatePress, onTimePress, date, time) => {
        return (
            <>
                <Text style={[styles.text, { paddingHorizontal: 10, marginTop: 10 }]}>{title}</Text>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.inputField, { justifyContent: "space-between", flexDirection: "row", alignItems: "center" }]}
                >
                    <Text style={styles.inputText} onPress={onDatePress}>{date}</Text>
                    <Text style={styles.inputText} onPress={onTimePress}>{time}</Text>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={displayEndDate ? endDate : date}
                    mode={mode}
                    is24Hour={false}
                    onChange={onChange}
                    display="default"
                />
            )}
            <View style={styles.modal}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Add event</Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ justifyContent: "center" }}
                        onPress={hideDialog}>
                        <Icon name="close" size={30} color={Constants.COLOR.WHITE} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }}>
                    {displayInput(title, onChangeTitle, "Title")}
                    {displayDateSection("Event Start", () => {
                        setEndDateDisplay(false);
                        showDatepicker()
                    }, () => {
                        setEndDateDisplay(false);
                        showTimepicker()
                    }, eventDate, eventTime)}
                    {displayDateSection("Event End", () => {
                        setEndDateDisplay(true);
                        showDatepicker()
                    }, () => {
                        setEndDateDisplay(true);
                        showTimepicker()
                    }, eventEndDate, eventEndTime)}
                    {displayInput(location, onChangeLocation, "Location")}
                    <Touchable
                        title={"Create Event"}
                        onPress={() => {
                            if (!displayButton) return;
                            eventHandler({
                                title,
                                startDate: date,
                                endDate,
                                location
                            });
                        }}
                        styles={{
                            marginTop: 30,
                            backgroundColor: displayButton ? Constants.COLOR.ORANGE : Constants.COLOR.DARKGRAY,
                        }}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    modal: {
        height: 500,
        width: '98%',
        borderRadius: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        width: "100%",
        paddingHorizontal: 10,
        backgroundColor: Constants.COLOR.CYAN
    },
    headerTitle: {
        color: Constants.COLOR.WHITE,
        fontSize: 18
    },
    text: {
        color: Constants.COLOR.DARKGRAY,
        fontSize: 16,
        fontWeight: "bold"
    },
    input: {
        height: 40,
        margin: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#555'
    },
    inputText: {
        color: Constants.COLOR.DARKGRAY,
        fontSize: 14
    },
    inputField: {
        height: 50,
        elevation: 2,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        justifyContent: "center",
        backgroundColor: Constants.COLOR.WHITE,
    }
});


export default CreateEvent;