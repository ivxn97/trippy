import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../config';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { sortFiles } from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserBookings ({ navigation }) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [search, setSearch] = useState('');
    const [filteredData, setfilteredData] = useState();
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [innerDropdownVisible, setInnerDropdownVisible] = useState(false);
    const [isPressed, setIsPressed] = useState (false);
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
                setRegisteredButton(true);
    
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBookings = async () => {
        const collectionRef = collection(db, "bookings")
        const q = query(collectionRef, where('bookedBy', '==', email));
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

    useEffect(() => {
        getEmail();
        if (email) {
            getBookings();
        }
    }, [email]);

    const onPressExpired = () => {
        navigation.navigate('User Previous Bookings', {email: email})
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
    
    const ItemView = ({item}) => {
        return (
            <TouchableOpacity
                underlayColor="#C8c9c9"
                onPress={() => navigation.navigate('Booking Details', {date: item.date, orgPrice: item.orgPrice, 
                    discount: item.discount, finalPrice: item.finalPrice, groupSize: item.groupSize, id: item.id, 
                    name: item.name, time: item.time, email: item.bookedBy})}>
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
        <Text style={styles.HeadingList}>Your</Text>
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

        {/* Buttons */}
        <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
            <TouchableOpacity 
            style={[styles.buttonSmall, {height:35, width:200}]}
            onPress={() => onPressExpired()}>
            <Text style={styles.text}>View Previous Bookings</Text>
            </TouchableOpacity>
        </View>
        
        {/* Flatlist */}
        <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
    />
        </View>
    )
}
