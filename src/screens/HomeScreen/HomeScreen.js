import React, { useState } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
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
    const [loading, setLoading] = useState(true)

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
                    ...documentSnapshot.data().activities,
                    key: documentSnapshot.id
                });
            }
            else if (documentSnapshot.id == "restaurants") {
                restaurants.push({
                    ...documentSnapshot.data().activities
                });
                console.log(restaurants)
            }
            else if (documentSnapshot.data().name == "hotels") {
                hotels.push({
                    ...documentSnapshot.data().activities,
                    key: documentSnapshot.id
                });
            }
            else if (documentSnapshot.data().name == "paidtours") {
                paidTours.push({
                    ...documentSnapshot.data().activities,
                    key: documentSnapshot.id
                });
            }
            else if (documentSnapshot.data().name == "attractions") {
                attractions.push({
                    ...documentSnapshot.data().activities,
                    key: documentSnapshot.id
                });
            }
        });

        const newResArr = restaurants.flatMap((item) => Object.values(item))
        setRestaurants(newResArr)
        console.log(newResArr)
        setLoading(false)
    }
    
    const changeExpiry = async (id) => {
        await setDoc(doc(db, "bookings", id), {
            expired: true
        }, {merge:true})
    }

    const changeDealExpiry = async (id) => {
        deleteDoc(doc(db, "deals", id))
    }

    const checkExpiry = async () => {
        const date = new Date()
        const querySnapshot = await getDocs(collection(db, "bookings"));
        querySnapshot.forEach(documentSnapshot => {
            if (date > documentSnapshot.data().date.toDate()) {
                changeExpiry(documentSnapshot.data().id)
            }
            else if (date > documentSnapshot.data().endDate.toDate()) {
                changeExpiry(documentSnapshot.data().id)
            }
         })
    }

    const checkDealExpiry = async () => {
        const date = new Date()
        const querySnapshot = await getDocs(collection(db, "deals"));
        querySnapshot.forEach(documentSnapshot => {
            if (date > documentSnapshot.data().expiry.toDate()) {
                changeDealExpiry(documentSnapshot.data().dealname)
            }
         })
    }

    useFocusEffect(React.useCallback(() => 
    {
        if (loading) {
        getRole();
        checkExpiry();
        checkDealExpiry();
        getActivities();
        }
    },[]));

    if (loading) {
        return <ActivityIndicator />;
    }

    const width = Dimensions.get('window').width;
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                mode="parallax"
                data={restaurants}
                scrollAnimationDuration={6000}
                pagingEnabled={true}
                snapEnabled={true}
                //onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                    <TouchableOpacity key={index} style={styles.buttonCarousel} onPress={() => {navigation.navigate('Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
                price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
                closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
                , activityType: item.activityType, review: item.review, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, 
                capacity: item.capacity, address: item.address, images: item.images})}}>
                <View style={{position: 'absolute', top: 120, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
                    <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={styles.imageDisplayCarousel} />
            </TouchableOpacity>
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
            <TouchableOpacity key={index} style={styles.displayBox} onPress={() => {navigation.navigate('Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
                price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
                closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
                , activityType: item.activityType, review: item.review, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, 
                capacity: item.capacity, address: item.address, images: item.images})}}>
                <View style={{position: 'absolute', top: 95, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
                    <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={styles.imageDisplayBox} />
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
//<Image source={profileImage} style={styles.imageDisplayBox} />