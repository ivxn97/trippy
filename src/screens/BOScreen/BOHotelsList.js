import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';

export default function BOHotelList({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [hotels, setHotels] = useState([]); // Initial empty array of hotels

    //List
    navigation.addListener('willFocus', () => {

    })

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "hotels"));
        querySnapshot.forEach(documentSnapshot => {
            hotels.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });

        setHotels(hotels);
        setLoading(false);
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
    <View>
    <TextInput
        style={styles.inputSearch}
        placeholder='search'
        placeholderTextColor="#aaaaaa"
        underlineColorAndroid="transparent"
        autoCapitalize="sentences"
    />
    <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
    <TouchableOpacity style={styles.buttonSmall} onPress={() =>
                        navigation.navigate('Add Hotel')
                    }>
          <Text style={styles.buttonSmallListText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonSmallListText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonSmallListText}>Remove</Text>
        </TouchableOpacity>
    </View>
        <FlatList
            data={hotels}
            extraData={hotels}
            renderItem={({ item }) => (
                <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => {
                    navigation.navigate('Hotel details', {
                        name: item.name, roomTypes: item.roomTypes,
                        priceRange: item.priceRange, hotelClass: item.hotelClass, checkInTime: item.checkInTime,
                        checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures, 
                        language: item.language,description: item.description, TNC: item.TNC
                    })
                    }}>
                    <View style={styles.list}>
                        <Text>{item.name}</Text>
                        <Text>{item.hotelClass}</Text>
                    </View>
                </TouchableHighlight>
            )}
        />
        </View>
    );
}