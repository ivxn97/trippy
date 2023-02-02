import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, QuerySnapshot, arrayRemove, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeleteItinerary ( {navigation} ) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEmail] = useState();
    const [itineraryArr, setItineraryArr] = useState();
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

    async function getItinerary (email) {
        var loginRef = doc(db, "users", email);
        const docSnap = await getDoc(loginRef);

        if (docSnap.exists()) {
            //console.log("Document data: ", docSnap.data());
            const itineraryData = docSnap.data().itinerary
            setItineraryArr(itineraryData);
            setShouldRun(false);
            setLoading(false)
        }
        else {
            console.log("Error", error)
        }
    }

    const delItinerary = async (activity, position) => {
        const docRef = doc(db, "users", email);
        await updateDoc(docRef, {itinerary: arrayRemove({name: activity, position: position})})
        alert(`${activity} removed from your Itinerary!`)
        navigation.replace('Itinerary')
    }

    useFocusEffect(React.useCallback(() => {
        if (shouldRun) {
            getEmail();
            getItinerary(email);
        }
    },[shouldRun, email, itineraryArr]))

    if (loading) {
        return <ActivityIndicator />;
    }

    if (itineraryArr == null ) {
        return (
            <View>
                <Text style={styles.Heading}>Itinerary is empty!</Text>
            </View>
        )
    }
    else {
        return (
            <View>
                <ScrollView scrollIndicatorInsets={{ top: 1, bottom: 1 }}>
                <Text style={styles.HeadingList}>Remove From Itinerary</Text>
                <FlatList
                    data={itineraryArr}
                    extraData={itineraryArr}
                    renderItem={({ item }) => (
                    <TouchableHighlight
                    underlayColor="#C8c9c9"
                    onPress={() => delItinerary(item.name, item.position)}>
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