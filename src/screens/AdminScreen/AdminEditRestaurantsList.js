import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableHighlight} from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RestaurantEditList({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState(restaurants);
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

    const getRestaurants = async () => {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        querySnapshot.forEach((doc) => {
            restaurants.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setLoading(false);
    }

    useEffect(() => {
        getEmail();
        if (email) {
            getRestaurants();
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
                onChangeText={(text) => searchFilter(text, restaurants)}
            />
            
            <FlatList
                data={filteredData}
                extraData={filteredData}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor="#C8c9c9"
                        onPress={() => {
                            navigation.navigate('Edit Restaurant', {
                                name: item.name, typeOfCuisine: item.typeOfCuisine,
                                price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
                                closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
                                , activityType: item.activityType, review: item.review, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL,
                                capacity: item.capacity, address: item.address, images: item.images, longitude: item.longitude, latitude: item.latitude
                            })
                        }}>
                        <View style={styles.list}>
                            <Text>{item.name}</Text>
                            <Text>{item.price}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            />
        </View>
    );
}
