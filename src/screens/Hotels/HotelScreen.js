import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

export default function HotelScreen({ route, navigation }) {
    const { name, hotelClass, roomTypes, priceRange, checkInTime, checkOutTime, amenities, roomFeatures, language, description, TNC } = route.params;

    const filteredRoomTypes = roomTypes.filter(item => item.isChecked === true);
    const valueRoomTypes = filteredRoomTypes.map(item => item.value);

    const filterAmenities = amenities.filter(item => item.isChecked === true);
    const valueAmenities = filterAmenities.map(item => item.value);

    const filterRoomFeatures = roomFeatures.filter(item => item.isChecked === true);
    const valueRoomFeatures = filterRoomFeatures.map(item => item.value);

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.Heading}>{JSON.stringify(name).replace(/"/g,"")}</Text>
            <Image
                style={styles.imageDetailsPlaceholder}
                source={require('../../../assets/image-placeholder-large.jpg')}
            />
            <View style={{ flexDirection:"row" }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Add To Itinerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Share</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.textNB}>Address: </Text>
            <Text style={styles.textNB}>Hotel Class: {JSON.stringify(hotelClass).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>Room Type: {JSON.stringify(valueRoomTypes.join(', ')).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>CheckIn Time: {JSON.stringify(checkInTime).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>CheckOut Time: {JSON.stringify(checkOutTime).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>Amenities: {JSON.stringify(valueAmenities.join(', ')).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>Room Features: {JSON.stringify(valueRoomFeatures.join(', ')).replace(/"/g, "")}</Text>
            <Text style={styles.textNB}>Language: {JSON.stringify(language).replace(/"/g, "")}{"\n"}</Text>
            <Text style={styles.textNB}>Description: {JSON.stringify(description).replace(/"/g,"")}{"\n"}</Text>
            <Text style={styles.textNB}>Terms & Conditions: {JSON.stringify(TNC).replace(/"/g, "")}</Text>
            <Text style={styles.price}>${JSON.stringify(priceRange).replace(/"/g, "")}</Text>
            <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Read Reviews</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSmall}>
                        <Text style={styles.buttonSmallText}>Book</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}