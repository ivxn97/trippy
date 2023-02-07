import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableHighlight, TextInput } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminEditHotelsList({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [hotels, setHotels] = useState([]); // Initial empty array of hotels
    const [filteredData, setfilteredData] = useState(hotels); // Initial empty array of hotels
    const [search, setSearch] = useState('');
    const [email, setEmail] = useState('');



    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getHotels = async () => {
        const querySnapshot = await getDocs(collection(db, "hotels"));
        querySnapshot.forEach((doc) => {
            hotels.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setLoading(false);
    }

    useEffect(() => {
        getEmail();
        if (email) {
            getHotels();
        }
    }, [email]);


    if (loading) {
        return <ActivityIndicator />;
    }

    const searchFilter = (text, type) => {
        if (text) {
            const newData = type.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
            setSearch(text);
        } else {
            setfilteredData(type);
            setSearch(text);
        }
    }

    return (
        <View>
            <TextInput
                style={styles.inputSearch}
                placeholder='search'
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                autoCapitalize="sentences"
                value={search}
                onChangeText={(text) => searchFilter(text, hotels)}
            />
            <FlatList
                data={filteredData}
                extraData={filteredData}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor="#C8c9c9"
                        onPress={() => {
                            navigation.navigate('Edit Hotel', {
                                name: item.name, roomTypes: item.roomTypes,
                                hotelClass: item.hotelClass, checkInTime: item.checkInTime,
                                checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures,
                                language: item.language, description: item.description, TNC: item.TNC, activityType: item.activityType,
                                addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, address: item.address, images: item.images,
                                longitude: item.longitude, latitude: item.latitude, currRooms: item.currentRooms
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
