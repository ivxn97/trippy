import React, { useEffect, useState, useRef } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { collection, getDocs, setDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from '../../../config';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


export default function ForYou({navigation}) {
    const [email, setEmail] = useState('');
    const [items, setItems] = useState([]); 
    const [interests, setInterests] = useState()
    const [user, setUser] = useState(null); 
    const [attractions, setAttractions] = useState([])
    const [paidTours, setPaidtours] = useState([])
    const [mergedArr, setMergedArr] = useState([])
    const [loading, setLoading] = useState(true)

    //Get email from Async storage
    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                const q = query(collection(db, "users"), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(documentSnapshot => {
                    items.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                    
                });
        
                const filteredInterests = items[0].interests.filter(interest => interest.isChecked === true)
                .map(interest => interest.name)
                console.log(filteredInterests)
                setInterests(filteredInterests)
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAttractions = async () => {
        const collectionRef = collection(db, "attractions")
        const q = query(collectionRef, where('attractionType', 'in', interests));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            attractions.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getPaidTours = async () => {
        const collectionRef = collection(db, "paidtours")
        const q = query(collectionRef, where('tourType', 'in', interests));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            paidTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getMergeArr = () => {
        mergedArr.push(...attractions);
        mergedArr.push(...paidTours);
        console.log(mergedArr)
    }

    useEffect(() => {
        if(loading){
        getEmail();
        if (interests) {
            getAttractions()
            getPaidTours()
            getMergeArr()
            if (mergedArr.length !== 0) {
                console.log(mergedArr , "here")
                setLoading(false)
            }
        }}
    },[interests])

    if (loading) {
        return <ActivityIndicator />;
    }

    const width = Dimensions.get('window').width;
    return (
        <View style={styles.container}>
        <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        mode="parallax"
        data={mergedArr}
        scrollAnimationDuration={6000}
        pagingEnabled={true}
        snapEnabled={true}
        renderItem={({ item, index }) => (
            <View
                style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: 'center',
                }}
            >
            <TouchableOpacity key={index} style={[styles.buttonCarousel, {width: '100%'}]}               
            onPress={() => {navigation.navigate('Details', {
            name: item.name, roomTypes: item.roomTypes,
            priceRange: item.priceRange, hotelClass: item.hotelClass, checkInTime: item.checkInTime,
            checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures, 
            language: item.language, description: item.description, TNC: item.TNC, activityType: item.activityType, typeOfCuisine: item.typeOfCuisine, 
            price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
            closingTime: item.closingTime, menu: item.menu, attractionType: item.attractionType, tourType: item.tourType, 
            startingTime: item.startingTime, endingTime: item.endingTime, duration: item.duration, mrt: item.mrt, tips: item.tips,
            addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, capacity: item.capacity, address: item.address, images: item.images
        })
        }}>
        <View style={{position: 'absolute', top: 120, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
            <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={[styles.imageDisplayCarousel, {width: '100%'}]} />
        </TouchableOpacity>
                </View>
            )}
        />
        </View>
    )
}