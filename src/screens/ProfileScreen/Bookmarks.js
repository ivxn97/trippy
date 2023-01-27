import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Bookmarks ( {navigation} ) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEmail] = useState();
    const [bookmarksArr, setBookmarksArr] = useState();
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [guides, setGuides] = useState([]);
    const [walkingTours, setWalkingTours] = useState([]);
    const [status, setStatus] = useState('Loading Bookmarks')

    const [shouldRun, setShouldRun] = useState(true);

    const getEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEmail(email);
                console.log(email)
            }
            else {
                console.log("No Email Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getBookmarks (email) {
        var loginRef = doc(db, "users", email);
        const docSnap = await getDoc(loginRef);

        if (docSnap.exists()) {
            //console.log("Document data: ", docSnap.data());
            const bookmarksData = docSnap.data().bookmarks
            setBookmarksArr(bookmarksData);
            setShouldRun(false);
            console.log("bookmark: " + bookmarksArr)
        }
        else {
            console.log("Error", error)
        }
    }

    const getRestaurants = async () => {
        const collectionRef = collection(db, "restaurants")
        const q = query(collectionRef, where('name', 'in', bookmarksArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            restaurants.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getHotels = async () => {
        const collectionRef = collection(db, "hotels")
        const q = query(collectionRef, where('name', 'in', bookmarksArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            hotels.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getPaidTours = async () => {
        const collectionRef = collection(db, "paidtours")
        const q = query(collectionRef, where('name', 'in', bookmarksArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            paidTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getAttractions = async () => {
        const collectionRef = collection(db, "attractions")
        const q = query(collectionRef, where('name', 'in', bookmarksArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            attractions.push({
                ...doc.data(),
                key: doc.id
            })
        })
    }

    const getGuides = async () => {
        const collectionRef = collection(db, "guides")
        const q = query(collectionRef, where('name', 'in', bookmarksArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            guides.push({
                ...doc.data(),
                key: doc.id
            })
        })
        if (bookmarksArr) {
            setLoading(false);
        }
    }

    const getWalkingTours = async () => {
        const collectionRef = collection(db, "walkingtours")
        const q = query(collectionRef, where('name', 'in', bookmarksArr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            walkingTours.push({
                ...doc.data(),
                key: doc.id
            })
        })
        //Move it to here in the future
        /*if (bookmarksArr) {
            setLoading(false);
        } */
    }

    useFocusEffect(React.useCallback(() => {
        if (shouldRun) {
            getEmail();
            getBookmarks(email);
            getRestaurants();
            getHotels();
            getPaidTours();
            getAttractions();
            getGuides();
            //getWalkingTours();
        }
    },[shouldRun, email, bookmarksArr]))

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus('Bookmarks is empty!');
        }, 8000);
        return () => clearInterval(interval)
    })

    if (loading) {
        return (
            <View>
                <ActivityIndicator />
                <Text style={styles.Heading}>{status}</Text>
            </View>);
    }

    if (restaurants == null && hotels == null && paidTours == null && attractions == null && guides == null && walkingTours == null) {
        return (
            <View>
                <Text style={styles.Heading}>Bookmark is empty!</Text>
            </View>
        )
    }
    else {
        return (
            <View>
                <ScrollView>
                <Text style={styles.HeadingList}>Bookmarks</Text>
                <View style={{ flexDirection:"row", justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Search Bookmarks', {bookmarksArr: bookmarksArr})}>
                        <Text style={styles.buttonSmallListText}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonListRight}
                    onPress={() => {navigation.navigate('Delete Bookmark')}}>
                    <Text style={styles.buttonSmallListText}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Restaurants</Text>
                <FlatList
                    data={restaurants}
                    extraData={restaurants}
                    renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => {navigation.navigate('Restaurant Details', {name: item.name, typeOfCuisine: item.typeOfCuisine, 
                    price: item.price, ageGroup: item.ageGroup, location: item.location, groupSize: item.groupSize, openingTime: item.openingTime,
                    closingTime: item.closingTime, menu: item.menu, description: item.description, TNC: item.TNC, language: item.language})}}>
                    <View style={styles.list}>
                        <Text>{item.name}</Text>
                        <Text>{item.price}</Text>
                    </View>
                    </TouchableHighlight>
                    )}
                />
                <Text style={styles.title}>Hotels</Text>
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
                <Text style={styles.title}>Paid Tours</Text>
                <FlatList
                data={paidTours}
                extraData={paidTours}
                renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => {navigation.navigate('Paid tour details', {name: item.name, tourType: item.tourType, 
                    price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, startingTime: item.startingTime,
                    endingTime: item.endingTime, duration: item.duration, description: item.description, language: item.language,
                    TNC: item.TNC})}}>
                    <View style={styles.list}>
                    <Text>{item.name}</Text>
                    <Text>${item.price}</Text>
                    </View>
                    </TouchableHighlight>
                )}
                />
                <Text style={styles.title}>Attractions</Text>
                <FlatList
                data={attractions}
                extraData={attractions}
                renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => {navigation.navigate('Attraction Details', {name: item.name, attractionType: item.attractionType, 
                    price: item.price, ageGroup: item.ageGroup, groupSize: item.groupSize, openingTime: item.openingTime,
                    closingTime: item.closingTime, description: item.description, language: item.language, TNC: item.TNC})}}>
                    <View style={styles.list}>
                    <Text>{item.name}</Text>
                    <Text>${item.price}</Text>
                    </View>
                    </TouchableHighlight>
                )}
                />
                <Text style={styles.title}>Guides</Text>
                <FlatList
                    data={guides}
                    extraData={guides}
                    renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor="#C8c9c9"
                        onPress={() => {navigation.navigate('Guide Screen', {name: item.name, location: item.location,
                                                                                    mrt: item.mrt, tips: item.tips, description: item.description})}}>
                    <View style={styles.list}>
                    <Text>{item.name}</Text>
                    </View>
                    </TouchableHighlight>
                )}
                />
                </ScrollView>
            </View>
        )
    }
}