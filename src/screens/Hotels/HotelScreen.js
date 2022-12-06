import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function HotelScreen({ route, navigation }) {
    const { name, hotelClass, roomType, priceRange, checkInTime, checkOutTime, amenities, language, location, TNC } = route.params;

    return (
        <View>
            <Text>{JSON.stringify(name).replace(/"/g, "")}</Text>
            <Text>Hotel Class: {JSON.stringify(hotelClass).replace(/"/g, "")}</Text>
            <Text>Type: {JSON.stringify(roomType).replace(/"/g, "")}</Text>
            <Text>${JSON.stringify(priceRange).replace(/"/g, "")}</Text>
            <Text>CheckIn Time: {JSON.stringify(checkInTime).replace(/"/g, "")}</Text>
            <Text>CheckOut Time: {JSON.stringify(checkOutTime).replace(/"/g, "")}</Text>
            <Text>Amenities: {JSON.stringify(amenities).replace(/"/g, "")}</Text>
            <Text>Language: {JSON.stringify(language).replace(/"/g, "")}</Text>
            <Text>Location: {JSON.stringify(location).replace(/"/g, "")}</Text>
            <Text>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g, "")}</Text>
        </View>
    )
}