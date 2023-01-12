import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Carousel from 'react-native-reanimated-carousel';
import * as WebBrowser from 'expo-web-browser';
import {bookmark, itinerary} from '../commonFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';

export default function RestaurantScreen({route, navigation}) {
    const {name, review} = route.params;
    console.log(review);
    
    return(
        <View>
            <Text>{name}</Text>
            <FlatList
            data = {review}
            renderItem={({ item }) => (
                <View style={styles.list}>
                    <Text>{item.userName}</Text>
                    <Text>{item.rating}</Text>
                    <Text>{item.comment}</Text>
                </View>
            )}
            />
            <View>
                <TouchableOpacity style={styles.buttonSmall} onPress={() => navigation.navigate('Add Review Screen')}>
                            <Text style={styles.buttonSmallText}>Add Review</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}