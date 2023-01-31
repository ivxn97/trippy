import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, setDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from '../ProfileScreen/styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import Checkbox from 'expo-checkbox';

export default function PageContent ( {navigation, route} ) {
    const { activityType} = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [finalArr, setFinalArr] = useState();
    const [restaurants, setRestaurants] = useState([]); // Initial empty array of restaurants
    const [hotels, setHotels] = useState([]);
    const [paidTours, setPaidTours] = useState([]);
    const [attractions, setAttractions] = useState([]);
    const [mergedArr, setMergedArr] = useState([]);
    const [completedArr, setCompletedArr] = useState([]);
    const [search, useSearch] = useState('')

    const [shouldRun, setShouldRun] = useState(true);
    const [listedTopPage, setListedTopPage] = useState([]);
    const [listedHotels, setListedHotels] = useState([]);
    const [listedPaidtours, setListedPaidtours] = useState([]);
    const [listedAttractions, setListedAttractions] = useState([]);
    const [listedRestaurants, setListedRestaurants] = useState([]);

    // Function to handle checking or unchecking an item
    const handleCheck = (item) => {
        if (activityType == 'topPage') {
            if (listedTopPage.includes(item)) {
                // Remove item from list if already checked
                setListedTopPage(listedTopPage.filter(i => i !== item));
                console.log(listedTopPage)
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
    }

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
        const querySnapshot = await getDocs(collectionRef);
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
        getMergeArr();
    }


    const getMergeArr = () => {
        mergedArr.push(...restaurants);
        mergedArr.push(...hotels);
        mergedArr.push(...paidTours);
        mergedArr.push(...attractions);
        console.log("merged arr:", mergedArr)
        setCompletedArr(completedArr)
        setLoading(false);
    }

    const onSubmitPress = async () => {
        if (activityType == 'topPage') {
            try {
                await setDoc(doc(db, "homepage", "topPage"), {
                    activities: listedTopPage,
                    name: "topPage"
                })
                navigation.navigate('Page Content Choice')
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (activityType == 'restaurants') {
            try {
                await setDoc(doc(db, "homepage", "restaurants"), {
                    activities: listedRestaurants,
                    name: "restaurants"
                })
                navigation.navigate('Page Content Choice')
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (activityType == 'paidtours') {
            try {
                await setDoc(doc(db, "homepage", "paidtours"), {
                    activities: listedPaidtours,
                    name: "paidtours"
                })
                navigation.navigate('Page Content Choice')
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (activityType == 'hotels') {
            try {
                await setDoc(doc(db, "homepage", "hotels"), {
                    activities: listedHotels,
                    name: "hotels"
                })
                navigation.navigate('Page Content Choice')
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (activityType == 'attractions') {
            try {
                await setDoc(doc(db, "homepage", "attractions"), {
                    activities: listedAttractions,
                    name: "attractions"
                })
                navigation.navigate('Page Content Choice')
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    useFocusEffect(React.useCallback(() => {
        if (shouldRun) {
            getRestaurants();
            getHotels();
            getPaidTours();
            getAttractions();
            getCurrentContent();
        }
    },[shouldRun, finalArr]))

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
                        data={mergedArr}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text, { marginLeft: 20, marginRight:10 }]}>{item.name}</Text>
                                <Checkbox
                                    value={listedTopPage.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Modify Page Content</Text>
                </TouchableOpacity>
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
                                <Text style={[styles.text, { marginLeft: 20, marginRight:10 }]}>{item.name}</Text>
                                <Checkbox
                                    value={listedRestaurants.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Modify Page Content</Text>
                </TouchableOpacity>
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
                        data={paidTours}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text, { marginLeft: 20, marginRight:10 }]}>{item.name}</Text>
                                <Checkbox
                                    value={listedPaidtours.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Modify Page Content</Text>
                </TouchableOpacity>
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
                                <Text style={[styles.text, { marginLeft: 20, marginRight:10 }]}>{item.name}</Text>
                                <Checkbox
                                    value={listedHotels.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Modify Page Content</Text>
                </TouchableOpacity>
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
                                <Text style={[styles.text, { marginLeft: 20, marginRight:10 }]}>{item.name}</Text>
                                <Checkbox
                                    value={listedAttractions.includes(item)}
                                    onValueChange={() => handleCheck(item)}
                                />
                            </View>
                        )}
                        keyExtractor={item => item.name}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSubmitPress()}>
                    <Text style={styles.buttonTitle}>Modify Page Content</Text>
                </TouchableOpacity>
            </View>
        );
    }
}