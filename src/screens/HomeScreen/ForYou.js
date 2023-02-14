import React, { useEffect, useState, useRef } from 'react'
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../../config';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import * as React from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

export default function ForYou({navigation}) {
    const [email, setEmail] = useState('');
    const [items, setItems] = useState([]); 
    const [interests, setInterests] = useState()
    const [user, setUser] = useState(null); 
    const [attractions, setAttractions] = useState([])
    const [paidTours, setPaidtours] = useState([])
    const [mergedArr, setMergedArr] = useState([])

    //Get email from Async storage
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

    const getUser = async () => {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(documentSnapshot => {
            items.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
            
        });
        setItems(items);
        setUser(items);

        const filteredInterests = items[0].interests.filter(interest => interest.isChecked === true)
        .map(interest => interest.name)
        console.log(filteredInterests)
        setInterests(filteredInterests)
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

    const mergeArr = () => {
        mergeArr.push(...attractions);
        mergeArr.push(...paidTours);
    }

    useEffect(() => {
        
    },[])


}