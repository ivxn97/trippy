import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, arrayRemove, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeleteBookmark ( {navigation} ) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEmail] = useState();
    const [bookmarksArr, setBookmarksArr] = useState();
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [guides, setGuides] = useState([]);
    const [walkingTours, setWalkingTours] = useState([]);

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

    const delBookmark = async (activity) => {
        const docRef = doc(db, "users", email);
        await updateDoc(docRef, {bookmarks: arrayRemove(activity)})
        alert(`${activity} removed from your Bookmarks!`)
        navigation.replace('Bookmarks')
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

    if (loading) {
        return <ActivityIndicator />;
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
                <Text style={styles.title}>Restaurants</Text>
                <FlatList
                    data={restaurants}
                    extraData={restaurants}
                    renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => delBookmark(item.name)}>
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
                        onPress={() => delBookmark(item.name)}>
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
                    onPress={() => delBookmark(item.name)}>
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
                    onPress={() => delBookmark(item.name)}>
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
                        onPress={() => delBookmark(item.name)}>
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