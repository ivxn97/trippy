import React, { useEffect, useState, useRef } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { collection, getDocs, setDoc, doc, deleteDoc, query, where } from "firebase/firestore";
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
    const [role, setRole] = useState()
    const [FYButton, setFYButton] = useState(false)
    const isInitialMount = useRef(true);
    const [FYLoading, setFYLoading] = useState(true)

    const [FYattractions, FYsetAttractions] = useState([])
    const [FYpaidTours, FYsetPaidTours] = useState([])
    const [items, setItems] = useState([]); 
    const [mergedArr, setMergedArr] = useState([])

    //Get User Role. If User Role is Admin or BO, navigate them to the respective stacks
    const getRole = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            if (role !== null) {
                console.log(role)
                if (role == "Admin") {
                    navigation.reset({index: 0, routes: [{name: 'Admin Stack'}]})
                }
                else if (role == "Business Owner") {
                    navigation.reset({index: 0, routes: [{name: 'BO Stack'}]})
                }
                else if (role == "Registered User") {
                    setRole(role);
                    setFYButton(true);
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
                            getAttractions(filteredInterests)
                            getPaidTours(filteredInterests)
                        }
                        else {
                            console.log("No Email Selected at Login")
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            else {
                console.log("No Role Selected at Login")
                setFYButton(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAttractions = async (interests) => {
        const collectionRef = collection(db, "attractions")
        const q = query(collectionRef, where('attractionType', 'in', interests));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            FYattractions.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getPaidTours = async (interests) => {
        const collectionRef = collection(db, "paidtours")
        const q = query(collectionRef, where('tourType', 'in', interests));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            FYpaidTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
        mergedArr.push(...FYattractions);
        mergedArr.push(...FYpaidTours);
        setFYLoading(false)
    }

    // Get activities from the homepage collection. The Contents of this is set by Admin in PageContent.js
    const getActivities = async () => {
        const querySnapshot = await getDocs(collection(db, "homepage"));
        querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.id == "topPage") {
                topPage.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.id == "restaurants") {
                restaurants.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.id == "hotels") {
                hotels.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.id == "paidtours") {
                paidTours.push({
                    ...documentSnapshot.data().activities
                });
            }
            else if (documentSnapshot.id == "attractions") {
                attractions.push({
                    ...documentSnapshot.data().activities
                });
            }
        });

        const newResArr = restaurants.flatMap((item) => Object.values(item))
        setRestaurants(newResArr)

        const newTPArr = topPage.flatMap((item) => Object.values(item))
        setTopPage(newTPArr)

        const newHArr = hotels.flatMap((item) => Object.values(item))
        setHotels(newHArr)

        const newATArr = attractions.flatMap((item) => Object.values(item))
        setAttractions(newATArr)

        const newPTArr = paidTours.flatMap((item) => Object.values(item))
        setPaidTours(newPTArr)

        setLoading(false)
    }
    //Checks for Expiry of Bookings and Deals upon app launch. If current date is after the date in bookings/ deals, 
    // Set those bookings as expired, and remove the expired deals
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
        getRole();
    },[]));

    useEffect(() => {
    if (isInitialMount.current) {
        //getRole();
        checkExpiry();
        checkDealExpiry();
        getActivities();
        isInitialMount.current = false;
        }
    },[])

    if (loading) {
        return <ActivityIndicator />;
    }

    if (FYLoading && role == "Registered User") {
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
                data={topPage}
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
        {FYButton ? (
            <View>
            <Text style={[styles.HeadingList, {fontWeight:'bold'}]}>For You:</Text>
            <View style={{alignItems: 'center'}}>
            <Carousel
            loop
            width={width/1.1}
            height={width / 2}
            autoPlay={false}
            mode="normal"
            data={mergedArr}
            scrollAnimationDuration={1000}
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
            </View>
        ) : null}
        <Text style={[styles.HeadingList, {fontWeight:'bold'}]}>Restaurants:</Text>
        {restaurants.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.displayBox]} onPress={() => {navigation.navigate('Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
                price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
                closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language
                , activityType: item.activityType, review: item.review, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, 
                capacity: item.capacity, address: item.address, images: item.images})}}>
                <View style={{position: 'absolute', top: 95, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
                    <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={styles.imageDisplayBox} />
            </TouchableOpacity>
        ))}
        <Text style={[styles.HeadingList, {fontWeight:'bold'}]}>Attractions:</Text>
        {attractions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.displayBox} onPress={() => {navigation.navigate('Details', 
                {name: item.name, attractionType: item.attractionType, 
                price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, openingTime: item.openingTime,
                closingTime: item.closingTime, description: item.description, language: item.language, TNC: item.TNC, 
                activityType: item.activityType, mapURL: item.mapURL, capacity: item.capacity, address: item.address,
                addedBy: item.addedBy, images: item.images})}}>
                <View style={{position: 'absolute', top: 95, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
                    <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={styles.imageDisplayBox} />
            </TouchableOpacity>
        ))}
        <Text style={[styles.HeadingList, {fontWeight:'bold'}]}>Hotels:</Text>
        {hotels.map((item, index) => (
            <TouchableOpacity key={index} style={styles.displayBox} onPress={() => {navigation.navigate('Details',  {
                name: item.name, roomTypes: item.roomTypes,
                hotelClass: item.hotelClass, checkInTime: item.checkInTime,
                checkOutTime: item.checkOutTime, amenities: item.amenities, roomFeatures: item.roomFeatures, 
                language: item.language,description: item.description, TNC: item.TNC, activityType: item.activityType,
                addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, address: item.address, images: item.images 
            })}}>
                <View style={{position: 'absolute', top: 95, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
                    <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={styles.imageDisplayBox} />
            </TouchableOpacity>
        ))}
        <Text style={[styles.HeadingList, {fontWeight:'bold'}]}>Tours:</Text>
        {paidTours.map((item, index) => (
            <TouchableOpacity key={index} style={styles.displayBox} onPress={() => {navigation.navigate('Details', 
                {name: item.name, tourType: item.tourType, 
                price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, startingTime: item.startingTime,
                endingTime: item.endingTime, duration: item.duration, description: item.description, language: item.language,
                TNC: item.TNC, activityType: item.activityType, addedBy: item.addedBy, timeSlots: item.timeSlots, mapURL: item.mapURL, 
                capacity: item.capacity, address: item.address, images: item.images})}}>
                <View style={{position: 'absolute', top: 95, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.HeadingDisplay}>{JSON.stringify(item.name).replace(/"/g,"")}</Text></View>
                    <ImageBackground source={{uri: JSON.stringify(item.images[0]).replace(/"/g,"")}} style={styles.imageDisplayBox} />
            </TouchableOpacity>
        ))}
        </KeyboardAwareScrollView>
        </View>
    )
}
//<Image source={profileImage} style={styles.imageDisplayBox} />