import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from '../../../config';
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, Button } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function ReviewScreen({route, navigation}) {
    const {name} = route.params;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [email, setEamil] = useState('');
    const [review, setReview] = useState([]);
    const [restaurants, setRestaurants] = useState([]);

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        querySnapshot.forEach(documentSnapshot => {
            restaurants.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        });
        
        restaurants.map((item) => {
            if (item.name === name) {
                setReview(item.review);
            }
        });

        setRestaurants(restaurants);
        
        setLoading(false);
    },[]);

    const getUserInfo = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setEamil(email);
                //console.log(fullName);
            }
            else {
                console.log("No Name Selected at Login")
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    getUserInfo();
    return(
        <View>
            <Text>{name}</Text>
            <FlatList
            data = {review}
            renderItem={({ item }) => (
                <TouchableHighlight 
                underlayColor="#C8c9c9"
                onPress={() => navigation.navigate('Review Detail Screen', {userName: item.userName, rating: item.rating, comment: item.comment, email:item.email})}>
                <View style={styles.list}>
                    <Text>{item.userName}</Text>
                    <Text>{item.rating}</Text>
                    <Text>{item.comment}</Text>
                </View>
                </TouchableHighlight>
            )}
            />
            <View>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.replace('Add Review Screen', {name})}>
                            <Text style={styles.buttonSmallText}>Add Review</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}