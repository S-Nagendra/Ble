import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    PermissionsAndroid,
    ActivityIndicator,
    FlatList
} from "react-native";
import Contacts from 'react-native-contacts';

const UserContacts = (props) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const ITEM_HEIGHT = 100;
    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = async () => {
        const permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
        if (permission) {
            fetchContacts();
            return;
        }
        if (!permission) {
            try {
                const andoidContactPermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: "Contacts Permission",
                        message:
                            "This app would like to view your contacts.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                console.log("android permission:-", andoidContactPermission);
                if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
                    fetchContacts();
                } else {
                    console.log("Contacts permission denied");
                }
            } catch (err) {
                console.log(err);
            }
        }

    }

    const fetchContacts = () => {
        let userContacts = [];
        Contacts.getAll().then(contacts => {
            for (let i = 0; i < contacts.length; i++) {
                if (contacts[i].phoneNumbers.length > 0) {
                    let obj = {
                        id: contacts[i].recordID,
                        name: contacts[i].displayName,
                        mobile: contacts[i].phoneNumbers
                    }
                    userContacts.push(obj);
                }
            }
            setContacts(userContacts);
            setLoading(false);
        })
    }

    const displayAvatarName = (item) => {
        return item.name.slice(0, 1).toUpperCase();
    }

    const displayContactDetails = (item) => {
        return item.mobile[0].number
    }

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
                {/** User - Avatar Section */}
                <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "brown",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{ color: "white" }}>{displayAvatarName(item)}</Text>
                </View>

                {/** User Details */}
                <View style={{
                    flex: 1,
                    backgroundColor: "white",
                    paddingHorizontal: 8,
                    justifyContent: "center"
                }}>
                    <Text style={{ color: "#555", fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ color: "#666", fontSize: 12 }}>{displayContactDetails(item)}</Text>
                </View>
            </View>
        )
    }, [])

    const keyExtractor = useCallback((item) => {
        return item.id.toString()
    }, []);

    const getItemLayout = useCallback((data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
    }), [])

    return (
        <View style={{ flex: 1 }}>
            {loading && <ActivityIndicator size={"large"} />}
            {!loading && (
                <FlatList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    windowSize={8}
                    getItemLayout={getItemLayout}
                />
            )}
        </View>
    )
}

export default UserContacts;