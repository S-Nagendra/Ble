'use strict';

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Map = (props) => {

    const [userLatitude, setLatitude] = useState(28.579660);
    const [userLongitude, setLongitude] = useState(77.321110);

    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            let {
                coords: {
                    latitude,
                    longitude
                }
            } = info;
            console.log("corrds", latitude, longitude);
            setLatitude(latitude);
            setLongitude(longitude);
        });
    }, []);

    useEffect(() => {
        console.log("updated user longitude");
    }, [userLatitude, userLongitude])

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={{
                    latitude: userLatitude,
                    longitude: userLongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            >
            </MapView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;