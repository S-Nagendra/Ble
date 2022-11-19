// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   NativeModules,
//   NativeEventEmitter,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import BleManager from "react-native-ble-manager";
// import {BROWN, WHITE} from '../Theme/colors';
// import {BUTTON_HEIGHTS, BUTTON_WIDTHS, FONTSIZES} from '../Theme/constants';

// const BleManagerModule = NativeModules.BleManager;
// const bleEmitter = new NativeEventEmitter(BleManagerModule);

// const BleScanner = props => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [list, setList] = useState([]);
//   const peripherals = new Map();


//  // mount and onmount event handler
//  useEffect(() => {
//     console.log('Mount');

//     // initialize BLE modules
//     BleManager.start({ showAlert: false, forceLegacy: true });

//     // add ble listeners on mount
//     const b1 = bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoveredPeripheral);
//     const b2 = bleEmitter.addListener('BleManagerStopScan', handleStopScan);
//     const b3 = bleEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
//     const b4 = bleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

//     // check location permission only for android device
//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r1) => {
//         if (r1) {
//           console.log('Permission is OK');
//           return;
//         }

//         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r2) => {
//           if (r2) {
//             console.log('User accept');
//             return
//           }

//           console.log('User refuse');
//         });
//       });
//     }

//     // remove ble listeners on unmount
//     return () => {
//       console.log('Unmount');
//         b1.remove();
//         b2.remove();
//         b3.remove();
//         b4.remove();
//     };
//   }, []);
  

//   // start to scan peripherals
//   const startScan = () => {
//     console.log("Scanning started", isScanning);
//     // skip if scan process is currently happening
//     if(isScanning) return;

//     // first, clear existing peripherals
//     peripherals.clear();
//     setList(Array.from(peripherals.values()));

//     // then re-scan the available peripherals for 5 seconds.
//     const durationInSeconds = 10;
//     BleManager.scan([], durationInSeconds, false)
//         .then(() => {
//             console.log("Scanning...");
//             setIsScanning(true);
//         })
//         .catch(err => {
//             console.error("Start Scan error:_", err);
//         })
//   }

//   // handle discovered peripheral
//   const handleDiscoveredPeripheral = (peripheral) => {
//     console.log("Got ble peripheral", peripheral);

//     if(!peripheral.name) {
//         peripheral.name = "N/A";
//     }

//     peripherals.set(peripheral.id, peripheral);
//     setList(Array.from(peripherals.values()));
//   }

//   // handle stop scan event
//   const handleStopScan = () => {
//     console.log("Stop is scanned...");
//     setIsScanning(false);
//   }

//   // handle disconnected peripheral
//   const handleDisconnectedPeripheral = (data) => {
//     console.log("Disconnected from " + data.peripheral);
//     let peripheral = peripherals.get(data.peripheral);
//     if(peripheral) {
//         peripheral.connected = false;
//         peripherals.set(peripheral.id, peripheral);
//         setList(Array.from(peripherals.values()));
//     }
//   }

//   // handle update value for characteristic
//   const handleUpdateValueForCharacteristic = (data) => {
//     console.log(
//         "Received data from: " + data.peripheral,
//         "Characteristic: " + data.characteristic,
//         "Data: " + data.value,
//     )
//   }

//   const renderItem = useCallback(({ item }) => {
//     console.log("render ITem:-", item);
//     return null;
//   }, [])

//   const keyExtractor = useCallback((item) => {
//     console.log("keyExtractor", item);
//     return null;
//     //return item.id.toString()
//   }, [])

//   const ListEmptyComponent = () => {
//     console.log("List empty component:_");
//     return null;
//   }

// return (
//     <View style={{flex: 1}}>
//       <TouchableOpacity
//         style={{
//           backgroundColor: BROWN,
//           width: BUTTON_WIDTHS[3],
//           height: BUTTON_HEIGHTS[0],
//           alignItems: 'center',
//           justifyContent: 'center',
//           alignSelf: 'center',
//           marginVertical: 10,
//         }}
//         activeOpacity={0.7}
//         disabled={isScanning}
//         onPress={() => {
//           startScan();
//         }}>
//         <Text
//           style={{
//             fontSize: FONTSIZES[1],
//             color: WHITE,
//             borderRadius: 10,
//           }}>
//           Scan Ble Devices
//         </Text>
//       </TouchableOpacity>
//       {isScanning && <ActivityIndicator size={'large'} />}
//       {/* <FlatList 
//         data={list}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         ListEmptyComponent={ListEmptyComponent}
//       /> */}
//     </View>
//   );
// };

// export default BleScanner;

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

// import and setup react-native-ble-manager
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

// import stringToBytes from convert-string package.
// this func is useful for making string-to-bytes conversion easier
import { stringToBytes } from 'convert-string';

