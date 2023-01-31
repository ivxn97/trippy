import React, { useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from '../../../config';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen( {navigation} ) {
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [topPage, setTopPage] = useState([])

    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role !== null) {
                if (role == "Admin") {
                    //navigation.navigate('Admin Stack');
                    navigation.reset({index: 0, routes: [{name: 'Admin Stack'}]})
                }
                else if (role == "Business Owner") {
                    navigation.reset({index: 0, routes: [{name: 'BO Stack'}]})
                }
                console.log(role)
            }
            else {
                console.log("No Role Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getActivities = async () => {
        const querySnapshot = await getDocs(collection(db, "homepage"));
        querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.data().name == "topPage") {
                topPage.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.data().name == "restaurants") {
                restaurants.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.data().name == "hotels") {
                hotels.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.data().name == "paidtours") {
                paidTours.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.data().name == "attractions") {
                attractions.push({
                    ...documentSnapshot.data().activities
                });
            }
        });
    }
    
    const changeExpiry = async (id) => {
        await setDoc(doc(db, "bookings", id), {
            expired: true
        }, {merge:true})
    }

    const checkExpiry = async () => {
        const date = new Date()
        const querySnapshot = await getDocs(collection(db, "bookings"));
        querySnapshot.forEach(documentSnapshot => {
            if (date > documentSnapshot.data().date.toDate()) {
                changeExpiry(documentSnapshot.data().id)
            }
         })
    }

    useFocusEffect(React.useCallback(() => 
    {
        getRole();
        checkExpiry();
    },[]));

    const width = Dimensions.get('window').width;
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                mode="parallax"
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={6000}
                pagingEnabled={true}
                snapEnabled={true}
                //onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
            <View style={{ flexDirection: "row"}}>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Restaurants"
            onPress={() =>
                navigation.navigate('List of restaurants')
            }
            >
            <Text style={styles.buttonSmallText}>Restaurants</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Hotels"
            onPress={() =>
                navigation.navigate('List of hotels')
            }
            >
            <Text style={styles.buttonSmallText}>Hotels</Text>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row"}}>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Attractions"
            onPress={() =>
                navigation.navigate('List of attractions')
            }
            >
            <Text style={styles.buttonSmallText}>Attractions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSmallHome}
            title ="Paid Tours"
            onPress={() =>
                navigation.navigate('List of paid tours')
            }
            >
            <Text style={styles.buttonSmallText}>Paid Tours</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.HeadingList}>Restaurants:</Text>
            {restaurants.map((item, index) => (
                <TouchableOpacity style={styles.displayBox}>
                    <Text style={styles.HeadingDisplay}>{item.name}</Text>
                </TouchableOpacity>
            ))}
        <Text style={styles.HeadingList}>Attractions:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Attraction 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Attraction 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Attraction 3</Text>
        </TouchableOpacity>
        <Text style={styles.HeadingList}>Hotels:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Hotel 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Hotel 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Hotel 3</Text>
        </TouchableOpacity>
        <Text style={styles.HeadingList}>Tours:</Text>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.displayBox}>
            <Text style={styles.HeadingDisplay}>Tour 3</Text>
        </TouchableOpacity>
        </KeyboardAwareScrollView>
        </View>
    )
}