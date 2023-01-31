import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity, CheckBox } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from '../ProfileScreen/styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function PageContent ( {navigation, route} ) {
    const { activityType} = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [finalArr, setFinalArr] = useState();
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [guides, setGuides] = useState([]);
    const [walkingTours, setWalkingTours] = useState([]);
    const [mergedArr, setMergedArr] = useState([]);
    const [completedArr, setCompletedArr] = useState([]);

    const [shouldRun, setShouldRun] = useState(true);
    const [listedTopPage, setListedTopPage] = useState([]);
    const [listedHotels, setListedHotels] = useState([]);
    const [listedPaidtours, setListedPaidtours] = useState([]);
    const [listedAttractions, setListedAttractions] = useState([]);
    const [listedRestaurants, setListedRestaurants] = useState([]);

    // Function to handle checking or unchecking an item
    const handleCheck = (item) => {
        if (activityType == 'topPage') {
            if (listedRestaurants.includes(item)) {
                // Remove item from list if already checked
                setListedTopPage(listedTopPage.filter(i => i !== item));
            } else {
                // Add item to list if not already checked
                setListedTopPage([...listedTopPage, item]);
            }
        }
        else if (activityType == 'restaurants') {
            if (listedRestaurants.includes(item)) {
                // Remove item from list if already checked
                setListedRestaurants(listedRestaurants.filter(i => i !== item));
            } else {
                // Add item to list if not already checked
                setListedRestaurants([...listedRestaurants, item]);
            }
        }
        else if (activityType == 'paidtours') {
            if (listedPaidtours.includes(item)) {
                // Remove item from list if already checked
                setListedPaidtours(listedPaidtours.filter(i => i !== item));
            } else {
                // Add item to list if not already checked
                setListedPaidtours([...listedPaidtours, item]);
            }
        }
        else if (activityType == 'hotels') {
            if (listedHotels.includes(item)) {
                // Remove item from list if already checked
                setListedHotels(listedHotels.filter(i => i !== item));
            } else {
                // Add item to list if not already checked
                setListedHotels([...listedHotels, item]);
            }
        }
        else if (activityType == 'attractions') {
            if (listedAttractions.includes(item)) {
                // Remove item from list if already checked
                setListedAttractions(listedAttractions.filter(i => i !== item));
            } else {
                // Add item to list if not already checked
                setListedAttractions([...listedAttractions, item]);
            }
        }
        
    };
    if (activityType == 'topPage') {
        const getRestaurants = async () => {
            const collectionRef = collection(db, "restaurants")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                restaurants.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
        }

        const getHotels = async () => {
            const collectionRef = collection(db, "hotels")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                hotels.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
        }

        const getPaidTours = async () => {
            const collectionRef = collection(db, "paidtours")
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
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                attractions.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
        }

        const getGuides = async () => {
            const collectionRef = collection(db, "guides")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                guides.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
        getMergeArr();
        }

        const getWalkingTours = async () => {
            const collectionRef = collection(db, "walkingtours")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                walkingTours.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
        }

        const getMergeArr = () => {
            mergedArr.push(...restaurants);
            mergedArr.push(...hotels);
            mergedArr.push(...paidTours);
            mergedArr.push(...attractions);
            mergedArr.push(...guides);
            mergedArr.push(...walkingTours);
            console.log("merged arr:", mergedArr)
            setCompletedArr(mergedArr)
            setLoading(false);
            setShouldRun(false);
        }
        useFocusEffect(React.useCallback(() => {
            if (shouldRun) {
                getRestaurants();
                getHotels();
                getPaidTours();
                getAttractions();
                getGuides();
                getWalkingTours();
            }
        },[shouldRun]))
    }
    else if (activityType == 'restaurants') {
        const getRestaurants = async () => {
            const collectionRef = collection(db, "restaurants")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                mergedArr.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
            setShouldRun(false);
        }
        useFocusEffect(React.useCallback(() => {
            if (shouldRun) {
                getRestaurants();
            }
        },[shouldRun]))
    }
    else if (activityType == 'paidtours') {
        const getPaidTours = async () => {
            const collectionRef = collection(db, "paidtours")
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                mergedArr.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
            setShouldRun(false);
        }
        useFocusEffect(React.useCallback(() => {
            if (shouldRun) {
                getPaidTours();
            }
        },[shouldRun]))
    }
    else if (activityType == 'hotels') {
        const getHotels = async () => {
            const collectionRef = collection(db, "hotels")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                mergedArr.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
            setShouldRun(false);
        }
        useFocusEffect(React.useCallback(() => {
            if (shouldRun) {
                getHotels();
            }
        },[shouldRun]))
    }
    else if (activityType == 'attractions') {
        const getAttractions = async () => {
            const collectionRef = collection(db, "attractions")
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach((doc) => {
                mergedArr.push({
                    ...doc.data(),
                    key: doc.id
                })
            })
            setShouldRun(false);
        }
        useFocusEffect(React.useCallback(() => {
            if (shouldRun) {
                getAttractions();
            }
        },[shouldRun]))
    }
    const onSubmitPress = async () => {
        const submitList = completedArr.map(item => ({ name: item.name, position: item.position }))
        console.log("submitted list:", submitList)
        try {
            await setDoc(doc(db, "users", email), {
                itinerary: submitList
            }, {merge:true});
            //console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Profile Page')
        }
        catch (e) {
            console.log("Error adding document: ", e);
        }
    }


    if (loading) {
        return <ActivityIndicator />;
    }

    if (activityType == 'topPage'){
        return (
            <View>
                <TextInput
                    style={styles.inputSearch}
                    placeholder='search'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    value={search}
                    onChangeText={(text) => searchFilter(text, users)}
                />
                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                    <FlatList
                        data={completedArr}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>{item.name}</Text>
                                <CheckBox
                                    value={listedTopPage.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </View>
        );
    }

    else if (activityType == 'restaurants') {
        return (
            <View>
                <TextInput
                    style={styles.inputSearch}
                    placeholder='search'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    value={search}
                    onChangeText={(text) => searchFilter(text, users)}
                />
                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                    <FlatList
                        data={restaurants}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>{item.name}</Text>
                                <CheckBox
                                    value={listedRestaurants.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </View>
        );
    }
    else if (activityType == 'paidtours') {
        return (
            <View>
                <TextInput
                    style={styles.inputSearch}
                    placeholder='search'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    value={search}
                    onChangeText={(text) => searchFilter(text, users)}
                />
                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                    <FlatList
                        data={paidtours}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>{item.name}</Text>
                                <CheckBox
                                    value={listedPaidtours.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </View>
        );
    }
    else if (activityType == 'hotels') {
        return (
            <View>
                <TextInput
                    style={styles.inputSearch}
                    placeholder='search'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    value={search}
                    onChangeText={(text) => searchFilter(text, users)}
                />
                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                    <FlatList
                        data={hotels}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>{item.name}</Text>
                                <CheckBox
                                    value={listedHotels.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </View>
        );
    }
    else if (activityType == 'attractions') {
        return (
            <View>
                <TextInput
                    style={styles.inputSearch}
                    placeholder='search'
                    placeholderTextColor="#aaaaaa"
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    value={search}
                    onChangeText={(text) => searchFilter(text, users)}
                />
                <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                    <FlatList
                        data={attractions}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>{item.name}</Text>
                                <CheckBox
                                    value={listedAttractions.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
            </View>
        );
    }
}

/*
    const getCurrentContent = async () => {
        if (activityType == 'topPage') {
            const docSnap = await getDoc(doc(db, "homepage", "topPage"))

            if (docSnap.exists()) {
                setListedTopPage(docSnap.data().activities)
            }
        }
        else if (activityType == 'restaurants') {
            const docSnap = await getDoc(doc(db, "homepage", "restaurants"))

            if (docSnap.exists()) {
                setListedRestaurants(docSnap.data().activities)
            }
        }
        else if (activityType == 'hotels') {
            const docSnap = await getDoc(doc(db, "homepage", "hotels"))

            if (docSnap.exists()) {
                setListedHotels(docSnap.data().activities)
            }
        }
        else if (activityType == 'paidtours') {
            const docSnap = await getDoc(doc(db, "homepage", "paidtours"))

            if (docSnap.exists()) {
                setListedPaidtours(docSnap.data().activities)
            }
        }
        else if (activityType == 'attractions') {
            const docSnap = await getDoc(doc(db, "homepage", "attractions"))

            if (docSnap.exists()) {
                setListedAttractions(docSnap.data().activities)
            }
        }
    }*/