// import Buffer function.
// this func is useful for making bytes-to-string conversion easier
const Buffer = require('buffer/').Buffer;

const BleScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState([]);
  const peripherals = new Map();
  const [testMode, setTestMode] = useState('read');

  // start to scan peripherals
  const startScan = () => {

    // skip if scan process is currenly happening
    if (isScanning) {
      return;
    }

    // first, clear existing peripherals
    peripherals.clear();
    setList(Array.from(peripherals.values()));

    // then re-scan it
    BleManager.scan([], 3, false)
      .then(() => {
        console.log('Scanning...');
        setIsScanning(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // handle discovered peripheral
  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);

    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }

    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  };

  // handle stop scan event
  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  };

  // handle disconnected peripheral
  const handleDisconnectedPeripheral = (data) => {
    console.log('Disconnected from ' + data.peripheral);

    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
  };

  // handle update value for characteristic
  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      'Received data from: ' + data.peripheral,
      'Characteristic: ' + data.characteristic,
      'Data: ' + data.value,
    );
  };

  // retrieve connected peripherals.
  // not currenly used
  const retrieveConnectedPeripheral = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      peripherals.clear();
      setList(Array.from(peripherals.values()));

      if (results.length === 0) {
        console.log('No connected peripherals');
      }

      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  // update stored peripherals
  const updatePeripheral = (peripheral, callback) => {
    let p = peripherals.get(peripheral.id);
    if (!p) {
      return;
    }

    p = callback(p);
    peripherals.set(peripheral.id, p);
    setList(Array.from(peripherals.values()));
  };

  // get advertised peripheral local name (if exists). default to peripheral name
  const getPeripheralName = (item) => {
    if (item.advertising) {
      if (item.advertising.localName) {
        return item.advertising.localName;
      }
    }

    return item.name;
  };

  // connect to peripheral then test the communication
  const connectAndTestPeripheral = (peripheral) => {
    if (!peripheral) {
      return;
    }

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

        console.log('peripheral id:', peripheral.id);
          console.log('service:', serviceUUID);
          console.log('characteristic:', charasteristicUUID);

        console.log("test mode:-", testMode);

          switch (testMode) {
            case 'write':
              // ===== test write data
              const payload = 'STORM';
              const payloadBytes = stringToBytes(payload);
              console.log('payload:', payload);
              console.log("payload bytes:-", payloadBytes);

              BleManager.write(peripheral.id, serviceUUID, charasteristicUUID, payloadBytes)
                .then(() => {
                  console.log('write response', payload);
                  alert(`your "${payload}" is stored to the food bank. Thank you!`);
                 
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
        });
      })
      .catch((error) => {
        console.log('Connection error', error);
      });
  };
 
  // mount and onmount event handler
  useEffect(() => {
    console.log('Mount');

    // initialize BLE modules
    BleManager.start({ showAlert: false, forceLegacy: true });

    

    // add ble listeners on mount
    const b1 = bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    const b2 = bleEmitter.addListener('BleManagerStopScan', handleStopScan);
    const b3 = bleEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
    const b4 = bleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    // check location permission only for android device
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r1) => {
        console.log("r1", r1);
        if (r1) {
          console.log('Permission is OK');
          return;
        }

        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((r2) => {
          if (r2) {
            console.log('User accept');
            return
          }

          console.log('User refuse');
        });
      });
    }

    // remove ble listeners on unmount
    return () => {
      console.log('Unmount');
    b1.remove();
    b2.remove();
    b3.remove();
    b4.remove();
    };
  }, []);

  // render list of devices
  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => connectAndTestPeripheral(item)}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {getPeripheralName(item)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {item.id}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaView}>
        {/* header */}
        <View style={styles.body}>
          <View style={styles.scanButton}>
            <Button
              title={'Scan Bluetooth Devices'}
              onPress={() => startScan()}
            />
          </View>

          {list.length === 0 && (
            <View style={styles.noPeripherals}>
              <Text style={styles.noPeripheralsText}>No peripherals</Text>
            </View>
          )}
        </View>

        {/* ble devices */}
        <FlatList
          data={list}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={(item) => item.id}
        />

        {/* bottom footer */}
        <View style={styles.footer}>
          <TouchableHighlight onPress={() => setTestMode('write')}>
            <View style={[styles.row, styles.footerButton]}>
              <Text>CHANGE NAME</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => setTestMode('read')}>
            <View style={[styles.row, styles.footerButton]}>
              <Text>Get stored food</Text>
            </View>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  body: {
    backgroundColor: Colors.white,
  },
  scanButton: {
    margin: 10,
  },
  noPeripherals: {
    flex: 1,
    margin: 20,
  },
  noPeripheralsText: {
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  footerButton: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: 'grey',
  },
});

export default BleScanner;