import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Platform,
    PermissionsAndroid,
    NativeModules,
    NativeEventEmitter,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import BleManager from "react-native-ble-manager";
const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

import { stringToBytes } from "convert-string";
import BleModal from "./BleModal";
import BleInput from "./BleInput";
const Buffer = require('buffer/').Buffer;

const BleScanner = (props) => {
    const [isScanning, setIsScanning] = useState(false);
    const [displayPeripherals, setDisplayPeripherals] = useState(false);
    const [list, setList] = useState([]);
    const peripherals = new Map();
    const [testMode, setTestMode] = useState('read');
    const ITEM_HEIGHT = 100;
    const [connectingPeripheral, setConnectingPeripheral] = useState(false);
    const [displayInput, setDisplayInput] = useState(false);
    const [peripheralValue, setPeripheralValue] = useState(null);
    const [selectedPeripheral, setSelectedPeripheral] = useState(null);

    useEffect(() => {
        BleManager.start({ showAlert: false, forceLegacy: true })
    }, []);

    useEffect(() => {
        console.log("Mount");
        // add ble listeners on mount
        const b1 = bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        const b2 = bleEmitter.addListener('BleManagerStopScan', handleStopScanEvent);
        const b3 = bleEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        const b4 = bleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        // check location permission only for android devices.
        if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then((r1) => {
                    console.log("Permission is OK");
                    return;
                })

            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r2) => {
                if (r2) {
                    console.log("User accept");
                    return;
                }
                console.log("User refuse");
            })

            // remove ble listeners on unmount

            return () => {
                console.log("unmount");
                b1.remove();
                b2.remove();
                b3.remove();
                b4.remove();
            }
        }
    }, []);

    const startScan = () => {
        // skip if scan process is currently happening
        if (isScanning) return;
        //first, clear existing peripherals
        peripherals.clear();
        setList(Array.from(peripherals.values()));

        // then re-scan the available peripherals for 3 seconds.
        const durationInSeconds = 5;
        BleManager.scan([], durationInSeconds, false)
            .then(() => {
                console.log("Scanning...");
                setIsScanning(true);
            })
            .catch(err => {
                console.error(err);
            })
    }

    // handle discovered peripheral
    const handleDiscoverPeripheral = (peripheral) => {
        if (!peripheral.name) {
            peripheral.name = "NO NAME"
        }
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
        setDisplayPeripherals(true);
    }

    // handle stop scan event

    const handleStopScanEvent = () => {
        console.log("Scan is stopped");
        setIsScanning(false);
    }

    // handle Disconnected peripheral
    const handleDisconnectedPeripheral = (data) => {
        console.log("Disconnected from " + data.peripheral);

        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        setTimeout(() => {
            setConnectingPeripheral(false);
        }, 500);
    }

    // handle updated value for characteristic
    const handleUpdateValueForCharacteristic = (data) => {
        console.log("Received data from: " + data.peripheral,
            'Characteristic: ' + data.characteristic,
            'Data: ' + data.value);
    }

    const getPeripheralName = (item) => {
        if (item.advertising) {
            if (item.advertising.localName) {
                return item.advertising.localName
            }
        }
        return item.name;
    }

    // update stored peripherals
    const updatePeripheral = (peripheral, callback) => {
        let p = peripherals.get(peripheral.id);
        if (!p) return;
        p = callback(p);
        peripherals.set(peripheral.id, p);
        setList(Array.from(peripherals.values()));
    };

    const updatePeripheralValue = (peripheral) => {
        console.log("update peripheral:_", peripheral);
        if (!peripheral) return;
        BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
            console.log('Retrieved peripheral services', peripheralInfo);
            const serviceUUID = '00001800-0000-1000-8000-00805f9b34fb';
            // // device name - read, write
            const charasteristicUUID = "00002a00-0000-1000-8000-00805f9b34fb";
            const payload = peripheralValue;
            const payloadBytes = stringToBytes(payload);
            console.log('payload:', payload);
            console.log("payload bytes:-", payloadBytes);

            BleManager.write(peripheral.id, serviceUUID, charasteristicUUID, payloadBytes)
                .then(() => {
                    console.log('write response', payload);
                    alert(`your "${payload}" is updated`);
                })
                .catch((error) => {
                    console.log('write err', error);
                });
            setConnectingPeripheral(false)
        })
    }

    const connectAndTestPeripheral = (peripheral) => {
        if (!peripheral) {
            return;
        }
        setConnectingPeripheral(true);
        console.log("test mode:_-----------", testMode);
        if (peripheral.connected) {
            BleManager.disconnect(peripheral.id);
            return;
        }
        // connect to selected peripheral
        BleManager.connect(peripheral.id)
            .then(() => {
                console.log('Connected to ' + peripheral.id, peripheral);

                // update connected attribute
                updatePeripheral(peripheral, (p) => {
                    p.connected = true;
                    return p;
                });
                // retrieve peripheral services info
                BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                    console.log('Retrieved peripheral services', peripheralInfo);

                    // test read current peripheral RSSI value
                    BleManager.readRSSI(peripheral.id).then((rssi) => {
                        console.log('Retrieved actual RSSI value', rssi);

                        // update rssi value
                        updatePeripheral(peripheral, (p) => {
                            p.rssi = rssi;
                            return p;
                        });
                    });

                    // test read and write data to peripheral
                    const serviceUUID = '00001800-0000-1000-8000-00805f9b34fb';
                    // device name - read, write
                    const charasteristicUUID = "00002a00-0000-1000-8000-00805f9b34fb";
                    // central address resolution
                    //const charasteristicUUID = "00002aa6-0000-1000-8000-00805f9b34fb"
                    //Peripheral Preferred Connection Parameters
                    //const charasteristicUUID = "00002a04-0000-1000-8000-00805f9b34fb"

                    console.log("test mode:-", testMode);

                    switch (testMode) {
                        case 'write':
                            // ===== test write data
                            const payload = peripheralValue;
                            const payloadBytes = stringToBytes(payload);
                            console.log('payload:', payload);
                            console.log("payload bytes:-", payloadBytes);

                            BleManager.write(peripheral.id, serviceUUID, charasteristicUUID, payloadBytes)
                                .then(() => {
                                    console.log('write response', payload);
                                    alert(`your "${payload}" is updated`);
                                })
                                .catch((error) => {
                                    console.log('write err', error);
                                });
                            // setTimeout(() => {
                            //     BleManager.startNotification(peripheral.id, serviceUUID, charasteristicUUID).then(() => {
                            //       console.log('Started notification on ' + peripheral.id);
                            //       setTimeout(() => {
                            //         BleManager.write(peripheral.id, serviceUUID, charasteristicUUID, payloadBytes).then(() => {
                            //           console.log('Writed NORMAL crust');
                            //           console.log('write response', payload);
                            //       alert(`your "${payload}" is stored to the food bank. Thank you!`);
                            //        });
                            //       }, 500);
                            //     }).catch((error) => {
                            //       console.log('Notification error', error);
                            //     });
                            //   }, 200);
                            break;

                        case 'read':
                            // ===== test read data
                            BleManager.read(peripheral.id, serviceUUID, charasteristicUUID)
                                .then((res) => {
                                    console.log('read response', res);
                                    if (res) {
                                        const buffer = Buffer.from(res);
                                        const data = buffer.toString();
                                        console.log('data', data);
                                        alert(`reading device name "${data}"`);
                                    }
                                })
                                .catch((error) => {
                                    console.log('read err', error);
                                    alert(error);
                                });
                            break;

                        // case 'notify':
                        //   // ===== test subscribe notification
                        //   BleManager.startNotification(peripheral.id, serviceUUID, charasteristicUUID)
                        //     .then((res) => {
                        //       console.log('start notification response', res);
                        //     });
                        //   break;

                        default:
                            break;
                    }
                    setConnectingPeripheral(false)
                });
            })
            .catch((error) => {
                console.log('Connection error', error);
                setConnectingPeripheral(false)
            });
    };

    const getItemLayout = useCallback((data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
    }), [])

    const renderItem = useCallback(({ item }) => {
        return (
            <View style={{
                flexDirection: "row",
                backgroundColor: "white",
                height: 100,
                elevation: 2,
                margin: 4,
                padding: 4,
                borderRadius: 15
            }}>
                {/** RSSI - Received Signal Strength Indicator */}
                <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "brown",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{ color: "white" }}>{item.rssi}</Text>
                </View>

                {/** Peripheral Details */}
                <View style={{
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center",
                    paddingHorizontal: 6
                }}>
                    <Text style={{ color: "#555", fontSize: 16 }}>{getPeripheralName(item)}</Text>
                    <Text style={{ color: "#666", fontSize: 12 }}>{item.id}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            // props.navigation.navigate('Ble_Details', {
                            //     macAddress: item.id,
                            //     name: getPeripheralName(item)
                            // })
                            connectAndTestPeripheral(item);
                        }}
                        style={{
                            padding: 8,
                            marginRight: 20,
                            borderRadius: 10,
                            backgroundColor: "green",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <Text style={{ color: "white" }}>{item.connected ? "DICONNECT" : "CONNECT"}</Text>
                    </TouchableOpacity>
                    {item.connected && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                setSelectedPeripheral(item);
                                setPeripheralValue(null);
                                setDisplayInput(true);
                            }}
                            style={{
                                padding: 5,
                                borderRadius: 5,
                                backgroundColor: "green",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 4
                            }}>
                            <Text style={{ color: "white" }}>{"Write"}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        )
    }, [])

    const emptyList = ({ item }) => {
        return <Text>Empty list</Text>
    }

    const keyExtractor = useCallback((item) => item.id.toString(), [])

    return (
        <View style={{ flex: 1 }}>
            {connectingPeripheral && (
                <BleModal>
                    <ActivityIndicator color={"yellow"} size={"large"} />
                </BleModal>
            )}
            {displayInput && <BleInput
                onChangeText={(val) => {
                    setPeripheralValue(val)
                }}
                value={peripheralValue}
                onSubmitHandler={() => {
                    setDisplayInput(false);
                    updatePeripheralValue(selectedPeripheral);
                }}
            />}
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity
                    activeOpacity={isScanning ? 1 : 0.7}
                    disabled={isScanning}
                    style={{
                        height: 50,
                        width: 150,
                        backgroundColor: isScanning ? "#555" : "brown",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginVertical: 15
                    }}
                    onPress={startScan}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>Scan BlE Devices</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={isScanning ? 1 : 0.7}
                    disabled={isScanning}
                    style={{
                        height: 50,
                        width: 150,
                        backgroundColor: isScanning ? "#555" : "brown",
                        borderRadius: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginVertical: 15
                    }}
                    onPress={() => props.navigation.navigate('User_Contacts')}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>Display Contacts</Text>
                </TouchableOpacity>
            </View>

            {isScanning && <ActivityIndicator style={{}} size={"large"} />}
            {!isScanning && displayPeripherals && (
                <FlatList
                    data={list}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={emptyList}
                    getItemLayout={getItemLayout}
                    windowSize={15}
                />
            )}
        </View>
    )
}

export default BleScanner;