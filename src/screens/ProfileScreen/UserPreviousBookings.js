import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserPreviousBookings ({ route, navigation }) {
    const {email} = route.params;
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [filteredData, setfilteredData] = useState();
    const [isPressed, setIsPressed] = useState (false);
    const [bookings, setBookings] = useState([]);

    const getBookings = async () => {
        const collectionRef = collection(db, "bookings")
        const q = query(collectionRef, where('bookedBy', '==', email), where('expired', '==', true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            bookings.push({
                ...doc.data(),
                key: doc.id
            })
        })
        setfilteredData(bookings)
        setLoading(false);
        console.log(bookings)
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

    useEffect(() => {
        if (loading) {
        getBookings();
        }
    }, [bookings]);
    
    const ItemView = ({item}) => {
        return (
            <TouchableOpacity
                underlayColor="#C8c9c9"
                onPress={() => navigation.navigate('Previous Booking Details', {date: item.date, orgPrice: item.orgPrice, 
                    discount: item.discount, finalPrice: item.finalPrice, groupSize: item.groupSize, id: item.id, 
                    name: item.name, time: item.time, email: item.bookedBy, activityType: item.activityType, startDate: item.startDate, endDate: item.endDate})}>
                <View style={styles.list}>
                <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
        <Text style={styles.HeadingList}>Your Previous</Text>
        <Text style={styles.HeadingList}>Bookings</Text>

        <TextInput
            style={styles.inputSearch}
            placeholder='search'
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            value={search}
            onChangeText={(text) => searchFilter(text, bookings)}
        />
        {/* Flatlist */}
        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
        />
        </View>
    )
}
