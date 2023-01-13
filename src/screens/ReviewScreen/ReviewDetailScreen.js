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
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, Button, Div } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function ReviewDetailScreen({route, navigation}) {
    const {userName, rating, comment, email} = route.params;
    const [currenUserEmail, setCurrentUserEamil] = useState('');

    const getUserInfo = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            if (email !== null) {
                setCurrentUserEamil(email);
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
    if (email === currenUserEmail) {
        return(
            <View>
                <View style={styles.desc}>
                    <Text>
                        <Text style={styles.text}>User Name:</Text>
                        <Text style={styles.textNB}> {userName}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Ratings:</Text> 
                        <Text style={styles.textNB}> {rating}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Comments:</Text> 
                        <Text style={styles.textNB}> {comment}</Text>
                    </Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.replace('Add Review Screen')}>
                                <Text style={styles.buttonSmallText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.replace('Add Review Screen')}>
                                <Text style={styles.buttonSmallText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        return(
            <View>
                <View style={styles.desc}>
                    <Text>
                        <Text style={styles.text}>User Name:</Text>
                        <Text style={styles.textNB}> {userName}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Ratings:</Text> 
                        <Text style={styles.textNB}> {rating}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.text}>Comments:</Text> 
                        <Text style={styles.textNB}> {comment}</Text>
                    </Text>
                </View>
            </View>
        )
    }
}